---
author: Josh Bicking
pubDatetime: 2023-02-19T00:00:00Z
description: "Writing content? ❌ Redoing site generation? ✅"
title: "Moving this blog to Astro"
postSlug: move-to-astro
featured: false
draft: false
tags:
  - tech
  - webdev
---

As the homepage now happily announces, this blog is powered by [Astro 2.0](https://astro.build/), an extensible framework for site building.

First-class support for React & Tailwind sold me, & its SSR plugins made [Cloudflare pages deployment](https://developers.cloudflare.com/pages/framework-guides/astro/) trivial. If you have a favorite UI framework or SSR service, chances are [its a supported plugin](https://docs.astro.build/en/guides/integrations-guide/).

I really appreciate the React support for development, even when I'm only building a static site. Development is anything but static, & immediately seeing real-time content changes makes prototyping & debugging a breeze.

So far templates have been hit or miss, but easy enough to remedy, & I expect some bumpy edges with a month-old major version release. For example, AstroPaper's Open Graph image generator ([Satori](https://github.com/vercel/satori)) requires a newer ES runtime than Cloudflare Pages can support.
