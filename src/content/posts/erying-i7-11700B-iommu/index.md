---
published: 2024-04-22
title: "Enabling IOMMU on an Erying i7-11700B"
draft: false
tags:
  - tech
---

I could only find this information in passing on a [Craft Computing PCIe Passthrough video](https://youtu.be/_hOBAGKLQkI?t=390). Shoutout!

In short:

`Advanced -> CPU Configuration -> Intel (VMX) Virtualization Technology -> Enabled`

![](./vmx.jpg)

`Chipset -> System Agent (SA) Configuration -> VT-d -> Enabled`

![](./vtd.jpg)

