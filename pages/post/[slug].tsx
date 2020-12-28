import { GetStaticPaths, GetStaticProps } from "next";
import { Article, getArticleBySlug, getArticles } from "../../datasources/articles";

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
	return <pre>{article.body}</pre>;
};
export default Post;
