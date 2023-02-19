/* TODO font fetching fails on CF pages with "Top-level await is not available"
import { getCollection } from "astro:content";
import generateOgImage from "@utils/generateOgImage";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ params, props }) => ({
  body: await generateOgImage(props.ogTitle),
});

const postImportResult = await getCollection("blog", ({ data }) => !data.draft);
const posts = Object.values(postImportResult);

export function getStaticPaths() {
  return posts
    .filter(({ data }) => !data.ogImage)
    .map(({ data }) => ({
      params: { slug: data.postSlug },
      props:  { ogTitle: data.title },
    }));
}

*/

export function getStaticPaths() {
  return [];
}