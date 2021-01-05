import { Text } from "mdast";
import { Plugin, Transformer } from "unified";
import visit from "unist-util-visit";

const plugin: Plugin = () => transformer;

const transformer: Transformer = tree => {
	const texts: string[] = [];
	visit<Text>(tree, "text", node => {
		texts.push(node.value);
	});
	const output: Text = { type: "text", value: texts.join("") };
	return output;
};

module.exports = plugin;
export default plugin;
