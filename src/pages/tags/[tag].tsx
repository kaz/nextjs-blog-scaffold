import type { GetStaticPaths, GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import Entries from "../../components/Entries";
import { TagIcon } from "../../components/Icon";
import { Entry, getEntriesByTag, getTags } from "../../lib/datasource";
import styles from "../../styles/pages/index.module.scss";

type Props = {
	tag: string;
	entries: Entry[];
};
type UrlQuery = {
	tag: string;
};

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

export const getStaticPaths: GetStaticPaths<UrlQuery> = async () => {
	const tags = await getTags();
	const paths = tags.map(tag => ({ params: { tag } }));
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, UrlQuery> = async ({ params }) => {
	if (!params) {
		throw new Error("params is undefined");
	}
	return { props: { tag: params.tag, entries: await getEntriesByTag(params.tag) } };
};

const Tag = ({ tag, entries }: Props) => {
	const pageTitle = `Tag:${tag} | ${process.env.NEXT_PUBLIC_BLOG_TITLE}`;
	const description = `Articles tagged with "${tag}"`;

	return (
		<main className={styles.index}>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={description} />
				<meta name="twitter:card" content="summary" />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
				<meta property="og:description" content={description} />
			</Head>
			<h2>
				<TagIcon size={24} verticalAlign="text-top" /> {tag}
			</h2>
			<Entries entries={entries} />
		</main>
	);
};
export default Tag;
