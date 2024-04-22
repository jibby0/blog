---
author: Josh Bicking
pubDatetime: 2024-04-22T00:00:00Z
title: "Enabling IOMMU on an Erying i7-11700B"
postSlug: erying-i7-11700B-iommu
featured: false
draft: false
tags:
  - tech
description: ""
---

I could only find this information in passing on a [Craft Computing PCIe Passthrough video](https://youtu.be/_hOBAGKLQkI?t=390). Shoutout!

In short:

`Advanced -> CPU Configuration -> Intel (VMX) Virtualization Technology -> Enabled`

![](/assets/erying-i7-11700B-iommu/vmx.jpg)

`Chipset -> System Agent (SA) Configuration -> VT-d -> Enabled`

![](/assets/erying-i7-11700B-iommu/vtd.jpg)

