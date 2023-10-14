import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://jibby.org/",
  author: "Josh Bicking",
  desc: '',
  title: "jibby.org",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 8,
  wordsPerMinute: 200,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Resume",
    href: "/assets/Resume.pdf",
    linkTitle: `Resume`,
    active: true,
  },
  {
    name: "Github",
    href: "https://github.com/jibby0",
    linkTitle: `jibby0 on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jibby0/",
    linkTitle: `Josh Bicking on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:me@jibby.org",
    linkTitle: `Send an email to me@jibby.org`,
    active: true,
  },
  {
    name: "Signal",
    href: "sms:+18023790867?&body=Add%2520me%2520on%2520Signal%2521",
    linkTitle: `Josh Bicking on Signal`,
    active: true,
  },
  {
    name: "Mastodon",
    href: "https://mastodon.jibby.org",
    linkTitle: `@jibby on Mastodon`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/id/jibby0",
    linkTitle: `jibby on Steam`,
    active: true,
  },
  {
    name: "Discord",
    href: "https://discordapp.com/users/169530609876729861",
    linkTitle: `Jibby#8922 on Discord`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/jibby0",
    linkTitle: `jibby0 on Facebook`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/joshbicking/",
    linkTitle: `joshbicking on Instagram`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
  {
    name: "Twitch",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
];
