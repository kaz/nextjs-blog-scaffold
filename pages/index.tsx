import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Article, getArticles } from "../datasources";
import style from "../styles/index.module.scss";

type Props = {
	articles: Article[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const articles = await getArticles();
	return { props: { articles } };
};

const Index = ({ articles }: Props) => {
	const articlesWithPermalink = articles.map(article =>
		Object.assign(
			{
				permalink: `/post/${article.dateStr.slice(0, 10).replace(/-/g, "/")}`,
			},
			article,
		),
	);
	return (
		<React.Fragment>
			<Head>
				<title>{process.env.NEXT_PUBLIC_BLOG_TITLE}</title>
			</Head>
			<div className={style.scope}>
				<ul>
					{articlesWithPermalink.map(article => (
						<li key={article.dateStr}>
							<div>{article.dateStr.slice(0, 10)}</div>
							<Link href={article.permalink}>{article.title}</Link>
						</li>
					))}
				</ul>
			</div>
		</React.Fragment>
	);
};
export default Index;
