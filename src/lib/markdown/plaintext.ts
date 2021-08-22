import type { Root, Text } from "hast";
import type { Plugin, Transformer } from "unified";

const transformer: Transformer<Root> = async tree => {
	const { selectAll } = await import("unist-util-select");

	tree.children = selectAll("text", tree) as Text[];
	return tree;
};

const plugin: Plugin<any, Root> = () => transformer;
export default plugin;
