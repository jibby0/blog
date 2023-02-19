---
author: Josh Bicking
pubDatetime: 2017-02-01T00:00:00Z
title: "L=A Update: It's been done, and here's how you do it."
postSlug: l-equals-a-update-its-been-done
featured: false
draft: false
tags:
  - 3ds
description: ""
---

This is a conclusion to my [other](l-equals-a-how-i-miss-you-so) [two](/ntr-and-hid) posts. If it can be called a conclusion: I wasn't on the right track. Or any track at all, really. I knew what HID was, so that's a start.

[Someone much more knowledgeable than me](https://www.reddit.com/r/3dshacks/comments/5r5mkl/is_anyone_working_on_button_remapping/dd6euwk/) has set up a button swapping tool based off of InputRedirection, which is in turn based off of NTR's memory patching code. Modifying the injected code to model L=A was simple.

- [Set up your 3DS Developer Environment](http://3dbrew.org/wiki/Setting_up_Development_Environment).
- Grab mikahjc's ButtonSwap3DS from GitHub, linked above. (The commit I'm using below is `2e3bbabfe1220fae51d18153835ecf680c8f1ee9`.)
- Open `injector/source/injected.s` in your favorite text editor. Remove the
  following snippet:

```
// A ==> B
MOV R3, #0x2 // R3 Button mask
MOV R4, #0x3 // R4 EOR mask
AND R5, R6, R3 // Extract desired values

// 1:1 Swap (A<==>B)
//CMP R0, R3 // See if either are pressed: 1:1 swap
//EORNE R2, R2, R4 // If so, EOR temp HID Register: 1:1 swap

// X:1 Replace (L+B==>R)
CMP R5, #0 // See if all are pressed: X:1 Replace
EOREQ R2, R2, R4 // If so, EOR temp HID Register: X:1 Replace

// Y ==> A
MOV R3, #0x1

MOV R4, #0x80
LSL R4, R4, #4
ADD R4, R4, #1

AND R5, R6, R3

CMP R5, #0
EOREQ R2, R2, R4

// B ==> Y
MOV R3, #0x800

MOV R4, #0x80
LSL R4, R4, #4
ADD R4, R4, #2

AND R5, R6, R3

CMP R5, #0
EOREQ R2, R2, R4
```

- Replace it with:

```
// A ==> L
MOV R3, #0x80
LSL R3, R3, #2

MOV R4, #0x80
LSL R4, R4, #2
ADD R4, R4, #1

AND R5, R6, R3

CMP R5, #0
EOREQ R2, R2, R4
```

5) Build with make, and you'll find the .3ds/.cia/.zip in the injector/output/ folder.
