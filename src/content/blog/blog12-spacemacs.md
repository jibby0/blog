---
author: Josh Bicking
pubDatetime: 2019-04-15T00:00:00Z
title: "blog12: Spacemacs"
postSlug: blog12-spacemacs
featured: false
draft: false
tags:
  - hfoss
  - emacs
description: ""
---

This past week at RITLug, I give a quick overview of my favorite editor and customizations. Of course, I can't imagine a text editor that doesn't include a Tetris clone, a psychotherapist, or a Tower of Hanoi player.

I'm talking about Emacs of course: undoubtedly, the most feature-rich text editor in existence. But, also, one of the least user-friendly editors.

![](/assets/blog12-spacemacs/editor-learning-curves.png)

Emacs is quite the rabbit hole. So many packages, extensions, and customizations have been built for it over the years. While VS Code and Atom advertise extension, Emacs is essentially a Lisp machine with a screen: all of its internals are exposed, meaning customization is all but limitless.

## How much freedom is too much?

That status endless customization comes at a cost, however. There aren't really rules when writing Emacs code: in its Lisp dialect (Elisp), all variables and functions are global, so anything can modify anything at any time. Often, when I attempted to customize my Emacs, there would be an odd variable or list element that I could never pin down (or, even worse, was dynamically created/modified through macros), and eventually just give up.

Freedom to customize is important, but when that customization isn't formal, it can lead to impracticality.

## Maintaining my own Emacs config

I tried keeping my own dotfiles for Emacs for a couple years.

I came from Vim, so I wanted Vim bindings, and I heard Emacs did that well. That was my first concern, and my first pain point.

Plenty of Emacs documentation still discusses Viper, a very old package that's been blown out of the water by Evil. Both of these provide vi-style bindings, but Evil does it much better, and is actively maintained.

Old docs and snippets of Elisp will live forever, because Emacs will live forever, and will never break Elisp backwards compatibility, not even to [make lexical scoping the default](https://www.gnu.org/software/emacs/manual/html_node/elisp/Lexical-Binding.html) or [add threading](https://www.emacswiki.org/emacs/ConcurrentEmacs).

Ugh.

So, once you've discovered Evil is better than Viper, then comes the question of configuring it. Evil provides its own functions for adding keybinds to different evil states. States are what Evil calls its vi modes (normal, visual, insert, etc.) because Emacs already has a concept of major and minor modes running in a buffer.

The main function for this is `evil-define-key`. It asks for a map. What's a map? A series of keybinds a mode uses. Or you can use `'global` for all maps, according to the documentation. What does that tick mean? Ah, of course, that's the name of a symbol (aka, a variable), rather than the value of the symbol itself.

Yikes. If this sounds like a lot, that's because it is.

Coming from Vim, where batteries were included with every package, minimal configuration was needed, and documentation on a plugin was (generally) a page, this was a big paradigm shift. And I'm not alone in getting overwhelmed.

People go crazy with their Emacs configs. Hell, people build [literate dotfiles in Org mode](https://to1ne.gitlab.io/literate-dotfiles/), then use its insane feature set to generate the actual config Emacs reads from that.

Many people create such complicated configs, they eventually throw them all out
and start over. This practice is commont enough to [have a name](https://www.emacswiki.org/emacs/DotEmacsBankruptcy).

## Why recommend Emacs then?

Despite the learning curve and insane amount of time it takes to configure, Emacs is still an incredibly powerful ecosystem, and integratable with any software system on the planet.

But, there are people _way better at configuring it than I am_. So good, in fact, they made configurable configurations.

A couple of these exist, namely [Spacemacs](http://spacemacs.org/). But I've heard good things about [Doom Emacs](https://github.com/hlissner/doom-emacs).

There reaches a point where I want to do work, rather than messing with my editor. It's fun, I learn a lot, and I can share what I create, but sometimes I just need autocomplete to work, or schoolwork just needs to get done.

Instead of working directly with packages and their configurations, Spacemacs abstracts these through _layers_. Layers are collections of packages with a standard configuration (such as Evil bindings, same defaults, hooks in the right place, etc.). Adding layers is simple, just add an entry to your `.spacemacs` file. Add `rust` for the Rust layer, `php` for the PHP layer, and `auto-complete` for autocomplete for both of them.

I swapped over to this several months ago: while I've had to adapt, it's nice knowing I'm not the only maintainer of my config, and that I don't have to be the only bugfixer either!

## The presentation

So, in short, what did I change to show off at RITLug, and what could I do?

All I did was add layers the Spacemacs community had already built, and show them off. So, not only was this a powerful way to config, it could also be reproduced in a matter of minutes, without learning any Elisp.

Highlights were:

- Magit (via the git layer), for visual staging and unstaging of work
- GDB visualization, Spacemacs sets `gdb-many-windows`, making GDB debugging beautiful. It also manages window sizes when adding and removing windows, which helps a lot when GDB pulls up its 6 windows.
- LaTeX rendering of math, in editor (via the latex layer)
- Remote editing (and building, and so worth) with TRAMP

## So, why Spacemacs?

Spacemacs isn't perfect: you don't get fine-grained tuning, like you do with vanilla Emacs. But, quite frankly, I don't need it. I would rather accept some unfamiliar configurations for ease of use, and still hold all the power of Emacs and its plugins.
