import React, { useContext } from "react";
import simpleIcons from "simple-icons";
import styles from "../styles/socialshare.module.scss";
import CanonicalUrlContext from "./CanonicalUrlContext";

type Props = {
	pageTitle: string;
};

const lineIcon = simpleIcons.get("line");
const twitterIcon = simpleIcons.get("twitter");
const facebookIcon = simpleIcons.get("facebook");
const hatenabookmarkIcon = simpleIcons.get("hatenabookmark");

const SocialShare = ({ pageTitle }: Props) => {
	const url = encodeURIComponent(useContext(CanonicalUrlContext));
	const text = encodeURIComponent(pageTitle);

	return (
		<div className={styles.social}>
			<a
				target="__blank"
				href={`https://social-plugins.line.me/lineit/share?url=${url}`}
				style={{ backgroundColor: `#${lineIcon.hex}` }}
				dangerouslySetInnerHTML={{ __html: lineIcon.svg }}
			/>
			<a
				target="__blank"
				href={`http://twitter.com/share?url=${url}&text=${text}`}
				style={{ backgroundColor: `#${twitterIcon.hex}` }}
				dangerouslySetInnerHTML={{ __html: twitterIcon.svg }}
			/>
			<a
				target="__blank"
				href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
				style={{ backgroundColor: `#${facebookIcon.hex}` }}
				dangerouslySetInnerHTML={{ __html: facebookIcon.svg }}
			/>
			<a
				target="__blank"
				href={`http://b.hatena.ne.jp/add?url=${url}`}
				style={{ backgroundColor: `#${hatenabookmarkIcon.hex}` }}
				dangerouslySetInnerHTML={{ __html: hatenabookmarkIcon.svg }}
			/>
		</div>
	);
};
export default SocialShare;
