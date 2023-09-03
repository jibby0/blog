---
author: Josh Bicking
pubDatetime: 2023-09-03T00:00:00Z
description: ""
title: "Remotely controlling a ViewSonic PX728-4K's power with Google Home + Home Assistant"
postSlug: controlling-viewsonic-projector-google-home
featured: false
draft: false
tags:
  - tech
---

My theater setup of projector/AV Reciever/NVIDIA Shield works fairly well, save for one problem: if I want to stream music to the Shield, I want the AV Reciever to turn on, but not the projector. If I stream a video, I want the projector on. Controlling the projector's power through Google Home sounds the most flexible for this.

# What protocol?

My ViewSonic PX728-4K touts "Remote Management", but doesn't really say "how".

Any mention of Google Home or Alexa integrations links to their [vRemote support articles](https://www.viewsonic.com/ap/support/articleList?folder=vRemote&folderId=33000209555), an app which now appears to be [broken/delisted](https://www.viewsonic.com/ap/support/articleList?folder=vRemote&folderId=33000209555). I have to assume the vRemote accounts/services the app relies on, are also poor/broken.

A [RS-232/LAN Control Protocol Spec](https://www.viewsonicglobal.com/public/products_download/user_guide/Projector/PX701-4K_PX728-4K_PX748-4K/PX701-4k_PX748-4K_PX728-4K_%20RS232_table.pdf?pass) exists for this projector family, but surely a homegrown implementation wasn't necessary, right?

Some ViewSonic devices support older smart-home ecosystems & business-centric device management. I can't find any mention of this in my projector's [manual](https://www.viewsonicglobal.com/public/products_download/user_guide/Projector/PX701-4K_PX728-4K_PX748-4K/PX701-4K_PX728-4K_PX748-4K_UG_ENG.pdf?pass) or [data sheet](https://www.viewsonic.com/global/products/sheet/PX728-4K), but [marketing material](https://www.viewsonic.com/global/products/projectors/PX728-4K) indicates "Control 4, Crestron, AMX, PJ Link, and Network Control", & ViewSonic's [PJ-link troubleshooting article](https://www.viewsonic.com/global/support/article?articleId=33000263638) lists the PX728-4K as an applicable model.

Of the listed home automation systems, I could only find Home Assistant support for Crestron and PJLink. Crestron requires a separate controller system, & the PJLink platform is [built-in to Home Assistant](https://www.home-assistant.io/integrations/pjlink/), so PJLink it is.

Assuming the PJLink troubleshooting article above is accurate, this process should apply to all the following ViewSonic projector models:
```
LS600W
PG707X
PG707W
PG706HD
PG706WU
LS831WU
LS750WU
LS850WU
LS860WU
LS920WU
LS921WU
PX728-4K
PX748-4K
```

_Note: The PJLink troubleshooting article recommends setting a password, but the password is not used for Home Assistant's PJLink integration. Set it if you have issues, or if settings passwords gives you the warm fuzzies._

Confirming PJLink compatibility was the most novel part of this journey: the rest is just a combination of other tutorials, nothing novel. That said, I hope this helps confirm someone's projector is indeed LAN-controllable!

# Home Assistant + PJLink

## Install Home Assistant

Home Assistant offers [several methods](https://www.home-assistant.io/installation/) for getting a server up and running, or use [Home Assistant Yellow](https://www.home-assistant.io/yellow) if you like paying someone else to set up a Raspberry Pi.

## Get your projector's IP

Follow the "Configuring the LAN Control Settings" portion in your projector's manual to connect it to your local network/confirm its IP address.

Don't forget to set "Standby LAN Control" to "On".

## Configure Home Assistant's PJLink integration

Home Assistant allows you to configure your projector as a [Media Player on the PJLink platform](https://www.home-assistant.io/integrations/pjlink/).

```yaml
media_player:
  - platform: pjlink
    host: 192.168.1.232
    name: Projector
```

Once the projector is added under `pjlink`, it should appear on Home Assistant's main dashboard. Try clicking the power button & see what happens!

![cross your fingers](/assets/controlling-viewsonic-projector-google-home/Capture.PNG)

Home Assistant may log an error:
```python
2023-09-03 16:28:58.728 ERROR (MainThread) [homeassistant.core] Error executing service: <ServiceCall media_player.turn_on (c:01H9DY0EZ788WH9STDQ2Q3QKG6): entity_id=['media_player.projector']>
Traceback (most recent call last):
  File "/usr/src/homeassistant/homeassistant/core.py", line 1990, in _run_service_call_catch_exceptions
    await coro_or_task
  File "/usr/src/homeassistant/homeassistant/core.py", line 2011, in _execute_service
    return await target(service_call)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/src/homeassistant/homeassistant/helpers/entity_component.py", line 235, in handle_service
    return await service.entity_service_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/src/homeassistant/homeassistant/helpers/service.py", line 870, in entity_service_call
    response_data = await _handle_entity_call(
                    ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/src/homeassistant/homeassistant/helpers/service.py", line 942, in _handle_entity_call
    result = await task
             ^^^^^^^^^^
  File "/usr/src/homeassistant/homeassistant/components/media_player/__init__.py", line 704, in async_turn_on
    await self.hass.async_add_executor_job(self.turn_on)
TimeoutError: timed out
```

I'm unsure if this is caused by the projector not responding fast enough, or at all. Home Assistant's service timeouts are not configurable, so not much we can do here.

If nothing happens, ensure your projector is at the IP you specified in `configuration.yaml`. In my case, I checked http://192.168.1.232/index.asp resolved in my web browser.

# Google Assistant + Home Assistant

At this point, the projector's power can be completely controlled with Home Assistant, either through the web interface or the app.

If you still want Google Home integration (so you can say "Hey Google, turn on the projector"), you'll need [Home Assistant's Google Assistant integration](https://www.home-assistant.io/integrations/google_assistant/). This bridges the existing Home Assistant <-> Projector functionality with new Google Home <-> Home Assistant functionality.

If you don't want to pay for Home Assistant Cloud, the Home Assistant documentation does a thorough job of explaining the manual GCP Project configuration process. If you've never set up an externally accessible with a hostname and SSL certificate, [Cloudflare Tunnels](https://blog.cloudflare.com/ridiculously-easy-to-use-tunnels/) are a great option: `cloudflared` connects Home Assistant to Cloudflare's network, and Cloudflare manages the necessary DNS & SSL certificates.