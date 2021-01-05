import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { isElement, isLocalURL, map } from "./utils";

const plugin: Plugin = () => transformer;
const transformer: Transformer = tree => map(tree, mapFn);

const mapFn = async (node: Node) => {
	if (!isElement(node)) {
		return node;
	}
	if (node.tagName != "a") {
		return node;
	}
	if (!node.properties) {
		return node;
	}

	const href = node.properties["href"];
	if (typeof href != "string") {
		return node;
	}
	if (isLocalURL(href)) {
		return node;
	}

	node.properties["target"] = "_blank";
	return node;
};

module.exports = plugin;
export default plugin;
