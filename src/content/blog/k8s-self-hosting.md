---
author: Josh Bicking
pubDatetime: 2019-02-26T00:00:00Z
description: ""
title: "Enterprise Self Hosting (I'm running Plex on Kubernetes & you can't stop me)"
postSlug: k8s-self-hosting
featured: false
draft: true
tags:
  - tech
---

# Why go through all the hassle?

Lets start with an ice-cold take: _Kubernetes wasn't made for a homelab._

But why?  What separates it from other platform technologies(?) (VMs, Docker, etc) that you can run in AWS, or in your garage?

In a software ecosystem sponsored by big tech, what priority is given to _scaling down_?

I don't mean `kubectl scale ... --replicas=1`, but scaling down complexity to match simple setups, or maintaining simple setups as a first-class citizen.

Generally the "simple setup" case for business was dev environments. For companies already running k8s in production, there's no need: everyone can use the big, complicated setup. Just create development namespaces on the same cluster/similar cluster.

For a reliable, (mostly) hands-off garage setup, I don't need load balancing, autoscaling, AZs, or any "real business" concept of uptime. I need basic failover & easy management.


It's easy to nudge these use cases towards a less enterprise-specific tool.

I tried Docker Swarm. It works for now, but it wouldn't be wise long term.  While there isn't an official death certificate, updates from the Docker team have been sparse. Improved features in other OCI-compliant container runtimes, such as GPU passthrough, are [unsupported(?) in Swarm](https://github.com/moby/swarmkit/issues/1244).


k8s-dependent ecosystems, like Helm chart builders, can't always leverage official charts & scale them down. https://github.com/k8s-at-home/charts/issues/1761



k3s was very easy to get started with: https://docs.k3s.io/installation/ha-embedded
And internals are easy to configure: https://docs.k3s.io/helm
The trickiest bit was storage. This is WIP https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/