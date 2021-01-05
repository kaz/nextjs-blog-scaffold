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
