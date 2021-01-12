import { TagIcon } from "@primer/octicons-react";
import simpleIcons from "simple-icons";

type Props = {
	inverted?: boolean;
};

const icon = (name: string) => (props: Props) => {
	const { hex, path, title } = simpleIcons.get(name);
	return (
		<span
			title={title}
			style={{
				backgroundColor: props.inverted ? `#${hex}` : "initial",
			}}
		>
			<svg viewBox="0 0 24 24">
				<path fill={props.inverted ? "white" : `#${hex}`} d={path} />
			</svg>
		</span>
	);
};

export const LineIcon = icon("line");
export const GithubIcon = icon("github");
export const TwitterIcon = icon("twitter");
export const FacebookIcon = icon("facebook");
export const HatenabookmarkIcon = icon("hatenabookmark");

export { TagIcon };
