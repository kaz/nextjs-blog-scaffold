import type { Element } from "hast";
import type { Plugin, Transformer } from "unified";
import type { Node, Parent } from "unist";

const plugin: Plugin = () => transformer;
const transformer: Transformer = tree => map(tree, mapFn);

const isParent = (node?: Node): node is Parent => !!node?.children;
const isElement = (node?: Node): node is Element => node?.type == "element";

const map = async (node: Node, mapFn: (node: Node) => Promise<Node>): Promise<Node> => {
	node = await mapFn(node);
	if (isParent(node)) {
		node.children = await Promise.all(node.children.map(child => map(child, mapFn)));
	}
	return node;
};

const mapFn = async (node: Node) => {
	if (!isElement(node)) {
		return node;
	}
	if (node.tagName == "a") {
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
