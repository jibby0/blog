---
author: Josh Bicking
pubDatetime: 2016-10-15T00:00:00Z
title: NTR and HID
postSlug: ntr-and-hid
featured: false
draft: false
tags:
  - 3ds
description: ""
---

Update: a rough how-to is in [this update post](l-equals-a-update-its-been-done).

---

Off and on over the past month, I've set up astronautlevel2's BootNTR fork, imthe666st's NTRClient fork (a debugging tool for NTR), and have played around with reading and writing to the HID Shared Memory of the 3DS. The results have been... underwhelming.

The entire “plugin” for NTR is an object module (in the general case, compiled from C source). In it, you include the list of cheats, an array to keep track of which are enabled, and other various helper functions to make an organized, toggleable list. That sounded great at first, as I wouldn't have to (only) work with absolute addressing, which was the case with Action Replay, Gameshark, etc.  But, after messing with several different configurations and options for writing and reading, I'm still not sure what I'm doing wrong.

The HID Shared memory starts off at a different place for different applications. Looking at HID dumps from the debugger while pressing no buttons at all, and then pressing A, that spot was `0x10000000` for VC Pokemon Crystal:

![](/assets/ntr-and-hid/crystal-dump-diff.png)

(The dump started from `0x0FFFF000`, hence the `0x1000` offset.)

`0x1000001c` seemed to be where the press was written, although the bit layout was a little strange.

*Nothing pressed:*

```
Read(0x1000001C, 0x4, pid=0x10)
Read memory: 00000000
```

*A button (bit 0):*

```
Read(0x1000001C, 0x4, pid=0x10)
Read memory: 01000000
```

*Right on the D-Pad (bit 4):*

```
Read(0x1000001C, 0x4, pid=0x10)
Read memory: 10000000
```

*R button (bit 8):*

```
Read(0x1000001C, 0x4, pid=0x10)
Read memory: 00010000
```

Little Endian format. Right.

However, we can't just write to the live input. The 3ds stores the recent input data in indexes below (the several 0x01s under that address in the picture above). So, grab the index, and write the button press to that location, right?  Sounds simple. I even found a snippet on GBATemp claiming to do just that (with bots at intervals, rather than button presses, but that wouldn't be too hard to modify). I figured I was set.

But it won't do anything. Writing to the index, writing directly to the input, writing to every index at each step repeatedly, and combinations of everything listed above, and I still can't send a button press to the 3DS. I know it's possible: there's no code, but there's a nice write up of sending button presses to the 3ds over WiFi.

The only thing I can think now is something pertaining to NTR. That code snippet wasn't made to be used as an NTR plugin, but I didn't think that'd be an issue.  But NTR gets button presses from an assembly plgGetIoBase function. I don't know if it does this to determine the HID shared memory automatically, or if it caches button presses elsewhere, and reads from those with its own separate functions.

I tried writing an “NTR style” plugin for this with the example code's WRITEU functions (for writing unsigned 8, 16, and 32 bit values). I got what IoBasePad pointed to (as determined by plgGetIoBase), flipped the bits (as that's what NTR's getKey() function does to get presses from IoBasePad) and wrote that back to where IoBasePad pointed to. And the game crashed.

Looks like this'll be trickier than I thought.
