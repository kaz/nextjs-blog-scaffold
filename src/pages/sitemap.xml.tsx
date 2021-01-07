import type { GetServerSideProps, GetStaticProps } from "next";
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
	lastmod?: string;
	changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
	priority?: number;
};

const getIndexSitemapEntries = async (): Promise<SiteUrl[]> => [
	{
		loc: canonicalUrlFromPath("/"),
		lastmod: (await getLatestTimestamp()).toISOString(),
	},
];
const getPostSitemapEntries = async (): Promise<SiteUrl[]> => {
	const articles = await getArticles();
	return articles.map(article => {
		return {
			loc: canonicalUrlFromSlug(article.slug),
			lastmod: new Date(article.updated).toISOString(),
		};
	});
};
const getTagSitemapEntries = async (): Promise<SiteUrl[]> => {
	const tags = await getTags();
	return Promise.all(
		tags.map(async tag => {
			return {
				loc: canonicalUrlFromTag(tag),
				lastmod: (await getLatestTimestamp(tag)).toISOString(),
			};
		}),
	);
};

export const getContent = async () => {
	const result = await getStaticProps({});
	if (!("props" in result)) {
		throw new Error("failed to get props");
	}
	return `<?xml version="1.0" encoding="UTF-8"?>${ReactDOMServer.renderToStaticMarkup(Sitemap(result.props))}`;
};

const getStaticProps: GetStaticProps<Props> = async () => {
	return {
		props: {
			urls: (await Promise.all([getIndexSitemapEntries(), getPostSitemapEntries(), getTagSitemapEntries()])).flat(),
		},
	};
};
const getServerSideProps: GetServerSideProps<{}> = async ({ res }) => {
	res.setHeader("Content-Type", "application/xml");
	res.end(await getContent());
	return { props: {} };
};

if (process.env.npm_lifecycle_event == "export") {
	module.exports.getStaticProps = getStaticProps;
} else {
	module.exports.getServerSideProps = getServerSideProps;
}

const Sitemap = ({ urls }: Props) => {
	return (
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			{urls.map(url => (
				<url key={url.loc}>
					<loc>{url.loc}</loc>
					{url.lastmod && <lastmod>{url.lastmod}</lastmod>}
					{url.changefreq && <changefreq>{url.changefreq}</changefreq>}
					{url.priority && <priority>{url.priority}</priority>}
				</url>
			))}
		</urlset>
	);
};
export default Sitemap;
