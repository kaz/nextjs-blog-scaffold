import "highlight.js/styles/github.css";
import "katex/dist/katex.css";
import { markdownToHtml } from "../lib/markdown";
import styles from "../styles/components/markdown.module.scss";

type Props = {
	children: string;
};

const Markdown = ({ children }: Props) => {
	return <article className={styles.markdown} dangerouslySetInnerHTML={{ __html: markdownToHtml(children) }} />;
};
export default Markdown;
