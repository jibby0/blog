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

Ice-cold take: Kubernetes wasn't made for a homelab.

"we have k8s at home"
k8s at home: https://github.com/k8s-at-home/charts/issues/1761

# Why go through all the hassle?

In a software ecosystem sponsored by big tech, what priority is given to _scaling down_?

I don't mean `kubectl scale ... --replicas=1`, but scaling down complexity to match simple setups, or maintaining simple setups as a first-class citizen.

For a reliable, (mostly) hands-off garage setup, I don't need load balancing, autoscaling, AZs, or any "real business" concept of uptime. I need basic failover & easy management.

It's easy to nudge these use cases towards a less enterprise-specific tool.

I tried Docker Swarm. It works for now, but it wouldn't be wise long term.  While there isn't an official death certificate, updates from the Docker team have been sparse. Improved features in other OCI-compliant container runtimes, such as GPU passthrough, are [unsupported(?) in Swarm](https://github.com/moby/swarmkit/issues/1244).
