import ogs from "open-graph-scraper";
import ReactDOMServer from "react-dom/server";
import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { getArticleBySlug } from "../datasource/articles";
import { canonicalUrlFromSlug, isLocalUrl, slugFromUrl } from "../utils";
import { isElement, map } from "./helper";

const plugin: Plugin = () => transformer;
const transformer: Transformer = tree => map(tree, mapFn);

const mapFn = async (node: Node) => {
	if (!isElement(node)) {
		return node;
	}
	if (node.tagName != "p") {
		return node;
	}
	if (node.children.length != 1) {
		return node;
	}

	const child = node.children[0];
	if (!isElement(child)) {
		return node;
	}
	if (child.tagName != "a") {
		return node;
	}
	if (!child.properties) {
		return node;
	}

	const href = child.properties["href"];
	if (typeof href != "string") {
		return node;
	}

	try {
		if (isLocalUrl(href)) {
			const slug = slugFromUrl(href);
			if (!slug) {
				return node;
			}

			const article = await getArticleBySlug(slug);
			if (!article) {
				throw new Error(`no such article: ${slug}`);
			}

			return {
				type: "raw",
				value: ReactDOMServer.renderToString(
					<LinkCard
						url={new URL(canonicalUrlFromSlug(article.slug))}
						title={article.title}
						description={article.description}
						image={article.image || process.env.NEXT_PUBLIC_AUTHOR_IMAGE}
					/>,
				),
			};
		} else {
			const { result } = await ogs({ url: href });
			if (!result.success) {
				throw new Error(`scrape failed: ${result.error}`);
			}
			if (!result.ogTitle) {
				return node;
			}

			return {
				type: "raw",
				value: ReactDOMServer.renderToString(
					<LinkCard
						url={new URL(result.ogUrl || result.requestUrl)}
						title={result.ogTitle || ""}
						description={result.ogDescription || ""}
						image={result.ogImage?.url}
					/>,
				),
			};
		}
	} catch (e) {
		console.log("[WARNING] failed to parse ogp metadata:", e);
	}
	return node;
};

type Props = {
	url: URL;
	title: string;
	description: string;
	image?: string;
};
const LinkCard = ({ url, title, description, image }: Props) => {
	const local = isLocalUrl(url.toString());
	return (
		<div className="linkCard">
			<a href={local ? url.pathname : url.toString()} target={local ? undefined : "_blank"}>
				<div>
					<big>{title}</big>
					<small>{url.hostname}</small>
					<span>{description}</span>
				</div>
				{image && <img src={image} />}
			</a>
		</div>
	);
};

module.exports = plugin;
export default plugin;
