---
author: Josh Bicking
pubDatetime: 2018-05-06T00:00:00Z
title: Deploying your server with Docker Compose
postSlug: deploying-your-server-with-docker-compose
featured: false
draft: false
tags:
  - tech
  - docker
description: ""
---

Finding a server setup that was not a mess, stable, and sustainable long term has been a bit of a problem for me.

## In the beginning, there were bare metal installs

When I got my home server 3 years ago, I had all sorts of services I wanted to put on it. Owncloud, Gogs, ZNC, WordPress… So I installed them all directly onto the server.

I shortly realized that backups of this setup were going to be impossible, and upgrades would be a pain.

The solution, of course, was Docker: just run each of these services in a container! I could open a single port, then use Nginx to reverse proxy connections from that port into the containers.

## The URI problem

Since I was using FreeDNS and didn't want to pay for dozens of subdomains, I created my own custom versions of containers that modified the URI of the service. Owncloud would listen on `/owncloud`, and not `/`. It was a hassle to set this up, but it worked for a couple years.

But, after about a year, this setup became an unmaintainable mess. My custom changes would need to be applied to upstream images, which would mean tracking the changes I made, reapplying them to new images, and rebuilding.

URIs would have to go. Some services flat out didn't work with them, and the few that did took hours of trial and error with Nginx configurations. That wasn't a big deal, since I was using Namecheap domains as well now.

## The solution: nginx-proxy and docker-compose

While looking for a better solution for container reverse proxying, I stumbled across [this beautiful Dockerfile](https://github.com/nginx-proxy/nginx-proxy). Seriously. I can't overstate how awesome it is.

- Finds running, configured containers, and reverse proxies them automatically.
  - At a minimum, specify your domain name when you run the container: `-e VIRTUAL_HOST=foo.bar.com` and it handles the configuration and proxying.
- Configure your port, your protocol (http or https), htpasswd options, and other settings, globally or by container.
- Optional LetsEncrypt integration via [another container](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion). Auto-generate and renew certs for the domains you provide!

As I was talking these containers over with a coworker, he had an interesting idea: set up an entire server configuration with docker-compose, and use that to deploy a series of services, all linked via the `nginx-proxy` container.

It may have been done before. I didn't check around too much. But it sounded like it was worth a shot.

## A bit on docker-compose

If you've never used docker-compose before, it's a way to bring a group of containers up/down at the same time. It's most useful for containers that rely on other containers: if your web app running on an apache container requires a postgres database, using docker-compose makes it easy to link the two, and control the state of each as a single unit.

### A short compose example

docker-compose uses a YAML file for configuration. To see it in action, create a new directory called `example`, and place a file named `docker-compose.yaml` in that directory that looks something like this:

```
version: '2'

services:
  apache:
    image: httpd
    volumes:
      - ./my-web-app:/var/www/html
    links:
      - postgres
    restart: always

  postgres:
    image: postgres
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    restart: always
```

Then `cd` into the directory, and run `docker-compose up -d`. Both services will start in the background, and the apache container can reach the postgres container:

```
# docker exec -it example_apache_1 ping postgres
PING postgres (172.18.0.2) 56(84) bytes of data.
64 bytes from dc_postgres_1.dc_default (172.18.0.2): icmp_seq=1 ttl=64 time=0.064 ms
64 bytes from dc_postgres_1.dc_default (172.18.0.2): icmp_seq=2 ttl=64 time=0.086 ms
64 bytes from dc_postgres_1.dc_default (172.18.0.2): icmp_seq=3 ttl=64 time=0.090 ms
64 bytes from dc_postgres_1.dc_default (172.18.0.2): icmp_seq=4 ttl=64 time=0.088 ms
64 bytes from dc_postgres_1.dc_default (172.18.0.2): icmp_seq=5 ttl=64 time=0.041 ms
^C
--- postgres ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4057ms
rtt min/avg/max/mdev = 0.041/0.073/0.090/0.021 ms
```

When you're done looking at it, run `docker-compose down` to take down the apache and postgres containers.

The configurations available for docker-compose's YAML file are all things you could do with vanilla docker, and the syntax is usually similar. However, it's easier to track runtime configurations when they're in a file, and docker-compose makes starting/stopping several VMs much simpler.

## My docker-compose.yaml

My docker-compose setup [can be found here](https://gogs.jibby.org/jhb2345/docker-compose-server), along with usage instructions.

Some containers required some special configurations.

### nginx-proxy

You may specify global proxy settings by placing a file containing those settings in `/etc/nginx/conf.d`. The `max_body_size.conf` file goes there, as it allows larger files to be uploaded to Nextcloud.

### postgres and mariadb

I originally tried to use scripts in `docker-entrypoint-initdb.d` to automatically perform database and user creation operations. This would truly allow for a “one command deploy”: if I'm starting up these containers for the first time, containers like WordPress would have their database created for them. Or, if I add a new container, I can simply add new create commands for the database and the user.

This ended up being more trouble than it was worth. I tried to write it strictly in SQL, but wasn't skilled enough in SQL to get something working (/warning, the following doesn't work/):

```bash
function create_db_if_not_exists() {
DATABASE="$1"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
do
\$body\$
declare
num_dbs integer;
begin
SELECT count(*)
into num_dbs
FROM pg_catalog.pg_database
WHERE datname = '$DATABASE';
end;
IF num_dbs = 0 THEN
CREATE DATABASE $DATABASE;
END IF;
\$body\$
;
EOSQL
}

function create_user_if_not_exists() {
USERNAME="$1"
PASSWORD="$2"
DATABASE="$3"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
do
\$body\$
declare
num_users integer;
begin
SELECT count(*)
into num_users
FROM pg_user
WHERE usename = '$USERNAME';

IF num_users = 0 THEN
CREATE ROLE '$USERNAME' LOGIN PASSWORD '$PASSWORD';
GRANT ALL ON $DATABASE TO $USERNAME;
END IF;
end
\$body\$
;
EOSQL
}
```

So I took the “forget error handling, just try” approach (/warning, this doesn't work either/):

```bash
function create_db_if_not_exists() {
    DATABASE="$1"

    psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" <<-EOSQL
CREATE DATABASE $DATABASE;
EOSQL
}

function create_user_if_not_exists() {
    USERNAME="$1"
    PASSWORD="$2"
    DATABASE="$3"

    psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" <<-EOSQL
CREATE ROLE $USERNAME LOGIN PASSWORD '$PASSWORD';
EOSQL

    psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" <<-EOSQL
GRANT ALL ON DATABASE $DATABASE TO $USERNAME;
EOSQL
}
```

Even this had issues sometimes. I haven't needed to redeploy yet, so this is an
issue I'll solve later. In the meantime, on first setup, the database must be
created manually, using something like this:

```
$ docker exec -it dockercomposeserver_postgres_1 bash
root@containerid# psql -U postgres
postgres=# CREATE DATABASE mydb;
postgres=# \q
root@containerid# exit
```

### keeweb

Since keeweb deals with password databases, it uses https by default.  Understandable, but it requires `VIRTUAL_PROTO=https` in its configuration, as the default is http.

### quassel and matrix

These are the outliers when it comes to reverse proxying. The short answer is, they can't be reverse proxied. The long answer is, it's at least [possible with matrix](https://github.com/matrix-org/synapse#reverse-proxying-the-federation-port), but I didn't want to set up any custom DNS records. Including matrix still makes sense, as it relies on postgres. I guess I included quassel because, while it doesn't use postgres or nginx-proxy, I didn't want a lone outlier. 🙂

## The aftermath

After running this setup for about a month, I have to say, it's been working really well.

Adding or removing services has been a pinch. I can always see or adjust the configuration I've applied to a container, without having to sift through shell history or `docker info` output.

If I need to make changes to a service, I can stop and remove the container with `docker-compose stop <container>; docker-compose remove <container>`, make my changes to `docker-compose.yaml`, then run `docker-compose up` to rebuild it and get it back in the composition.

If I had to list some shortcomings, they would be with nginx-proxy. Sometimes I want to run a service on the server OS itself. A good example would be [netdata](https://github.com/firehol/netdata): it makes sense for this to run on the server, as it gives information about the server as a whole, the docker service itself, etc. However, I can't set up nginx-proxy to point a netdata subdomain to a service on the host. In the meantime, I have netdata running in a container, with some permissions I'm not thrilled about.
