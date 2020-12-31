import { FootnoteReference } from "mdast";
import { Plugin, Transformer } from "unified";
import visit from "unist-util-visit";

const plugin: Plugin = () => transformer;

const transformer: Transformer = tree => {
	let index = 0;
	visit<FootnoteReference>(tree, "footnoteReference", node => {
		node.label = (++index).toString();
	});
};

module.exports = plugin;
export default plugin;
