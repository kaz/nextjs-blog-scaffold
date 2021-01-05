import type { GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import React from "react";
import ArticleList from "../components/ArticleList";
import { Entry, getEntries } from "../lib/datasource";
import styles from "../styles/pages/index.module.scss";

type Props = {
	entries: Entry[];
};

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	return { props: { entries: await getEntries() } };
};

const Index = ({ entries }: Props) => {
	return (
		<main className={styles.index}>
			<Head>
				<title>{process.env.NEXT_PUBLIC_BLOG_TITLE}</title>
			</Head>
			<ArticleList entries={entries} />
		</main>
	);
};
export default Index;
