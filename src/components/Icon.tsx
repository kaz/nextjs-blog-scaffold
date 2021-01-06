import { TagIcon } from "@primer/octicons-react";
import simpleIcons from "simple-icons";

type Props = {
	inverted?: boolean;
};

const icon = (name: string) => (props: Props) => {
	const { svg, hex } = simpleIcons.get(name);
	return (
		<span
			style={{
				fill: props.inverted ? "white" : `#${hex}`,
				backgroundColor: props.inverted ? `#${hex}` : "initial",
			}}
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
};

export const LineIcon = icon("line");
export const GithubIcon = icon("github");
export const TwitterIcon = icon("twitter");
export const FacebookIcon = icon("facebook");
export const HatenabookmarkIcon = icon("hatenabookmark");

export { TagIcon };
