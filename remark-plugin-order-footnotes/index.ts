import { Footnote, FootnoteDefinition, FootnoteReference, Paragraph, Root, ThematicBreak } from "mdast";
import { Plugin, Transformer } from "unified";
import filter from "unist-util-filter";
import map from "unist-util-map";

const plugin: Plugin = () => transformer();

const transformer: () => Transformer = () => tree => {
	const refs = new Map<string, FootnoteReference>();
	const defs = new Map<string, FootnoteDefinition>();

	tree = map(tree, node => {
		if (isFootnote(node)) {
			const label = (1 + refs.size).toString();
			const ref: FootnoteReference = {
				type: "footnoteReference",
				identifier: label,
				label,
			};
			const defChild: Paragraph = {
				type: "paragraph",
				children: node.children,
			};
			const def: FootnoteDefinition = {
				type: "footnoteDefinition",
				identifier: label,
				label,
				children: [defChild],
			};
			refs.set(ref.identifier, ref);
			defs.set(def.identifier, def);
			return ref;
		}
		if (isFootnoteReference(node)) {
			const ref: FootnoteReference = {
				type: "footnoteReference",
				identifier: node.identifier,
				label: (1 + refs.size).toString(),
			};
			refs.set(ref.identifier, ref);
			return ref;
		}
		if (isFootnoteDefinition(node)) {
			defs.set(node.identifier, node);
			return node;
		}
		return node;
	});
	tree = filter(tree, (node): node is Node => !isFootnoteDefinition(node as Node)) || tree;

	const newDefs = Array.from(refs.entries())
		.map(([defId, ref]) => {
			const def = defs.get(defId);
			if (def) {
				def.label = ref.label;
			}
			return def;
		})
		.filter(def => def);

	if (newDefs.length) {
		const sep: ThematicBreak = { type: "thematicBreak" };
		(tree as Root).children.push(sep, ...(newDefs as FootnoteDefinition[]));
	}
	return tree;
};

type Node = { type: string };
const isFootnote = (node: Node): node is Footnote => node.type == "footnote";
const isFootnoteReference = (node: Node): node is FootnoteReference => node.type == "footnoteReference";
const isFootnoteDefinition = (node: Node): node is FootnoteDefinition => node.type == "footnoteDefinition";

module.exports = plugin;
export default plugin;
