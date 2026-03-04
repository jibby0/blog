---
title: "MagicMirror's calendar module removing apostrophes"
published: 2025-04-09
draft: false
tags:
  - tech
---

If your MagicMirror calendar entries are missing their suffix, the module [replaces portions of event titles by default](https://github.com/MagicMirrorOrg/MagicMirror/blob/v2.31.0/modules/default/calendar/calendar.js#L51).

The project has [seemed](https://github.com/MagicMirrorOrg/MagicMirror/issues/1719) [uninterested](https://github.com/MagicMirrorOrg/MagicMirror/issues/847) in [resolving this issue](https://github.com/MagicMirrorOrg/MagicMirror/pull/1873).

Adding `customEvents: []` to your calendar module will resolve this issue.
