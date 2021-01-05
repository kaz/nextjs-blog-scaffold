import { useContext } from "react";
import CanonicalUrlContext from "../contexts/CanonicalUrlContext";
import styles from "../styles/components/SocialShare.module.scss";
import { FacebookIcon, HatenabookmarkIcon, LineIcon, TwitterIcon } from "./Icon";

type Props = {
	pageTitle: string;
};

const SocialShare = ({ pageTitle }: Props) => {
	const url = encodeURIComponent(useContext(CanonicalUrlContext));
	const text = encodeURIComponent(pageTitle);

	return (
		<div className={styles.social}>
			<a target="_blank" href={`https://social-plugins.line.me/lineit/share?url=${url}`}>
				<LineIcon inverted={true} />
			</a>
			<a target="_blank" href={`http://twitter.com/share?url=${url}&text=${text}`}>
				<TwitterIcon inverted={true} />
			</a>
			<a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}>
				<FacebookIcon inverted={true} />
			</a>
			<a target="_blank" href={`http://b.hatena.ne.jp/add?url=${url}`}>
				<HatenabookmarkIcon inverted={true} />
			</a>
		</div>
	);
};
export default SocialShare;
