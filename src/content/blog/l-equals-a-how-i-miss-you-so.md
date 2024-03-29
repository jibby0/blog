---
author: Josh Bicking
pubDatetime: 2016-09-21T00:00:00Z
title: L=A, How I Miss You So
postSlug: l-equals-a-how-i-miss-you-so
featured: false
draft: false
tags:
  - 3ds
description: ""
---

Update: a rough how-to is in [this update post](l-equals-a-update-its-been-done).

---

Nintendo semi-recently released Generation 1 Pokemon games on the 3DS through the eShop, and they've been a hit. The implementation of the Game Boy's link cable via 3ds wireless in Virtual Console meant you could relive the battles and trades of the original systems. More recently, the 3ds hacking community worked to pull together [the same functionality for Gen 2 VC injections](https://gbatemp.net/threads/release-pokemon-gold-silver-and-crystal-virtual-console-wireless-linking-patches.439986/), meaning (hacked) VC Gen 2 games are able to trade and battle each other through wireless, as well as communicate with VC Gen 1 games. My dream of reliving my Game Boy-centered childhood was complete. Almost.

I forgot about one wonderful quality of life feature that was missing in the first two games. You couldn't play the game with one hand, due to the button layout. Gen 3 added a convenient L=A button configuration, allowing you to move with your left thumb and select with your left index finger, leaving your right hand free. I find myself hitting L constantly on these re-releases, and wondered if there was a way to remap buttons through homebrew, custom firmware, or VC modification.

VC modification seemed like the easiest way to go. No messing with the rest of the system, just modify the keybinds within the individual game. However, knowledge of VC mechanisms seems to be limited. What is and isn't posted online about the inner workings of various 3ds subsystems is hit or miss. Injection of games seems to be the most popular: that involves ROM injection into a VC game of the same console, and changing the banner, logo, title ID, etc. Nothing that can help as of now.

As of now, the most promising method seems to be NTR CFW. It's a slowly aging custom firmware that focuses on extensibility and innovation unrelated to piracy. It seems to be more of a tool to run on top of a CFW, which is what its successor claimed to be. That successor appears to be BootNTR, and a fork seems to be keeping it alive on newer system versions. The actual process of writing plugins is a bit fuzzy, but hopefully enough tools exist from the old project and are still compatible with the newest versions.

Soon, L button. Soon.
