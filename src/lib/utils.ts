const localURL = process.env.NEXT_PUBLIC_BLOG_URL || "http://localhost:3000";

export const isLocalUrl = (url: string) => !url.startsWith("http") || url.startsWith(localURL);

export const slugFromUrl = (url: string) => (new URL(url, localURL).pathname.match(/^\/post\/(.+?)\/$/) || [])[1];

export const relativeUrlFromSlug = (slug: string) => `/post/${slug}/`;
export const canonicalUrlFromSlug = (slug: string) => canonicalUrlFromPath(relativeUrlFromSlug(slug));
export const canonicalUrlFromPath = (path: string) => new URL(path, localURL).toString();