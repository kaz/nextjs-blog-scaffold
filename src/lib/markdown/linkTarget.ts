import type { Root } from "hast";
import type { Plugin, Transformer } from "unified";
import { isLocalUrl } from "../utils";
import { isElement, MapCallback, mapTree } from "./helper";

const plugin: Plugin<any, Root> = () => transformer;
const transformer: Transformer<Root> = tree => mapTree(tree, callback);

const callback: MapCallback = async node => {
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
	if (isLocalUrl(href)) {
		return node;
	}

	node.properties.rel = "noopener noreferrer";
	node.properties.target = "_blank";

	return node;
};

module.exports = plugin;
export default plugin;
