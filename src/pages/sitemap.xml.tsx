import type { GetServerSideProps } from "next";
import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { getLatestTimestamp, getTags } from "../lib/datasource";
import { getArticles } from "../lib/datasource/articles";
import { canonicalUrlFromPath, canonicalUrlFromSlug, canonicalUrlFromTag } from "../lib/utils";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			urlset: { children?: ReactNode; xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" };
			url: { children: ReactNode; key: string };
			loc: { children: string };
			lastmod: { children: string };
			changefreq: { children: string };
			priority: { children: number };
		}
	}
}

type Props = {
	urls: SiteUrl[];
};
type SiteUrl = {
	loc: string;
	lastmod?: Date;
	changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
	priority?: number;
};

const getIndexSitemapEntries = async (): Promise<SiteUrl[]> => [
	{
		loc: canonicalUrlFromPath("/"),
		lastmod: await getLatestTimestamp(),
	},
];
const getPostSitemapEntries = async (): Promise<SiteUrl[]> => {
	const articles = await getArticles();
	return articles.map(article => {
		return {
			loc: canonicalUrlFromSlug(article.slug),
			lastmod: new Date(article.updated),
		};
	});
};
const getTagSitemapEntries = async (): Promise<SiteUrl[]> => {
	const tags = await getTags();
	return Promise.all(
		tags.map(async tag => {
			return {
				loc: canonicalUrlFromTag(tag),
				lastmod: await getLatestTimestamp(tag),
			};
		}),
	);
};

export const getContent = async () => {
	const props: Props = {
		urls: (await Promise.all([getIndexSitemapEntries(), getPostSitemapEntries(), getTagSitemapEntries()])).flat(),
	};
	return `<?xml version="1.0" encoding="UTF-8"?>${ReactDOMServer.renderToStaticMarkup(Sitemap(props))}`;
};
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	res.setHeader("Content-Type", "application/xml");
	res.end(getContent());
	return { props: {} };
};

const Sitemap = ({ urls }: Props) => (
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		{urls.map(url => (
			<url key={url.loc}>
				<loc>{url.loc}</loc>
				{url.lastmod && <lastmod>{url.lastmod.toISOString()}</lastmod>}
				{url.changefreq && <changefreq>{url.changefreq}</changefreq>}
				{url.priority && <priority>{url.priority}</priority>}
			</url>
		))}
	</urlset>
);
export default Sitemap;
