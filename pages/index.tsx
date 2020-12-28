import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Article, getArticles } from "../datasources/articles";
import style from "../styles/index.module.scss";

type Props = {
	articles: Pick<Article, "slug" | "title" | "date">[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const articles = (await getArticles()).map(({ slug, title, date }) => ({ slug, title, date }));
	return { props: { articles } };
};

const Index = ({ articles }: Props) => {
	return (
		<React.Fragment>
			<Head>
				<title>{process.env.NEXT_PUBLIC_BLOG_TITLE}</title>
			</Head>
			<div className={style.scope}>
				<ul>
					{articles.map(({ slug, title, date }) => (
						<li key={slug}>
							<div>{date.slice(0, 10)}</div>
							<Link href={`/post/${slug}`}>{title}</Link>
						</li>
					))}
				</ul>
			</div>
		</React.Fragment>
	);
};
export default Index;
