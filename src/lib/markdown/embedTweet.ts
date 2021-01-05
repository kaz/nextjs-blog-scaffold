import fetch from "cross-fetch";
import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { isElement, map } from "./helper";

const plugin: Plugin = () => transformer;
const transformer: Transformer = tree => map(tree, mapFn);

const mapFn = async (node: Node) => {
	if (!isElement(node)) {
		return node;
	}
	if (node.tagName != "p") {
		return node;
	}
	if (node.children.length != 1) {
		return node;
	}

	const child = node.children[0];
	if (!isElement(child)) {
		return node;
	}
	if (child.tagName != "a") {
		return node;
	}
	if (!child.properties) {
		return node;
	}

	const href = child.properties["href"];
	if (typeof href != "string") {
		return node;
	}
	if (!href.match(/^https:\/\/twitter\.com\/.+?\/status\/\d+$/)) {
		return node;
	}

	try {
		const resp = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(href)}`);
		if (!resp.ok) {
			throw new Error(`fetch failed: status=${resp.status}, url=${resp.url}`);
		}

		const { html }: { html: string } = await resp.json();
		return { type: "raw", value: html };
	} catch (e) {
		console.log("[WARNING] failed to embed tweet:", e);
	}
	return node;
};

module.exports = plugin;
export default plugin;
