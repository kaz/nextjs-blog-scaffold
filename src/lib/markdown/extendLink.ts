import { Element } from "hast";
import { Plugin, Transformer } from "unified";
import { Node } from "unist";
import map from "unist-util-map";

const plugin: Plugin = () => transformer;

const transformer: Transformer = tree => map(tree, mapFn);

const isElement = (node: Node): node is Element => node.type == "element";
const mapFn = (node: Node) => {
	if (isElement(node) && node.tagName == "a") {
		if (!node.properties) {
			return node;
		}

		const href = node.properties["href"];
		if (typeof href != "string") {
			return node;
		}

		const local = process.env.NEXT_PUBLIC_BLOG_URL;
		if (!local || (href.startsWith("http") && !href.startsWith(local))) {
			node.properties["target"] = "_blank";
			return node;
		}
	}
	return node;
};

module.exports = plugin;
export default plugin;
