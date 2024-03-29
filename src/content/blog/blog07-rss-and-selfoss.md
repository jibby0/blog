---
author: Josh Bicking
pubDatetime: 2019-03-03T00:00:00Z
title: "blog07: RSS and selfoss"
postSlug: blog07-rss-and-selfoss
featured: false
draft: true
tags:
  - hfoss
  - life
description: ""
---

Update: check out [Miniflux](https://miniflux.app/), which has similar functionality & more regular updates.

---

About a year ago, I realized just how sick I was of social media-esque news aggregators. By that I mean Reddit and Hackernews. They were huge timewasters, and their navigation style was a pain. I see news reading as a linear, email-style task: view the articles in front of me, read or discard them, and we're done for the day.

Plus, the comments weren't always... the most intelligent.

RSS is an interesting technology: most browsers ship with support for it (until recently), there are plenty of readers to choose from, and nearly all sites support RSS feeds. It's once of those pieces of tech that hasn't really gotten a replacement, or needed one. In principle, it works pretty well in a modern age.

When there's support for it.

For the life of me, I couldn't find a nice RSS aggregator for Android. Most of them used odd formats (which meant I couldn't read on my laptop too, without some ad-hoc conversion), or were just clunky.

## selfoss: an RSS reader for the modern(?) era

selfoss is a self-hosted service for gathering and categorizing RSS feeds. It supports multiple users, grouping feeds, sorting feeds, and many database backends.

The selling points for me though: a solid web app, and a just as solid Android app.

Since both apps were just frontends to the same service, I didn't have to worry about passing files between my phone and my laptop, or anything of that nature.

Getting started was really simple! Check out the [selfoss webpage](https://www.selfoss.aditu.de/), [Github Repo](https://github.com/SSilence/selfoss), or the [Docker image I use](https://hub.docker.com/r/hardware/selfoss). The configuration is easy: create a `config.ini` from the included `default.ini.` Set up a database if you want to (otherwise, it'll use the included sqlite backend), and that's it! Accessing the service through your web browser will prompt for the configured username and password, and you can begin adding RSS feeds.

### A couple gotchas

- *Be sure to set up SSL, especially if you use the Android app.*
  - From the app, as of writing, requests are done a little differently. Instead of saving a cookie on login, the login username and password is sent as URL parameters. By that I mean, it'll send tons of requests in the form of `http://selfoss.example.com/?username=myusername&password=mypassword`. This means *login info will be regularly sent in plain text*. Don't do that.

- *Feeds only update when you tell them to.*
 - As the selfoss installation section illustrates: Create cronjob for updating feeds and point it to https://yoururl.com/update via wget or curl. You can also execute the cliupdate.php from commandline. The Docker image linked above does this automatically, and is configurable via the CRON_PERIOD envvar.

## So, uh. Where the feeds at?

In more places than you might think.

Most every news site will have a `/rss` or `/feed` page. Or a web search for “washington post rss” will link you to it. Many have different feeds for different topics too.

WordPress and other blogs will generally have a feed available, sometimes by tag or category.

Reddit has them too! `reddit.com/r/linux/.rss` will get you a feed for the hottest posts on the sub. I started my RSS feed gathering journey by picking the top news sites and programming blogs on my favorite subreddits. I've mostly removed subreddits and multireddits from my RSS feeds, as I've found the sources I like and don't like.

As an added bonus, I get news earlier than my Redditor friends do. 🙂

selfoss lets you export your feeds and their tags as well! So if you're curious, [here's where my tech, political, and local news are all coming from](https://pastebin.com/p59wKP0H).

## Keeping up

RSS and selfoss work really well for me, and help me keep up with what's going on around the web.

New organizational tools and technologies are nice to check out, but sometimes a new take on an old classic hits the spot.
