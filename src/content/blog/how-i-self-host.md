---
author: Josh Bicking
pubDatetime: 2018-12-17T00:00:00Z
title: How I self host
postSlug: how-i-self-host
featured: false
draft: false
tags:
  - tech
description: ""
---

## Why self host?

Self hosting applications is important to me. Intelligent, talented people have written freely available alternatives to giant services like Dropbox, GSuite, messaging applications, hypervisors, anything you can think of. These come without the restrictions of free accounts: rate limits, storage limits, and snooping. Plus, many of my favorite games allow hosting a custom server, ensuring these games will never die to the inevitable “server shutdown”.

Hosting your own services gives you a significant level of control over your data and interactions with technology. In many ways, it's more convenient.

## Hardware

[I started experimenting with docker-compose a few months ago](deploying-your-server-with-docker-compose), finagling a setup that fit my needs. This was running on an old HP business desktop with a Pentium CPU. That poor thing.

I picked up a Dell Precision R5500 from a friend: this thing will handle any and all self hosting needs of mine for the foreseeable future.

I chose Debian Stretch w/ ZFS, following [the zfsonlinux guide](https://github.com/zfsonlinux/zfs/wiki/Debian-Stretch-Root-on-ZFS). No issues with it so far. I went this route for Proxmox compatibility.

But this guy is destined for so much more than Proxmox. Let's get started.

## Dabbling with Dokku

Dokku, the self-hosted replacement for Heroku, seemed like a more robust alternative to my docker-compose setup. I gave it a shot, but ultimately stuck with compose.

### Dockerfiles are second-class citizens

[As described in the Dokku documentation on Dockerfiles](https://github.com/dokku/dokku/blob/master/docs/deployment/methods/dockerfiles.md), they don't enjoy the same comforts as buildpack-based applications. Passing environment variables and exposing ports is a bit more difficult.

### Heavier reliance on community updates of templates

To save CPU time, I want multiple services to connect to a /single/ database instance. This violates the atomicity of the container model to some extent, but so long as permissions are configured correctly, I don't see it as a problem.

Dokku doesn't work this way by default. Each app that uses Postgres gets its own Postgres container.

There's a buildpack that solves this problem, aptly named [dokku-psql-single-container](https://github.com/Flink/dokku-psql-single-container). This hasn't been updated to support Postgres 10 or 11. I don't know if it ever will.

You can't connect multiple apps to the default Postgres. It expects a single app to be using the single database it contains, and single username/password pair.

This isn't a problem with Docker.

## My setup

Install Debian Stretch on ZFS (using the zfsonlinux approach, linked above)

Install Proxmox on Debian Stretch. Watch out for Proxmox's bridge creator: it didn't take DHCP into account and killed my internet connection on reboot. I had to configure it manually.

```
auto vmbr0
iface vmbr0 inet dhcp
bridge-ports enp36s0f0
bridge-stp off
bridge-fd 0
bridge-vlan-aware yes
bridge-vids 2-4094
```

This homebrewed Proxmox + ZFS setup has a couple issues. I made a `VMs` pool to store VM images on, but Proxmox refuses to load templates or ISOs onto that pool. I'm not sure if this would be a problem if I installed Proxmox VE or not.

I considered enabling de-duplication on the `VMs` pool. Given it can take its toll on system resources, and I'm a ZFS newbie, I decided to avoid it for the time being. I could see it coming in handy though: if I'm running a dozen VMs, each of the same OS, with the same libraries and data, I could save a few gigs of drive space. In theory.

[Install docker-compose on Debian.](https://docs.docker.com/compose/install/#install-compose) Be sure to tell Docker to use ZFS storage. [Then throw all your services in there.](deploying-your-server-with-docker-compose)

So far, this is really nice! I plan to export snapshots weekly, and use rclone or another backup solution to move them offsite. It'll be nice to snapshot Proxmox VMs and Docker containers at the ZFS level.

I should have put my OS on an SSD, and kept a pool of spinning drives for data. IO heavy operations mean a shell takes forever to pop up. Ah well.
