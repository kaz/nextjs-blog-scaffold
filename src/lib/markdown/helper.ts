import type { Content, DocType, Element, ElementContent, Root } from "hast";

export const isElement = (node?: Content): node is Element => node?.type == "element";
export const withoutDocType = (node?: Content): node is Exclude<Content, DocType> => node?.type != "doctype";

export type MapCallback = (node: ElementContent) => Promise<ElementContent>;

export const mapTree = async (tree: Root, callback: MapCallback): Promise<Root> => {
	tree.children = await Promise.all(tree.children.filter(withoutDocType).map(child => mapNode(child, callback)));
	return tree;
};
const mapNode = async (node: ElementContent, callback: MapCallback): Promise<ElementContent> => {
	if (isElement(node)) {
		node.children = await Promise.all(node.children.map(child => mapNode(child, callback)));
	}
	return callback(node);
};
