import fetch from "cross-fetch";
import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { isElement, map } from "./utils";

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

	const resp = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(href)}`);
	if (!resp.ok) {
		throw new Error(`fetch failed: ${await resp.text()}`);
	}

	const { html }: { html: string } = await resp.json();
	return { type: "raw", value: html };
};

module.exports = plugin;
export default plugin;
