import "highlight.js/styles/github.css";
import "katex/dist/katex.css";
import type { GetStaticPaths, GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { TagIcon } from "../../components/Icon";
import SocialShare from "../../components/SocialShare";
import { Article, getArticle, getArticles } from "../../lib/datasource/articles";
import { markdownToDescription, markdownToHtml } from "../../lib/markdown";
import { relativeUrlFromTag } from "../../lib/utils";
import styles from "../../styles/pages/posts.module.scss";

type Props = {
	article: Article;
	description: string;
	content: string;
};
type UrlQuery = {
	slug: string;
};

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

export const getStaticPaths: GetStaticPaths<UrlQuery> = async () => {
	const articles = await getArticles();
	const paths = articles.map(({ slug }) => ({ params: { slug: encodeURIComponent(slug) } }));
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, UrlQuery> = async ({ params }) => {
	if (!params) {
		throw new Error("params is undefined");
	}

	const article = await getArticle(params.slug);
	const [description, content] = await Promise.all([markdownToDescription(article.body), markdownToHtml(article.body)]);
	return { props: { article, description, content } };
};

const Post = ({ article: { title, date, image, tags }, description, content }: Props) => {
	const pageTitle = `${title} | ${process.env.NEXT_PUBLIC_BLOG_TITLE}`;

	return (
		<main className={styles.post}>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={description} />
				<meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:type" content="article" />
				<meta property="og:image" content={image || process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
				<meta property="og:description" content={description} />
				<meta property="article:published_time" content={date} />
				<meta property="article:author" content={process.env.NEXT_PUBLIC_AUTHOR_NAME} />
				{tags.map(tag => (
					<meta property="article:tag" content={tag} key={tag} />
				))}
			</Head>
			<section className={styles.meta}>
				<small>{date.slice(0, 10)}</small>
				<h1>{title}</h1>
				<div>
					<img src={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
					<a href="#profile">{process.env.NEXT_PUBLIC_AUTHOR_NAME}</a>
					{tags.length > 0 && (
						<React.Fragment>
							<span></span>
							<TagIcon />
							{tags.map(tag => (
								<Link key={tag} href={relativeUrlFromTag(tag)}>
									{tag}
								</Link>
							))}
						</React.Fragment>
					)}
				</div>
			</section>
			<SocialShare pageTitle={pageTitle} />
			<article className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
			<SocialShare pageTitle={pageTitle} />
		</main>
	);
};
export default Post;
