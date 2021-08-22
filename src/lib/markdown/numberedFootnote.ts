import type { Root } from "mdast";
import type { Plugin, Transformer } from "unified";

const plugin: Plugin<any, Root> = () => transformer;

const transformer: Transformer<Root> = async tree => {
	const { visit } = await import("unist-util-visit");

	let index = 0;
	visit(tree, "footnoteReference", node => {
		node.label = (++index).toString();
	});
	return tree;
};

module.exports = plugin;
export default plugin;
