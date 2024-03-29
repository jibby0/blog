---
author: Josh Bicking
pubDatetime: 2017-09-01T00:00:00Z
title: "Moving from Vim to Emacs: 10 months later, here's what I've learned"
postSlug: moving-from-vim-to-emacs-10-months
featured: false
draft: false
tags:
  - tech
  - emacs
description: ""
---

I started exploring Emacs around [10 months ago](https://gogs.jibby.org/jhb2345/dotfiles/commit/fc8ef310fcf6597ebb99f4c088204a4374a6d9fc), mostly using [Aaron Bieber's posts](https://blog.aaronbieber.com/2015/05/24/from-vim-to-emacs-in-fourteen-days.html) on the subject to get started. I went into the transition with high hopes: the incredible support and extensibility of Emacs had me thinking it was simply a superset of Vim. I could do everything I do in Vim in Emacs, and more.

## The capability of Emacs to be Vim

I still believe that statement is correct. Many of the plugins and features of Vim were easily available in Emacs, usually with greater functionality or extensibility. `evil` for Vi(m) bindings and modes, `evil-leader` for a leader key, and `evil-tabs` for (pretty good) tab functionality. If I wanted, I could play with `general` instead of `evil-leader` to set up multiple leader keys. Cool!

For other features, after a couple hours of struggling to make it _exactly_ like it is in Vim, I gave up and used it the Emacs way. Usually, this took a little while to get used to, but I rarely found myself missing the way it was done in Vim. So it wasn't worth my time to strive for perfect Vim-like configuration.

## Too much extensibility? At first, maybe

I don't see this as a fault of Emacs or its plugins. They were built with customization and extension in mind, so it makes sense that more than enough configuration options would be available. And many plugins were nice enough to include their own defaults: you're welcome to read through all of [auto-complete's user manual](https://github.com/auto-complete/auto-complete/blob/master/doc/manual.md), or you can add `(ac-config-default)` to your `.emacs` or `init.el` file. Done and done. But not necessarily done the way you like.

`auto-complete` was one of the plugins that I attempted, and failed, to make work like the Vim equivalent I used ([YouCompleteMe](https://github.com/Valloric/YouCompleteMe)). I started with a laundry list of changes in mind:

- TAB and Shift-TAB to cycle through options
- Ctrl-Enter to expand on options
- Etc.

There's no doubt in my mind: implementing exactly what's available in Vim is doable. It's probably even elegantly doable. But I certainly couldn't do it: not as a newcomer.

I was trying to familiarize myself with both Emacs and Lisp. Modes, maps, faces, hooks, and several other bits of Emacs functionality were foreign to me. And Elisp is not only a new programming language, but also follows several functional programming paradigms, where I had never experienced functional programming.

Instead of struggling and fiddling for too long, I decided to do some things the Emacs way. The results were better than expected.

## The capability of Emacs to supersede Vim

I eventually stopped struggling to make every plugin work with `evil-mode`, or work the way it did in Vim. It was a bit unusual to be using `C-n` and `C-p` for up and down sometimes, but after a while, I didn't mind it.

Eventually, it became second nature to use those few Emacs bindings when I wasn't editing. Then something occurred to me.

_I was using Vim binds for editing, and Emacs for everything else._

All the complicated chords completing complicated tasks made sense, because they weren't editing. So why mesh them with my editing tools in Evil? I had several plugins, all feature-rich and heavily customizable. They came, out of the box with sane Emacs defaults: defaults which, after working with those little pieces of Emacs where I couldn't use Evil, made perfect sense.

## Where to start with Emacs?

My advice to anyone thinking of moving from Vim to Emacs, or just trying Emacs: give some thought to [Spacemacs](http://spacemacs.org/). Instead of handling these complicated, wonderful features the Emacs way, it handles them in a Vim(ish) way: you have a Leader key, but often still need to press 2-3 keys to perform an action. Even better, however, is you can feel at home in a Vimlike environment, without needing to learn Elisp.

If you refuse to use a config you didn't use yourself, like me, go through the
[Elisp Intro](https://www.gnu.org/s/lispintro/) first. That way, you won't be completely in dark when struggling to understand why snippets of another person's config won't work. Speaking from experience, it's not fun.

This setup, so far, works for me. It's strange, but having an “editor mode” and a “everything else mode” fits really well with my workflow. As a bonus, things usually work out of the box, too. Sometimes I'll stray from it if I can find a `evil-X` plugin for package `X`, but normally, I don't mind whatever bindings come out of the box.

Things working as other things are never perfect, and Emacs is far from perfect.  At times, it feels like a Lisp interpreter with a display hacked onto it. The more I use it, however, the more I enjoy the customization, features, and extensibility.
