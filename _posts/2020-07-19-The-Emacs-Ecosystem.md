---
tags: Tech Emacs Rant
title: 'Emacs needs Interfaces: ELisp & the Emacs Ecosystem'
---

I've been an Emacs user for the better part of four years. A simple
requirement is making me rethink that, after seeing how original design
decisions hold up, 30+ years later.

## One Static Blog later, posts are mostly written in Org mode, but written in VSCode.

This past Memorial Day weekend, I decided to play around with static site
generation for a new blogging platform.

I've used a self-hosted Wordpress site for a while now, but I don't use it
enough to justify the resources. Plus, I found its new "blocks" WYSIWYG editor
wasn't the friendliest to links or code.

When dealing with links and code in prose, what better choice than a markup
language? I'd love to use some form of markup, and avoid spending tons of time
styling.

Those requirements lead me to Jekyll.

### Jekyll and Org?

Org is an excellent package in the Emacs ecosystem. I love the Emacs-native code
snippet styling, simple LaTeX, and ease of exporting to other formats.
`org-latex-export-to-pdf` was incredibly useful in college: I know enough about
LaTeX to write math, but when organizing responses on an assignment, I'd prefer
to let Org handle it.

I set out with a simple goal:

-   Write blog posts in org mode.
-   Publish them with Jekyll.

This should not be a challenging problem: Org has been around for a while,
Jekyll has been around for a while. Surely a plugin exists to tackle this exact
task. Or at worst, go from Org->Markdown (even Org->HTML), and let Jekyll take
it from there.

### A breeze through Jekyll

If you've heard of Jekyll before, here's a brief intro, relative to what I'll be
touching.

Jekyll generates a cohesive, static site from various markup templates.  I'm
using it for a blog, but it offers collections, several templating/layout
options, and more.

For my use case, markup goes in `_posts`, and is added to a list of posts on the
home page. Example:

    // _posts/2020-05-24-Hello-world.md
    ---
    title:  "Welcome to Jekyll!"
    date:   2020-05-24 17:33:51 -0400
    categories:
      - category1
      - category2
    tags:
      - tag1
      - tag2
    ---

    Hello world!

On `example.com`, this will generate `http://example.com/2020-05-24-Hello-world`
with the requested tags + content.

### Current Org+Jekyll support

In traditional Emacs fashion, you have your pick of solutions. [Worg lists a
majority of popular ones.](https://orgmode.org/worg/org-blog-wiki.html) Many
looked out of date or unmaintained, but some looked promising.

Using that list + some searching, I had a handful of projects to try
out.

*All of them fell short for one reason or another*, which
was surprising. I'd always been able to find (or tape together) a
solution to fit my needs. It encouraged me to explore each potential
solution a bit deeper.

What about Org or Jekyll was special here? Other integrations (Git, GCC,
etc.) were excellent, why not Org and Jekyll?

#### [jekyll-org](https://github.com/eggcaker/jekyll-org)

`jekyll-org` is a Jekyll plugin, allowing Jekyll to treat `.org`
files as any other markup file, and auto-generate pages from it.

This means Jekyll handles everything: no exporting through Emacs
necessary. Sounds great! Less I need to remember before publishing.

I tried adding a code snippet. Org indicates a code block using the
following format.

    #+BEGIN_SRC python
    import pprint
    pprint.pprint("Hello world!")
    #+END_SRC

In my editor, syntax highlighting is all honky dory. Syntax
highlighting is borderline essential for a tech blog: I post various
code snippets so folks can follow along, so it's a must-for the
rendered output.

For one blog entry, this snippet gave me some hassle (ARM assembly):

    // A ==> B
    MOV R3, #0x2 // R3 Button mask
    MOV R4, #0x3 // R4 EOR mask
    AND R5, R6, R3 // Extract desired values

When this rendered, each token was given a
`span` tag, so it can be identified and highlighted individually.

*But* the second `MOV` instruction had a different class
than the first? And comments were given an `err` class, but
the first "token" in the comment (`A`) was a seemingly valid `nf` class?
What was this library doing under the hood?

To avoid running Emacs every time Jekyll publishes, `jekyll-org` uses
[org-ruby](https://github.com/wallyqs/org-ruby). This library + standalone
program handles conversion from Org to a handful of popular formats. It's used
by GitHub and GitLab to render `.org` files, too.

`org-ruby` isn't feature complete, unsurprisingly. The Org manual
is **[big](https://orgmode.org/manual/)**, and it's the closest
thing Org has to a specification. This makes the [[two interoperable
implementations](https://www.w3.org/2005/10/Process-20051014/tr.html#cfr)]
rule tough, much less a modest subset such as `org-ruby`.

`jekyll-org` supports syntax highlighting with
[pygments.rb](https://github.com/tmm1/pygments.rb), a Ruby library.
(Note: Jekyll no longer uses it under the hood, and instead uses
[Rouge](http://rouge.jneen.net/). No idea if this will stop working
in a newer version of Jekyll.)

Since I'm essentially using two Org implementations, there will be
discrepancies between what I see & what's actually rendered. And
you can forget about [Evaluating Code
Blocks](https://orgmode.org/manual/Evaluating-Code-Blocks.html) to
show code output alongside source. So I can't use any advanced Org
features with this library.

Not a deal breaker, but certainly disappointing.

#### Using Emacs to export Org as HTML

Jekyll supports a handful of markup formats: one Emacs-compatible approach is to
export a `.org` as another markup format, and hand that off to Jekyll.

Off the bat, I'm not that fond of this approach.

Going from `source->target` to `source->inbetween->target` I can accept, since
the `inbetween` is essentially just an HTML body that Jekyll drops into a new
page.

What I don't like is the placement of the burden: myself. I need to remember to
export Org as HTML before I commit, or even when I want to test something.

This is partially mitigated by git hooks, but [git hooks are hard to
manage](https://www.viget.com/articles/two-ways-to-share-git-hooks-with-your-team/).

[Worg has a tutorial for
Org->HTML](https://orgmode.org/worg/org-tutorials/org-jekyll.html), and Org
supports "publishing" configured projects for situations such as these.

The example worked well-enough (it was difficult to customize, but more on that
later). This approach *also* had syntax highlighting problems. I didn't dig too
deep into how Org tries to handle syntax highlighting, but I found out how Emacs
does in-editor highlighting: a [horrible regexp
hack](https://www.masteringemacs.org/article/highlighting-by-word-line-regexp).

Under the hood, syntax highlighting + exporting to HTML is a tricky problem. You
need to know something about the target language in order to highlight it
properly. I'm not surprised this approach falls flat, especially when languages
are embedded in each other.

#### Using Emacs to export Org as Markdown

I looked at [this
solution](http://www.pwills.com/post/2019/09/24/blogging-in-org.html) a bit: it
was built by someone in a similar circumstance, trying to blog in Org by
publishing in Markdown.

It had the same syntax highlighing problems as the Org->HTML approach (not
surprising). Also, tags were not supported.

Both of these could be done, but not cleanly.

-   Instead of using Markdown's ```` ``` ```` for code blocks, use
    Jekyll's [special highlight
    tags](https://jekyllrb.com/docs/liquid/tags/), pulling the
    language name out of `BEGIN_SRC` if it existed. That'll work
    for some languages, but that page warns about languages with
    curly braces: will I have to put `{\% raw \%}` tags my Org code
    snippets now?
-   Try and parse `TAGS` at the beginning of an entry. But I'd be
    writing this parser from scratch, mostly. I need to support tags
    with spaces in them for my blog, which meant copy-pasting +
    modifying *some other* snippet of ELisp off the internet to
    balance parentheses.

Both of these were hacky enough that I doubt they'd be accepted into the
upstream package (if the user is still active, last changes were ~9 months ago).
So this route would likely mean forking, or attempting to follow any future
upstream changes. I'd rather not take on the burden of development+maintenance,
just to get my text editor configured properly.

## Emacs Lisp: beyond the kitchen sink

I ended up settling for `jekyll-org`: syntax highlighting sometimes doesn't
work, but tags work & I don't have to think about publishing.

Well, sometimes. [I can't put "no" in a
title.](https://github.com/eggcaker/jekyll-org/issues/55)

But I was curious about the design decisions that left me with this answer, and
why this piece of the ecosystem is left incomplete.

As the narrative goes: no matter your workflow, you can incorporate it with a
little Emacs Lisp. But how does a user extend the "most extensible text editor"?

### A Bit of History: Standardization(s) of Lisps

Lisp is an ancient language, and Emacs Lisp is one of many Lisp dialects. Lisp
is known for having many flavors: in the olden days, any company/college that
played around with computers would have their own implementation of Lisp.

While all these dialects look similar (full of parentheses), what functions Lisp
provided and how it behaved were not standardized. Most of these fell out of
practice after unification under Common Lisp, or no longer use the name "lisp",
(Scheme, Racket, Clojure).

Not Emacs Lisp though. Here we have yet another Lisp standard, standing proudly.
*Even though the Common Lisp standard has been around since 1984, and Emacs Lisp
appeared one year later.*

Emacs Lisp is notoriously unpleasant to work with: the
massive featureset and strange mannerisms keep myself & others at bay.

It's moderately user friendly if you approach it as a general-purpose
programming language, but I'm not looking for general-purpose tasks (add two integers & print the result to my screen),
I'm looking for a way to configure my editor!

### ELisp Design rationale

ELisp (and Common Lisp) have a similar approach to built-in functionality:
"everything but the kitchen sink". Every function or paradigm found in the Lisps
before have been included, making Lispers of several backgrounds feel at home.
That was great for adoption at the time, but painful for standardization &
readability today.

In Emacs Lisp, the first element of a list might be retrieved with `car`,
`first`, or `nth 0`.  `car-safe` is also available if you don't trust your
input, but `first` and `nth` don't have safe variants. Some styles are supersets
of others.

The oddest attribute, in my opinion, is *dynamic scoping*. Very few languages
use it nowadays. No functions are hidden or controlled by what's usually called
*scope*: what segment of a problem a function or variable is valid in. Instead,
they exist on a global binding table.

As a short example: picture a function that declares another function
within it.

```python
>>> def a():
...     def b():
...             return "b"
...     return "a"
...
>>> a()
'a'
>>> b()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'b' is not defined
>>>
```

Python (and pretty much any modern higher-level language) has *lexical scoping*,
meaning `function b` falls out of scope once we're outside the body of `function
a`.

```elisp
(defun a ()
  (defun b () "b")
  "a")

(a) -> 'a'
(b) -> 'b'
```

In Emacs Lisp, it doesn't matter where `function b` was defined, since it's
added to the global symbol table. We can use it outside of it's "scope".

[This design decision was
intentional](https://www.gnu.org/software/emacs/emacs-paper.html#SEC17), and
made in the name of flexibility. I would argue against it, in the name of
maintainability.

Dynamically scoped modifications are difficult to keep up to date. The original
developer, in this case, has essentially failed to define an interface, and the
"downstream developer" must work around this deficiency.

Interfaces are how code works nowadays. Systems are huge, and constantly
updated. I couldn't imagine pulling out a piece of MySQL and patching that
function, while trying to keep my patch up to date every single time the main
software updates. I'd need to track everywhere its used, assumptions callers
make about it, and ensure my changes don't break any of those implicit promises.

It's worth noting that Emacs has a "trigger" [to turn on lexical
binding](https://www.gnu.org/software/emacs/manual/html_node/elisp/Using-Lexical-Binding.html#Using-Lexical-Binding).
But that was only added in 2012: the ecosystem is already full of dynamically
scoped code.

## Emacs design rationale, 30 years later

So, another dialect, and unusual decision decisions. These were built on (now)
out of date development practices. Who cares? I've talked a little about
interfaces, but Emacs has gotten along well-enough with its current approach.

After trying for *far* too long to customize a piece of ELisp for this project &
hitting the roadblocks I listed, I'd like to take a short tour: how does it
feel to work with this language?

### Configuring an Org project

Going back to the [Org->HTML Worg
tutorial](https://orgmode.org/worg/org-tutorials/org-jekyll.html): one
piece covers "publishing" configured projects, for when you want to
export in a different format. It has an [example
configuration](https://orgmode.org/worg/org-tutorials/org-jekyll.html#org14785a7).

The `#org14785a7` at the end bothers me more than it should. A
Markdown-rendered page would link that header tag as
`#configuring-org-html-export`, or the like. I wonder if it'll break
next time someone updates the page.

Anyway, that example works, and you can change the hardlink to the
writer's directory if you like. But I hate that there's a hardlink in
the first place. This took me down my first rabbit hole: how to I make
that a dynamic configuration?

#### Digging myself into, and then out of, a `plist` hole

As is common with the "kitchen sink" approach, there are plenty of ways to solve
a task, and not all of them are obvious.

To the untrained eye, a dynamic working directory should be as simple as
replacing `∼/devel/ianbarton/org/` with something like
`org-ianbarton-base-directory`, a variable you've set elsewhere with `setq`, or
set as your current directory right before you publish.

However, for this example (and many other configurations), the `'` at the
beginning of that list makes it not so simple.

Lisp "quotes", as they're called, can sorta be thought of as literals. So
`'(:base-directory org-ianbarton-base-directory)` will evaluate the same as
`(list :base-directory 'org-ianbarton-base-directory)`.

We don't want `'org-ianbarton-base-directory` (a "literal"), we want
`org-ianbarton-base-directory` (a variable). In order to add dynamic data to
that list, I needed to rewrite the entire list with `(list ... )`.

Not a huge deal. It'll certainly look different than upstream, which might make
tracking upstream changes harder, but that's a minimal concern.

There was a bigger problem with this solution: it took me around an hour to
figure it out.

I had no clue how this plist should be structured when it's not a quoted list.
The big problem was the `:`-prefixed things. Turns out, those are the exact same
as quotes, except their values start with a colon. `':hello` and `:hello` are
equal.

This was a simple problem with a relatively simple solution. Maybe I even chose
the wrong solution. But I was shocked at what I needed to know to get there:

-   Basics of some Lisp: how quotes work, how lists are structured
-   How `:` syntax works, and how it implies `'`
-   How your particular package wants the lists you're setting.
    (Although I'm

configuring org with an association of keys and values, this is
not an *association list*, but a *property list*.

#### Data structure: as extensible and free as the ecosystem

"how lists are structured" and "how a package wants things" are big ones for one
similar reason: *nothing is enforcing the structure of your data*. There's a
[few](https://www.gnu.org/software/emacs/manual/html_node/elisp/Property-Lists.html)
[examples](https://www.gnu.org/software/emacs/manual/html_node/elisp/Symbol-Plists.html)
on how plists are structured, but they aren't newcomer friendly.

"A list of paired elements": what's a pair? It's not [dotted pair
notation](https://www.gnu.org/software/emacs/manual/html_node/elisp/Dotted-Pair-Notation.html),
it's literally just "one element shows up at `n` where `n` is even, and another
shows up at `n+1`".

I'll admit this structure has its uses: "overwriting" a key (I'm just gonna call
them keys, key/value pair is a much more recognizable term) is as easy as
attaching the value, then key, to the front of the list. Any functions that
search plists for a key will stop once they hit that key: the old value of the
key (sitting further down the list) will just be ignored.

However, nothing will stop you from adding a single element to the front of this
list & destroying all meaning. If `'(key1 val1 key2 val2)` became `'(badval key1
val1 key2 val2)`, all association is lost. You could maybe repair it by deleting
`badval`, but you'd need more information to delete `badval` over `val2`.

Imagine if Python contained a "swap all keys & values in a dictionary" footgun.

### Configuration at a cost

All this to say, customization on its own is not appealling enough. If it isn't
reasonably straightforward to customize something, people will look elsewhere
for functionality. Sorting through docs for an hour to learn small, critical
syntax details is not how I'd prefer to spend my time.

This field has learned in the past 30 years: people are really bad at writing
software. Tools for tracking data flow & enforcing sanity checks (either before
or during execution) have proven quite useful. ELisp comes from a time prior,
and that cost is not minimal.

## Discussions on the Future of Emacs

### <https://lwn.net/Articles/819452/>

Judging by recent discussions in the space, I don't expect these problems to be
solved anytime soon.

After 30+ years of this "jury rigging" culture, no one person
identified the root problem with introducing folks to Emacs: usability.

There are no sensible defaults in this ecosystem. "You can set your
own, therefore you will set your own" assumes a level of user
understanding. To set your own customizations, you need to understand
(at the very least):

-   Hooks
-   Maps
-   Lisp data structures

And that's just for internals. If you'd like to use external packages,
you'll be:

-   Discovering MELPA, and ensuring all packages are pulled from
    it
-   Trying to keep customizations of MELPA packages straight
-   Understanding how package loading works
-   Ensuring package pieces are loaded at the right time, to prevent conflicts
    or startup errors

Learning these, on top of ELisp (which has several different ways to accomplish
each one) is a nightmare. Kitchen sink meets overcustomization, and no newbie
wants anything to do with it.

### <https://old.reddit.com/r/emacs/comments/hkzcwu/will_guilemacsremacs_ever_become_a_reality_if_not/>

Some Reddit discussion got a little closer, but only a few give specific
rationale, or identify the technical setbacks of ELisp crust. Sure, Rust
would help the internals move to threading (or async) operations, but
ELisp is a whole different beast.

Other "rewrites are bad" and "ELisp must continue to work" rationale
is sprinkled throughout.

### Attempts to move away from ELisp

There's been various efforts to rid Emacs of this Lisp dialect, mostly with GNU
Guile. [That effort has been
slow](https://www.emacswiki.org/emacs/GuileEmacs#toc2), and is still just a
wrapper around Emacs Lisp.

Even if someone were to design a non-Elisp Emacs, it'd further divide the
ecosystem. I'm sure folks would stick with the original, just for that reason
alone.

Not to mention, the Emacs ecosystem doesn't always take kindly to criticism. If
you'd like to complain, there's a [lovely wiki entry for
complaints](https://www.emacswiki.org/emacs/WhyDoesElispSuck), full of great
examples of No True Scotsman.

Those who want a decent development environment, to develop extensions, "have
lost sight of the primary application: the editor". Having a usable environment
means plugins get maintained, instead of half-broken, ancient, black-box scripts
floating around the internet.

As long as Emacs lives, so too shall ELisp.

### Spacemacs and other "customization suites"

If someone asks me about getting started with Emacs, I have to direct them to
Spacemacs. There's just too much to learn at once in a vanilla Emacs
environment. I'm very grateful for the work the Spacemacs developers invested,
and they've done a wonderful job of turning an ecosystem disaster into a modular
set of customizable layers.

Getting started with Spacemacs only means figuring out the keybindings, and a
bit of terminology. You want to use a package? Add the layer, add your
customizations, and you're done. Simple. There won't be a layer for every
package under the sun, but it gets a new user 90% of the way there, and the last
10% is doable on your own (if you're willing to put in the time).

That being said, I don't believe these "customization suites" should be
necessary. They're solving a problem the developers refuse to: making Emacs
usable out of the box.

Sure, the devs would need to have an opinion on things. Maybe endorse some
packages, or pull more packages into Emacs itself. Is that really worse than no
standard at all?

-   For the new user, it means they can use the editor without needing to learn
    all the intricacies.
-   For the old user, they have some default overriding to do. If they've been
    an Emacs user for this long, they're used to this customization.

[One comment thread compared this ecosystem to
VSCode](https://lwn.net/Articles/819643/), and said it much better than I could.
Longstanding structural issues & a harsh learning curve.

## Org + Jekyll: What's the verdict?

I used Org as a design example, and even the org package exposes several
customization options without using functions. Stallman's original ideas for
extensability aren't even used in the most mainstream of packages (e.g. Org
projects). Yet, the entire ecosystem has to deal with the consequences.

I apologize for the endless amount of rabbit holes, but it makes for a prime
example of Emacs configuration: an ecosystem so tangled in itself, it's
difficult to make any progress, especially for newcomers.

In the end, who's to blame? Emacs? The Org crew? Jekyll?

Me, for writing this instead of writing a better Jekyll integration? Perhaps.

I believe this boils down to two connected problems:

-   There are no solid interfaces in Emacs.
-   There is no solid interface for Org.

Org is an implementation, not a contract: nothing from the outside world
can reproduce it, or work with it.

## My beliefs on the future of Emacs

Org is an excellent standard *within its ecosystem*. I don't think it'll die
there, but I think it will continue to stagnate, as will ELisp.

It won't be instantaneous or absolute. may not be immediate, or even noticable.
But there's so much techincal debt accrewed from early, poor design decisions,
plus whatever pile of hacks every user lays on top.  How do you change or
improve a piece of software in that state?

-   The ecosystem has already expressed major adversity to
    backwards-incompatability.
-   Some technical concerns are seemingly impossible. For example: how can
    threading be a first-class citizen when functions are global, and could be
    replaced/deleted at any time? Data ownership is non-existent, and hard to
    retrofit.

Whether it's belief or ability, Emacs is not moving toward modern standards. As
an example, something like lexical binding *could* help push the ecosystem
toward safe concurrency. However, its manual page says lexically bound
variables/functions are just implemented as an `alist`: essentially, another
table. This was in 2012, when multithreading had been king for well over 5
years, yet this addition did nothing to push the ecosystem in a healthy
direction.

Sure, [we got threads in Emacs 26](https://www.emacswiki.org/emacs/NoThreading),
but only one runs at a time. That wiki entry is disappointing: "A new Emacs will
have no threading" means "every time Emacs is processing something, your text
buffer will freeze", something simply unacceptable for a modern editor.

For me, after years of bending over backwards, my Emacs broke its spine.


I've been happy with my switch to VSCode, as extensions are:

-   Working out of the box
-   One-click installs
-   Customizable through a UI, or JSON

I'm sure I'll still boot up Spacemacs for the Git & GCC support alone.
But often, it's just too much effort.

