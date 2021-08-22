import type { Content, Element, Root } from "hast";
import type { Transformer } from "unified";

const isElement = (node?: Content): node is Element => node?.type == "element";

type LinkTransformFn = (href: string) => Promise<string | undefined>;
type LinkTransformerFactory = (t: LinkTransformFn) => Transformer<Root>;

export const getLinkTransformer: LinkTransformerFactory = transform => async tree => {
	const { selectAll } = await import("unist-util-select");

	const nodes = selectAll("element[tagName=p]", tree) as Element[];
	await Promise.all(
		nodes.map(async node => {
			if (node.tagName != "p") {
				return;
			}
			if (node.children.length != 1) {
				return;
			}

			const child = node.children[0];
			if (!isElement(child)) {
				return;
			}
			if (child.tagName != "a") {
				return;
			}
			if (!child.properties) {
				return;
			}

			const href = child.properties["href"];
			if (typeof href != "string") {
				return;
			}

			try {
				const value = await transform(href);
				if (!value) {
					return;
				}

				Object.assign(node, { type: "raw", value });
			} catch (e) {
				if (e instanceof Error) {
					e = e.message;
				}
				console.log("[WARN] failed to transform content:", e);
			}
		}),
	);

	return tree;
};
