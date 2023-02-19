---
author: Josh Bicking
pubDatetime: 2017-11-17T00:00:00Z
title: Mirroring a Gogs repository on Github
postSlug: mirroring-a-gogs-repository-on-github
featured: false
draft: false
tags:
  - tech
  - git
description: ""
---



Gogs makes it pretty easy to mirror another repository. Github… doesn't. While it'd just be easier to move my Gogs repository to Github, that would mean changing the remote of 3-4 local repositories. And, I wouldn't learn anything.

## Hooks, glorious hooks

Since Github won't watch our Gogs repository, we'll have our Gogs repository watch itself. If anything changes, we'll let Github know with a hook. A hook is just a series of events, triggered by another event.

In our case, the triggering event will be pushing to the repo. The events that occur will be pushing to Github.

From your Gogs repository, click on _Settings_, then _Git Hooks_.

![Git Hooks Page](/assets/mirroring-a-gogs-repository-on-github/git-hooks.png)

In the available text box, we can enter the bash script we'd like to execute:

```bash
#!/bin/bash

git push --mirror git@github.com:USERNAME/REPONAME.git
```

Replace your Github username and repository name, respectively.

To make this hook work, we'll need to grant Gogs the ability to push into your repository. From Github, click on your picture at the top right, and go to _Settings_, then _SSH and GPG keys_.

![Github Keys Page](/assets/mirroring-a-gogs-repository-on-github/github-keys.png)

Here you can view and edit SSH and GPG keys linked to your Github account. If you don't have any, or need to create a new one for Gogs (which you should), follow [Github's guide to generating and adding an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

If you substitute the user running the Gogs repository in the above guide, you should be good to go! That user should be able to access your Github account, and push updates as it receives them.

## (Optional) Getting this to work in a Gogs Docker container

If you're running Gogs from inside Docker, you may have issues with starting
`ssh-agent`, or keeping it running in your container. If that's the case, you can
add this config to your `~/.ssh/config` file as a workaround:

```
Host github.com
  IdentityFile ~/.ssh/github_rsa
  IdentitiesOnly yes
```

Even if `ssh-agent` isn't running, `git` should read this information, and use
the appropriate key when pushing to Github.
