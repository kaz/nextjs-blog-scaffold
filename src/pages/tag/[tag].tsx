import type { GetStaticPaths, GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import Entries from "../../components/Entries";
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
	const paths = tags.map(tag => ({ params: { tag: encodeURIComponent(tag) } }));
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, UrlQuery> = async ({ params }) => {
	if (!params) {
		throw new Error("params is undefined");
	}
	return { props: { tag: params.tag, entries: await getEntriesByTag(params.tag) } };
};

const Tag = ({ tag, entries }: Props) => {
	return (
		<main className={styles.index}>
			<Head>
				<title>
					Tag:{tag} | {process.env.NEXT_PUBLIC_BLOG_TITLE}
				</title>
			</Head>
			<h2>Tag:{tag}</h2>
			<Entries entries={entries} />
		</main>
	);
};
export default Tag;
