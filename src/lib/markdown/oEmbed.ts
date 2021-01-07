import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { getEmbedHTML } from "../embed";
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

	try {
		const embedHTML = await getEmbedHTML(href);
		if (!embedHTML) {
			return node;
		}

		return { type: "raw", value: embedHTML };
	} catch (e) {
		if (e instanceof Error) {
			e = e.message;
		}
		console.log("[WARN] failed to embed content:", e);
	}
	return node;
};

module.exports = plugin;
export default plugin;
