---
author: Josh Bicking
pubDatetime: 2019-02-26T00:00:00Z
title: 'Enterprise Systems Architecting & Self Hosting'
postSlug: enterprise-sysadmin-and-self-hosting
featured: false
draft: true
tags:
  - tech
description: ""
---

## Simple, or complex?

Rarely are computing problems so straightforward. Complex solutions can be
intentional & well designed, specifically designed for a priority. Be generic,
resilient, performant, extensible, etc.

In the code world, adding `<Thing>` support to your application
can be as simple as a `def <Thing>`. Maybe you'll store state or connection
objects & go with, `class <Thing>`, or the forward-thinking `<Thing>Factory`
pattern, implementing some `<Thing>FactoryInterface` even.

So many options: which to choose? When should "enterprise" solutions be favored
over simplicity?

Answers vary per-case, but one-offs usually benefit from the simpler approach.
Generally, you'll point to predicted growth, domain information, & other system
factors before deciding which pattern fits best.

## Downscaling the enterprise for the simple

After a handful of failed homelab setups, I wanted to apply the same
complexity analysis to the sysadmin world, and take a good look at my use
case. Before picking a cool hosting technology to jump to, what did it offer?
More importantly, what does it cost me?

In the code example, "downscaling" just means writing less code, or writing 1
class instead of 2-3 classes. Pretty easy! All the libraries, language
built-ins, & other tools are still available.

Downscaling in the sysadmin world is not so straightforward. If you're sold on
the advantages of Kubernetes, but looking to avoid the complexity of a full
instance, you may try `minikube`, `k3s`, or `microk8s`. Pick one of those, &
you're on the path to self-healing & HA setups!

While these will leave a smaller footprint & simplify initial setup, the
Kubernetes API remains the same. This interface has a steep learning curve:
there's no shortage of terms and concepts to learn.

Separate from the cost of deployment is the cost of understanding the interface.
If you want to avoid learning helm charts, you can use straight ~kubectl create~
commands, but many other options exist for k8s.

This is also something a cloud provider likely won't help with: sure, they
provide k8s as a service, but you won't escape understanding the interface!

### Peel off a layer!

Okay, so container orchestrators are complicated, duh. Let's move closer to containers.

A reasonable "step down" from k8s is Docker Swarm, or Compose: it offers
service replicas & multi-node setups, without the rich storage capabilities
or HA promises.

Those interfaces are completely different! We use different tools to create
nodes, check on deployment status, debug deploys, etc. Soon, they won't even
share the same underlying technology: [k8s is moving away from docker as a
container
provider](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/)!

Some paradigms carry over (base images, containers, health checks)

_Is the complexity of each interface just the tradeoff you have to make for the benefits?_

Every time we pull off a layer, we're looking at a new interface: straight
~docker~, or another containeration solution (lxc, podman), or a completely
different compartementalization solution (VMs, chroots, systemd-nspawn,
jails). The interface is simplified significantly, but not a lot of skills
carry over: I'm only unfamiliar with jails, and I'm sure I'd be lost if I dug
into them!

## We'll expand later!

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

## Starting from the bottom

Self hosting can be as complex & reliable as enterprise hosting, but
certainly doesn't have to be: a static site on 1 bare metal host counts! My
first self-hosting setups were `apt-get install`ing services onto a RasPi.

Breaking down the most straightforward approach, what do we gain with
complexity at each layer?

### Storage

#### Backups/Recovery

### Reverse proxy

### Installation process

### Maintenance

### Availability

### \# of hosts

## Evaluating Hosting Needs

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

## A summary of previous setups

### Docker Compose.. & throw in a VM too.

The setup to beat started with docker-compose on Debian with ZFS, using
Proxmox on top for one-off VMs. This worked well-enough for a couple years
(with some slight modifications), but was very hands-on & performed poorly.

### Storage

ZFS performance issues got worse with time. During typical guest use (syncing
files to Nextcloud, watching something on Jellyfin, etc.), performance varied
depending on how the VM disk was backed. `zvol` volumes would regularly eat all
CPU & do little I/O, while file-backed qcow2 volumes worked a bit better. The
problem amplified itself as the volume filled.  Writes would slow down to tens
or hundreds of kilobytes, seemingly for no reason.

I'm sure ZFS is configured improperly somewhere along the chain, but I don't
want to look at thousands of dials, trying to determine which needs turning.

#### Backups/Recovery

ZFS snapshots make on-system backups a breeze, & ZFS send makes offsiting a
breeze. Not much to complain about here.

### Reverse proxy

### Installation process

### Maintenance

This old Dell R5500 didn't have IPMI, hurting the viability of remote
maintenance. Any system updates or networking changes included their share of
finger crossing. Many things could go wrong on this single machine.

### Availability

### \# of hosts

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

### Docker Swarm & HA storage

Ultimately, I decided on a hyperconverged Ceph + Docker
Swarm cluster, with Traefik reverse-proxying services. This replaces the
self-hosting setup I wrote about a while ago, focusing on resiliancy and
minimal continued maintenance.
