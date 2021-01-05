import "highlight.js/styles/github.css";
import "katex/dist/katex.css";
import styles from "../styles/markdown.module.scss";
import { markdownToHtml } from "../utils/markdown";

type Props = {
	children: string;
};

const Markdown = ({ children }: Props) => {
	return <article className={styles.markdown} dangerouslySetInnerHTML={{ __html: markdownToHtml(children) }} />;
};
export default Markdown;
