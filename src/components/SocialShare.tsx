import React from "react";
import simpleIcons from "simple-icons";
import styles from "../styles/socialshare.module.scss";

const twitterIcon = simpleIcons.get("twitter");
const facebookIcon = simpleIcons.get("facebook");
const hatenabookmarkIcon = simpleIcons.get("hatenabookmark");

const SocialShare = () => {
	return (
		<div className={styles.social}>
			<button
				data-href="http://twitter.com/share"
				style={{ backgroundColor: `#${twitterIcon.hex}` }}
				dangerouslySetInnerHTML={{ __html: twitterIcon.svg }}
			/>
			<button
				data-href="https://www.facebook.com/sharer/sharer.php"
				style={{ backgroundColor: `#${facebookIcon.hex}` }}
				dangerouslySetInnerHTML={{ __html: facebookIcon.svg }}
			/>
			<button
				data-href="http://b.hatena.ne.jp/add"
				style={{ backgroundColor: `#${hatenabookmarkIcon.hex}` }}
				dangerouslySetInnerHTML={{ __html: hatenabookmarkIcon.svg }}
			/>
		</div>
	);
};
export default SocialShare;
