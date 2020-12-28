import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import Markdown from "../../components/Markdown";
import { Article, getArticleBySlug, getArticles } from "../../datasources/articles";
import style from "../../styles/post.module.scss";

type Props = {
	article: Article;
};
type UrlQuery = {
	slug: string;
};

export const getStaticPaths: GetStaticPaths<UrlQuery> = async () => {
	const articles = await getArticles();
	const paths = articles.map(article => ({ params: article }));
	return { paths, fallback: false };
};
export const getStaticProps: GetStaticProps<Props, UrlQuery> = async ({ params }) => {
	if (!params) {
		throw new Error("params is null");
	}
	const article = await getArticleBySlug(params.slug);
	if (!article) {
		throw new Error("article is not found");
	}
	return { props: { article } };
};

const Post = ({ article }: Props) => {
	return (
		<div className={style.Post}>
			<Head>
				<title>
					{article.title} | {process.env.NEXT_PUBLIC_BLOG_TITLE}
				</title>
			</Head>
			<article>
				<Markdown>{article.body}</Markdown>
			</article>
		</div>
	);
};
export default Post;
