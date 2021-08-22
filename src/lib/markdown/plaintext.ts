import type { Root, Text } from "hast";
import type { Plugin, Transformer } from "unified";

const plugin: Plugin<any, Root> = () => transformer;

const transformer: Transformer<Root> = async tree => {
	const { visit } = await import("unist-util-visit");

	const textNodes: Text[] = [];
	visit(tree, "text", node => {
		textNodes.push(node);
	});

	tree.children = textNodes;
	return tree;
};

module.exports = plugin;
export default plugin;
