import "highlight.js/styles/github.css";
import "katex/dist/katex.css";
import type { GetStaticPaths, GetStaticProps, PageConfig } from "next";
import Head from "next/head";
import SocialShare from "../../components/SocialShare";
import { CompiledArticle, getArticleBySlug, getArticles } from "../../lib/datasource/articles";
import styles from "../../styles/pages/post.module.scss";

type Props = {
	article: CompiledArticle;
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

const Post = ({ article: { title, date, tags, description, content } }: Props) => {
	const pageTitle = `${title} | ${process.env.NEXT_PUBLIC_BLOG_TITLE}`;
	return (
		<main className={styles.post}>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={description} />
				<meta name="twitter:card" content="summary" />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:type" content="article" />
				<meta property="og:image" content={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
				<meta property="og:description" content={description} />
				<meta property="og:article:published_time" content={date} />
				<meta property="og:article:author" content={process.env.NEXT_PUBLIC_AUTHOR_NAME} />
				{tags.map(tag => (
					<meta property="og:article:tag" content={tag} key={tag} />
				))}
			</Head>
			<section className={styles.meta}>
				<small>{date.slice(0, 10)}</small>
				<h1>{title}</h1>
				<a href="#profile">
					<img src={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
					{process.env.NEXT_PUBLIC_AUTHOR_NAME}
				</a>
			</section>
			<SocialShare pageTitle={pageTitle} />
			<article className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
			<SocialShare pageTitle={pageTitle} />
		</main>
	);
};
export default Post;
