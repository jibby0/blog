---
title: 'Enterprise Self Hosting'
tags: Tech
---

Ice-cold take: Kubernetes wasn't made for a homelab.

"we have k8s at home"
k8s at home: https://github.com/k8s-at-home/charts/issues/1761

# Why go through all the hassle?

In a software ecosystem sponsored by tech giants, what priority is given to *scaling
down*?

I don't mean `kubectl scale ... --replicas=1`, but scaling down complexity to match simple setups, or maintaining simple setups as a first-class citizen.

For a reliable, (mostly) hands-off garage setup, I don't need load balancing,
autoscaling, AZs, or any "real business" concept of uptime. I need basic
failover & easy management.

It's easy to nudge these use cases towards a less enterprise-specific tool.

I tried Docker Swarm. It works for now, but it wouldn't be wise long term.
While there isn't an official death certificate, updates from the Docker team
have been sparse. Improved features in other OCI-compliant container runtimes,
such as GPU passthrough, are
[unsupported(?) in Swarm](https://github.com/moby/swarmkit/issues/1244).



Rarely are computing problems as straightforward as "simple, or complex?".
Generally, a complex solution is one with extra engineering time put into it,
designed to cover more ground in a specific domain (be generic, be resilient,
allow easier expansion, etc.)

In the Software Engineering world, adding `<Thing>` support to your
application can be as simple as writing `class <Thing>`, but maybe you want
a forward-thinking `Abstract<Thing>` for clients to implement, or a full-blown
`<Thing>Factory` approach, implementing some `<Thing>FactoryInterface` even.

How do you know which to choose? When should the "enterprise" solution be
skipped in the name of simplicity?

The answer heavily depends on the use case, but a handful of one-offs or
shared solutions may benefit from the simpler approach. Generally, you'll
point to predicted growth, domain information, & other system factors before
deciding which pattern fits best.

# Downscaling the enterprise for the simple

In the software writing example, "downscaling" just means writing less code,
or writing 1 class instead of 2-3 classes. Pretty easy! All the same tools
are available (libraries, builtin language constructs, etc.), just less of
them are used, generally.

After a handful of failed homelab setups, I wanted to apply the same
complexity analysis to the sysadmin world, and take a good look at my use
case. Before picking a cool hosting technology to jump to, what did it offer?
More importantly, what does it cost me?

Downscaling in the sysadmin world is not always so straightforward. If you're
looking to avoid the complexity of a full-blown k8s instance, but still want
the advantages k8s offers, there's options! ~minikube~, ~k3s~, and ~microk8s~
come to mind. Pick one of those, and you're on your way to HA setups &
self-healing, right?

While these will leave a smaller footprint & simplify initial setup, the
interface remains the same. And the interface has a steep learning curve:
there's so many terms and concepts to learn.

Separate from the cost of deployment is the cost of understanding the interface.
If you want to avoid learning helm charts, you can use straight ~kubectl create~
commands, but many other options exist for k8s.

This is also something a cloud provider likely won't help with: sure, they
provide k8s as a service, but you won't escape understanding the interface!

A reasonable "step down" from k8s is Docker Swarm, or Compose: it offers
service replicas & multi-node setups, without the rich storage capabilities
or HA promises. However, those interfaces are completely different! We use
different tools to create nodes, check on deployment status, debug deploys,
etc. Soon, they won't even share the same underlying technology:
[k8s is moving away from docker as a container provider](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/)!
Some paradigms carry over (base images, containers, health checks)

Every time we pull off a layer, we're looking at a new interface: straight
~docker~, or another containeration solution (lxc, podman), or a completely
different compartementalization solution (VMs, chroots, systemd-nspawn,
jails). The interface is simplified significantly, but not a lot of skills
carry over: I'm only unfamiliar with jails, and I'm sure I'd be lost if I dug
into them!

# We'll expand later!

Part of my [3rd self hosting attempt](/How-I-self-host/) was built to allow
swapping a VM with a NAS, if I wanted more space or bare-metal systems in the
future. I didn't think about all the infrastructure that comes along with that:

- Would storage be split across my existing hypervisor & this NAS? ZFS would
  no longer be on the table. However, if only 1 box handled storage, the SAS
  drives in my current box wouldn't get any use.
- Will this node have IPMI? My hypervisor currently does not, will I just
  have to live with 1 IPMI machine out of 2? How will I orchestrate bare metal?

The best way to prepare for expanding later, is to have a working example.
"One node, to be turned into a two node HA setup later" is significantly less
valuable than "Two node HA setup, to be turned into a three node HA setup
later". The challenges of multi-node systems are addressed first-hand.

# Starting from the bottom

Self hosting can be as complex & reliable as enterprise hosting, but
certainly doesn't have to be: a static site on 1 bare metal host counts! My
first self-hosting setups were `apt-get install`ing services onto a RasPi.

Breaking down the most straightforward approach, what do we gain with
complexity at each layer?

## Storage

### Backups/Recovery

## Reverse proxy

## Installation process

## Maintenance

## Availability

## \# of hosts

# Evaluating Hosting Needs

Having experimented with different setups before, I knew what criteria I
wanted from a new solution.


Resilancy & availability - how much do you need?
Kubernetes
HAProxy
Docker Swarm
Docker (Compose)

Backups

Complexity

Alerting, Maintenance need, & maintenance urgency

Learning curve, investment cost

Alerting & urgency of alerts

# A summary of previous setups

## Docker Compose.. & throw in a VM too.

The setup to beat started with docker-compose on Debian with ZFS, using
Proxmox on top for one-off VMs. This worked well-enough for a couple years
(with some slight modifications), but was very hands-on & performed poorly.

## Storage

ZFS performance issues got worse with time. During typical guest use (syncing
files to Nextcloud, watching something on Jellyfin, etc.), performance varied
depending on how the VM disk was backed. `zvol` volumes would regularly eat all
CPU & do little I/O, while file-backed qcow2 volumes worked a bit better. The
problem amplified itself as the volume filled.  Writes would slow down to tens
or hundreds of kilobytes, seemingly for no reason.

I'm sure ZFS is configured improperly somewhere along the chain, but I don't
want to look at thousands of dials, trying to determine which needs turning.

### Backups/Recovery

ZFS snapshots make on-system backups a breeze, & ZFS send makes offsiting a
breeze. Not much to complain about here.

## Reverse proxy

## Installation process

## Maintenance

This old Dell R5500 didn't have IPMI, hurting the viability of remote
maintenance. Any system updates or networking changes included their share of
finger crossing. Many things could go wrong on this single machine.

## Availability

## \# of hosts

- Sharing files was a pain: there was no way to access media & other content,
  and difficult to share only some of it. Static NGINX sites behind .htaccess
  files are not ideal.
- Performance issues: the backing zpool was a RAIDZ2 (ZFS-native RAID 6).
  Traditional RAID makes it difficult to have both write speed & data
  resilancy.

I tried to address the maintenance issue by separating containers & data into
two separate VMs: a "web-facing" VM and a "NAS" VM. This set the stage for a
future hardware NAS, and made remote maintenance less scary, but was still
more fragile than I had hoped.

## Docker Swarm & HA storage

Ultimately, I decided on a hyperconverged Ceph + Docker
Swarm cluster, with Traefik reverse-proxying services. This replaces the
self-hosting setup I wrote about a while ago, focusing on resiliancy and
minimal continued maintenance.
