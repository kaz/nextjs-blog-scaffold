import type { Root } from "hast";
import type { Plugin, Transformer } from "unified";
import { getEmbedHTML } from "../embed";
import { isElement, MapCallback, mapTree } from "./helper";

const plugin: Plugin<any, Root> = () => transformer;
const transformer: Transformer<Root> = tree => mapTree(tree, callback);

const callback: MapCallback = async node => {
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
