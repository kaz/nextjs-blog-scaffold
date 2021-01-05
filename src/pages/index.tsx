import { GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Entry, getEntries } from "../lib/datasource";
import styles from "../styles/index.module.scss";

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
			<ul>
				{entries.map(({ slug, title, date }) => (
					<li key={slug}>
						<div>{date.slice(0, 10)}</div>
						<Link href={`/post/${slug}`}>{title}</Link>
					</li>
				))}
			</ul>
		</main>
	);
};
export default Index;
