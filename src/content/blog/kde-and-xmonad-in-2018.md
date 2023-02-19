---
author: Josh Bicking
pubDatetime: 2018-04-07T00:00:00Z
title: KDE and Xmonad in 2018
postSlug: kde-and-xmonad-in-2018
featured: false
draft: false
tags:
  - tech
  - window managers
description: ""
---

I love tiling window managers: I've used i3 for years, and ever since I started learning Haskell, I was curious about Xmonad. However, during my i3 experience, I missed a lot of expected features from a full desktop environment (consistent themes, background support, notifications, system trays, etc.)

Since running your own window manager with GNOME is no longer supported, and pulling it off is getting more complicated, I decided my transition from GNOME+i3 to Xmonad would swap GNOME with KDE.

A lot has changed over the years for KDE, yet all the information I could find on configuring Xmonad and KDE to work together was from the KDE 4 era. While a lot of that information was valuable, there's a few tweaks that make the dynamic duo unbeatable.

![arch btw](/assets/kde-and-xmonad-in-2018/Screenshot_20180407_155649.png)

## One monitor and beyond

KDE's workspace widget for panels is a favorite of mine, and works perfectly with Xmonad on a single screen if `ewmh` is enabled in your Xmonad config.

```haskell
import XMonad.Hooks.EwmhDesktops(ewmh)
 
...
 
main = 
  xmonad $ ewmh $ kde4Config {
 
...
```

Perfect. For a single display.

When multiple monitors come into play, however, the widget goes a bit wonky. XMonad doesn't have a concept of multi-monitor workspaces (AFAIK), so the KDE widget will show the wrong windows on a display. An applet exists to address this, but I couldn't get it working in KDE 5.

My solution, as displayed in the screenshot above: run Xmobar alongside KDE, but with the sole purpose of displaying workspace information.

The configuration performs the following:

- Configure xmobarPP to only give workspace information (I opted to ignore layout information and window titles).
- Start an Xmobar instance on each screen.
- Send log output to every Xmobar instance.
- Use `xdotool` to bring each Xmobar instance to the front, in case plasma-shell
  appeared in front of it.

```haskell
-- Only show workspaces on xmobar, as everything else will be on KDE's panels
myPP = xmobarPP { ppTitle = \_ -> ""
                , ppLayout = \_ -> ""}
 
-- Bump Xmobar to the front after plasma-shell loads.
startupList =
  [ "sleep 5 && for i in `xdotool search --all --name xmobar`; do xdotool windowraise $i; done"
  ]
 
main = do
  -- Spawn an xmobar on each screen
  nScreen &lt;- countScreens
  xmprocs &lt;- mapM (\dis -> spawnPipe ("xmobar -x " ++ show dis)) [0..nScreen-1]
  xmonad $ kde4Config {
  -- Write signals to all xmobars.
  , logHook = dynamicLogWithPP myPP {
      ppOutput = \s -> sequence_ [hPutStrLn h s | h <- xmprocs]
    }
  , startupHook = sequence_ [spawnOnce s | s <- startupList]
  }
```

## KDE keys and Xmonad keys

Keys can be set in one of two ways.

Add `additionalKeys` and `removeKeys` calls to your xmonad config:
	
```haskell
xmonad kde4Config {
  -- your config here
} `additionalKeys` myKeys `removeKeys` myRemoveKeys
```

This has the advantage of retaining keys already declared in `kde4Config`.

Or, overwrite the `keys` attribute of a config:
	
```haskell
xmonad kde4Config {
  keys = myKeys
}
```

This wipes any keys previously defined, but allows for modification of keys defined in `kde4Config`.

I use a combination of both: use `Data.Map`'s `union` to combine my keys and overwrite default keys, and then remove any I don't want.
	
```haskell
import Data.Map as M

xmonad kde4Config {
  keys        = \c -> myKeys c `M.union` keys kde4Config c
} `removeKeys` myRemoveKeys
```

This also allows custom keys to take the `XConfig` value given to them, which has played nicer with my custom `modMask`.

## Further Information

These are a few of the tweaks that make these two applications work very well together. As of today, [here is my config](https://gogs.jibby.org/jhb2345/dotfiles/commit/13e654e4edbb83ced7125e19d87d80c981c4d5b3), for reference and further configuration questions.
