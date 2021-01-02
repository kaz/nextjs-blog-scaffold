import { GetStaticPaths, GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import React from "react";
import Markdown from "../../components/Markdown";
import style from "../../styles/post.module.scss";
import { Article, getArticleBySlug, getArticles } from "../../utils/articles";

type Props = {
	article: Article;
};
type UrlQuery = {
	slug: string;
};

export const config: PageConfig = {
	unstable_runtimeJS: false,
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
			<div className="postMeta">
				<small>{article.date.slice(0, 10)}</small>
				<h1>{article.title}</h1>
				<a>
					<img src={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
					{process.env.NEXT_PUBLIC_AUTHOR_NAME}
				</a>
			</div>
			<Markdown>{article.body}</Markdown>
		</div>
	);
};
export default Post;
