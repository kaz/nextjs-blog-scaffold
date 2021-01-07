import metascraper from "metascraper";
import date from "metascraper-date";
import description from "metascraper-description";
import image from "metascraper-image";
import publisher from "metascraper-publisher";
import title from "metascraper-title";
import url from "metascraper-url";
import fetch from "node-fetch";
import { getArticle } from "./datasource/articles";
import { markdownToDescription } from "./markdown";
import { canonicalUrlFromSlug, isLocalUrl, slugFromUrl } from "./utils";

export type Metadata = {
	local: boolean;
	date?: string;
	description?: string;
	image?: string;
	publisher?: string;
	title?: string;
	url: string;
};

const scraper = metascraper([date(), description(), image(), publisher(), title(), url()]);
const getRemoteMetadata = async (url: string): Promise<Metadata> => {
	const resp = await fetch(url);
	if (!resp.ok) {
		throw new Error(`fetch failed: status=${resp.status}, url=${resp.url}`);
	}

	const meta = await scraper({ url, html: await resp.text() });
	return {
		local: false,
		date: meta.date || undefined,
		description: meta.description || undefined,
		image: meta.image || undefined,
		publisher: meta.publisher || undefined,
		title: meta.title || undefined,
		url: meta.url || url,
	};
};

const getLocalMetadata = async (url: string): Promise<Metadata> => {
	const slug = slugFromUrl(url);
	if (!slug) {
		throw new Error(`invalid URL was passed: ${url}`);
	}

	const article = await getArticle(slug);
	const description = await markdownToDescription(article.body);

	return {
		local: true,
		date: article.date,
		description: description,
		image: article.image || process.env.NEXT_PUBLIC_AUTHOR_IMAGE,
		title: article.title,
		url: canonicalUrlFromSlug(article.slug),
	};
};

export const getMetadata = async (url: string) => (isLocalUrl(url) ? getLocalMetadata : getRemoteMetadata)(url);
