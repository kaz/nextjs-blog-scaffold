import type { Element } from "hast";
import type { Node, Parent } from "unist";

const isParent = (node?: Node): node is Parent => !!node?.children;
export const isElement = (node?: Node): node is Element => node?.type == "element";

export const map = async (node: Node, mapFn: (node: Node) => Promise<Node>): Promise<Node> => {
	node = await mapFn(node);
	if (isParent(node)) {
		node.children = await Promise.all(node.children.map(child => map(child, mapFn)));
	}
	return node;
};

const localURL = process.env.NEXT_PUBLIC_BLOG_URL || "http://localhost:3000";
export const isLocalURL = (url: string) => !url.startsWith("http") || url.startsWith(localURL);
export const url2slug = (url: string) => (new URL(url, localURL).pathname.match(/^\/post\/(.+?)\/$/) || [])[1];
export const slug2url = (slug: string) => `/post/${slug}/`;
