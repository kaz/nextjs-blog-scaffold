import ogs from "open-graph-scraper";
import ReactDOMServer from "react-dom/server";
import type { Plugin, Transformer } from "unified";
import type { Node } from "unist";
import { CompiledArticle, getArticleBySlug } from "../datasource/articles";
import { isElement, isLocalURL, map, slug2url, url2slug } from "./utils";

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
		if (isLocalURL(href)) {
			const slug = url2slug(href);
			if (!slug) {
				return node;
			}

			const article = await getArticleBySlug(slug);
			if (!article) {
				throw new Error(`no such article: ${slug}`);
			}

			return { type: "raw", value: ReactDOMServer.renderToString(<LocalLinkCard article={article} />) };
		} else {
			const { result } = await ogs({ url: href });
			if (!result.success) {
				throw new Error(`scrape failed: ${result.error}`);
			}
			if (!result.ogTitle) {
				return node;
			}

			return { type: "raw", value: ReactDOMServer.renderToString(<RemoteLinkCard og={result} />) };
		}
	} catch (e) {
		console.log("[WARNING] failed to parse ogp metadata:", e);
	}
	return node;
};

const LocalLinkCard = ({ article }: { article: CompiledArticle }) => {
	const url = slug2url(article.slug);
	return (
		<a className="linkCard" href={url}>
			<div>
				<big>{article.title}</big>
				<small>{url}</small>
				<span>{article.description}</span>
			</div>
			{article.image && <img src={article.image} />}
		</a>
	);
};
const RemoteLinkCard = ({ og }: { og: ogs.SuccessResult["result"] }) => {
	const url = og.ogUrl || og.requestUrl;
	return (
		<a className="linkCard" href={url} target="_blank">
			<div>
				<big>{og.ogTitle}</big>
				<small>{url}</small>
				<span>{og.ogDescription || ""}</span>
			</div>
			{og.ogImage && <img src={og.ogImage.url} />}
		</a>
	);
};

module.exports = plugin;
export default plugin;
