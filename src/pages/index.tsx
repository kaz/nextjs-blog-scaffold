import type { GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import Entries from "../components/Entries";
import { Entry, getEntriesByTag } from "../lib/datasource";
import styles from "../styles/pages/index.module.scss";

type Props = {
	entries: Entry[];
};

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	return { props: { entries: await getEntriesByTag() } };
};

const Index = ({ entries }: Props) => {
	const pageTitle = process.env.NEXT_PUBLIC_BLOG_TITLE;
	const description = process.env.NEXT_PUBLIC_BLOG_DESCRIPTION;

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
			<Entries entries={entries} />
		</main>
	);
};
export default Index;
