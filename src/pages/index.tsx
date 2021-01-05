import { GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Article, getArticles } from "../lib/datasource/articles";
import styles from "../styles/index.module.scss";

type Props = {
	articles: Article[];
};

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const articles = await getArticles();
	return { props: { articles } };
};

const Index = ({ articles }: Props) => {
	return (
		<main className={styles.index}>
			<Head>
				<title>{process.env.NEXT_PUBLIC_BLOG_TITLE}</title>
			</Head>
			<ul>
				{articles.map(({ slug, title, date }) => (
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
