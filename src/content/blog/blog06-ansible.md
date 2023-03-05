---
author: Josh Bicking
pubDatetime: 2019-02-26T00:00:00Z
title: "blog06: Ansible!"
postSlug: blog06-ansible
featured: false
draft: true
tags:
  - hfoss
description: ""
---

This past week was mostly be playing around with Ansible. I've been tasked with orchestrating new hardware, and tinkering with database values to squeeze out speed.

Ansible seemed like a nice tool for this task: it was easy to get started (after learning a few terms). After using it for a few days, it seems like a nice balance between templating and shell scripting.

My first thought after looking into Ansible: _why not just use shell scripts, and tons of ssh?_ The more I thought about it, it becomes a problem of scale and maintenance. Instead of shell scripts, Ansible tasks and plugins aren't ad-hoc, and they aren't maintained by me. 🙂 Having a way to run a series of commands, set values, etc., that's backed by Red Hat devs, means I have more trust in what I'm writing, and trust in the results.

## Terminology

There's a few terms to learn as you get started. But they're pretty simple.

- *task*: An action to perform. Install a package, delete a line from a file, start a service, et al.
- *role*: A bundle of tasks. For example: installing a database package, its dependencies, and then configuring it.
- *playbook*: A list of roles to run, against a list of hosts. This is the “action” bit: perform the tasks in these roles on these hosts.

## Hosts: the target machines

Hosts are listed in Ansible's `hosts` file, typically at `/etc/ansible/hosts`. This is a list of hostnames or IP addresses, placed in groups.

```
[databases]
dbhost1
dbhost2
dbhost3

[webservers]
webserver1
webserver2
```

This grouping lets you run different roles against different hosts in a playbook. For example, a role to set up the database should likely be run against the databases group of hosts, and not the webservers group.

## A simple role

Roles go in the `roles` folder, under `/etc/ansible/roles`. For an example role called `test`, we'll make a folder in roles called `test`. Any tasks that `test` performs will be put in a `tasks` folder under test.

Whew! Ok. So, at last, we can start a YAML file, at `/etc/ansible/roles/test/tasks/main.yml`.

I'm running Debian on my `webserver` group, and want to make sure Emacs is installed, for all my editing needs. Therefore, my test tasks will only consist of one task:

```yaml
---
# main.yml: tasks list for the test role
- name: Install Emacs
  apt:
    name: emacs
    state: present
```

Our tasks list has a single entry. Each entry is named with the `name` tag, and the task's module is included as the other tag. In this case, we're using `apt` to install the `emacs` package. After this task, the state of the package should be `present`.

## A simple playbook

A playbook must include hosts, and roles. In our case, both of these are simple:

```yaml
---
# playbook.yml: Configure webservers with the test role
- hosts: webservers
- roles:
    - test
```

This should go in `/etc/ansible/playbook.yml`.

Run it with `ansible-playbook playbook.yml`, while sitting in the `/etc/anisble` directory.

Depending on how you SSH into your hosts, you may need to provide a password, or tell Ansible which SSH keys to use for which host. All the options for logging into hosts are available with `ansible-playbook –help`.

## Ad-hoc commands

Another fun Ansible tidbit is informal commands. These aren't supposed to be run regularly, like playbooks, but they're useful for learning about your environment.

These are run with the `ansible` command. For example, to ensure all Ansible hosts can be SSHed into, run: `ansible all -m ping`. All your hosts should reply with a `pong`, if all is well.

## Wrapping up

I've probably put half a dozen hours into Ansible now, and already have my database servers created and configured automatically. This involved exploring Ansible's template module, some repository adding, and GPG key accepting. But all in all, not too bad! My nodes install and configure themselves, then join the DB cluster, as soon as I point Ansible at them.

I feel like this will make deployment, redeployment, and reconfiguration much easier in the future.
