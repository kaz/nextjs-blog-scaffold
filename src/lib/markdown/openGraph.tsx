import type { Root } from "hast";
import ReactDOMServer from "react-dom/server";
import type { Plugin, Transformer } from "unified";
import { getMetadata, Metadata } from "../meta";
import { getLinkTransformer } from "./helper";

type Props = {
	meta: Metadata;
};
const LinkCard = ({ meta }: Props) => {
	const url = new URL(meta.url);
	return (
		<aside>
			<a
				rel={meta.local ? undefined : "noopener noreferrer"}
				target={meta.local ? undefined : "_blank"}
				href={meta.local ? url.pathname : meta.url}
				style={meta.image ? { backgroundImage: `url(${meta.image})` } : {}}
			>
				<div>
					<strong>{meta.title}</strong>
					<cite>{url.hostname}</cite>
					<q cite={url.toString()}>{meta.description}</q>
				</div>
			</a>
		</aside>
	);
};

const transformer: Transformer<Root> = getLinkTransformer(async href => {
	const metadata = await getMetadata(href);
	if (!metadata.title) {
		return;
	}
	return ReactDOMServer.renderToStaticMarkup(<LinkCard meta={metadata} />);
});

const plugin: Plugin<any, Root> = () => transformer;
export default plugin;
