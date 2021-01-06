import type { GetServerSideProps } from "next";
import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { canonicalUrlFromPath, canonicalUrlFromSlug, canonicalUrlFromTag } from "../lib/utils";
import { getStaticPaths as getPostsStaticPaths } from "./posts/[slug]";
import { getStaticPaths as getTagsStaticPaths } from "./tags/[tag]";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			urlset: { children?: ReactNode; xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" };
			url: { children: ReactNode };
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

const getIndex = async (): Promise<SiteUrl[]> => [
	{
		loc: canonicalUrlFromPath("/"),
		lastmod: new Date(),
	},
];
const getPosts = async (): Promise<SiteUrl[]> => {
	const { paths } = await getPostsStaticPaths({});
	return paths.map(path => {
		if (typeof path != "object") {
			throw new Error(`unexpected path: ${path}`);
		}
		const { slug } = path.params;
		return {
			loc: canonicalUrlFromSlug(slug),
			lastmod: new Date(),
		};
	});
};
const getTags = async (): Promise<SiteUrl[]> => {
	const { paths } = await getTagsStaticPaths({});
	return paths.map(path => {
		if (typeof path != "object") {
			throw new Error(`unexpected path: ${path}`);
		}
		const { tag } = path.params;
		return {
			loc: canonicalUrlFromTag(tag),
			lastmod: new Date(),
		};
	});
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const urls = (await Promise.all([getIndex(), getPosts(), getTags()])).flat();
	const props: Props = { urls };

	res.setHeader("Content-Type", "application/xml");
	res.write(`<?xml version="1.0" encoding="UTF-8"?>`);
	res.end(ReactDOMServer.renderToStaticMarkup(Sitemap(props)));

	return { props };
};

const Sitemap = ({ urls }: Props) => (
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		{urls.map(url => (
			<url>
				<loc>{url.loc}</loc>
				{url.lastmod && <lastmod>{url.lastmod.toISOString()}</lastmod>}
				{url.changefreq && <changefreq>{url.changefreq}</changefreq>}
				{url.priority && <priority>{url.priority}</priority>}
			</url>
		))}
	</urlset>
);
export default Sitemap;
