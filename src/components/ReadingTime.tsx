import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

// Modified from https://daily-dev-tips.com/posts/adding-reading-time-to-astro-the-easy-way/

export interface Props {
  post: CollectionEntry<"blog">;
  size?: "sm" | "lg";
  className?: string;
}

export function getReadingTime(content: string) {
  if (!content) return;
  const clean = content.replace(/<\/?[^>]+(>|$)/g, '');
  const numberOfWords = clean.split(/\s/g).length;
  return Math.ceil(numberOfWords / SITE.wordsPerMinute);
}

export default function ReadingTime({post, size = "sm", className}: Props) {
  return (
    <div className={`flex items-center space-x-2 opacity-80 ${className}`}>
      <svg 
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } inline-block h-6 w-6 fill-skin-base`}
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 11h6v1h-7v-9h1v8z" />
      </svg>
      <span className="sr-only"></span>
      <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
        {getReadingTime(post.body)} minute read
      </span>
    </div>
  );
}
