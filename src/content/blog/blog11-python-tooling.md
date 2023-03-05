---
author: Josh Bicking
pubDatetime: 2019-04-11T00:00:00Z
title: "blog11: Python tooling"
postSlug: blog11-python-tooling
featured: false
draft: true
tags:
  - hfoss
description: ""
---

Oh dear.

I love Python. It's wonderful for prototyping, and it simplifies much of high-level programming. There's a package for everything, from data science to graphics to [Chromecast communication](https://github.com/balloob/pychromecast). But I'd be lying if I said it was perfect: everything from Python 2.7 hell, to the GIL, to poor performance. And, of course, tooling.

Tooling and package management is a significant pain point of the language. It has evolved from root `pip install` s, to the rise of `virtualenvs`, to `virtualenv` management.

The terms get confusing, and new tools/methodologies are popping up all the time.

## Pip

_Pip_ is Python's package manager. It pulls packages from PyPI, the Python Package Index (not to be confused with PyPy, a JIT compiler for Python).

Pip has some difficult jobs.

Packages sometimes require lower-level build tools to function properly. [PyInstaller](https://www.pyinstaller.org/), for example, builds native executables out of Python code, meaning clients can use your Python program without installing an interpreter.

System packages (such as something installed with `apt` or `dnf`) conflict with root installs from Pip. As more of the world uses Python, this issue turns into a situation of two package managers on the same system: each has packages different dependencies, so how do they coexist? While Pip is limited only to the Python world, there's plenty of opportunity for conflicts.

## Virtualenvs

A `virtualenv` (a virtual environment) is essentially a folder in which a Python environment is isolated. Python packages and libraries are installed there. When Python is executed, it looks in this contained environment before searching elsewhere.

Creating or using a virtualenv usually just involves running a script to build, activate, or deactivate it.

## Pipenv

Cool, so we can create little sandboxes for Python packages to live in. What about projects with requirements?

Pip uses a Requirements File, which is essentially a list of `pip install` commands. Versioning is done by running `pip freeze > requirements.txt`. Not necessarily the cleanest, but it gets the job done.

`pipenv` bridges package management with virtual environments, accessing both of them with one file, and automatically keeping requirements up to date. Virtual environments are created and updated automatically. It uses a `Pipfile` format, rather than requirements, and provides means to convert an existing `requirements.txt` to a `Pipfile`. It tracks interdependencies (something `pip` doesn't do on its own) in a `Pipfile.lock` file, specifying particular versions for these interdependencies, and ensuring new installs don't pull unexpected versions.

This "lock file" strategy is similar to the one `npm` uses.

Pipenv also allows for different virtual environments within the same project: if a new series of dependencies is used in a “dev” environment, `pipenv --dev` will install those dependencies instead.

In short, I've started using this for most of my projects, and encouraged collaborators to do so as well. It's simple to install and get running with, even if you aren't familiar with virtualenvs, or most of Python's packaging woes.

## Anaconda

In the world of science though, there's a different story.

Many linguists and data scientists are familiar with _Anaconda_, a bundle for Python tooling and resources. Along the included tools are Jupyter, Spyder, IPython, etc. It also provides /Conda/, which does several of the tasks Pipenv does. It attempts to make venv creation and package installation easy, either through command line tools or a graphical interface.

I haven't used it too much personally, but interacted with it during an NLP class. The kicker is management of Python versions: easy, managed installation of various Python versions. This is especially helpful for running old 2.7 code, or other code that requires a specific Python version.

Pipenv doesn't do this: another tool bridges this gap (_Pyenv_), but its installation and setup is much less intuitive, requiring the addition of environment variables onto your shell. Conda acts the same way venvs did: run an activate script, and you're in.

`anaconda-project` is how most people interact with it on the command line. It's fairly straightforward to create a project, add dependencies to its `anaconda-project.yml` file directly, or by running `anaconda-project add-packages package1 package2`.

It has the nice bonus of downloading files upon initialization: great in NLP, when your project requires a dataset, but you don't want to distribute that giant file with your code.

Using this requires _all of Anaconda_, though. That means, be prepared to lose 3GB of space to Python tooling. Yikes.

## Looking forward

Packaging is still a hot topic: Pipenv was named “the official packaging tool” by the Python Packaging Authority, a decision met with [several cries of outrage](https://www.reddit.com/r/Python/comments/8jd6aq/why_is_pipenv_the_recommended_packaging_tool_by/).

Packaging is also a problem that's difficult to fix retroactively: kudos to Go and Rust for thinking about it, alongside language development.

I don't think Python will go away just because of packaging woes, though. So looks like we'll keep trying for a way to deal with them.
