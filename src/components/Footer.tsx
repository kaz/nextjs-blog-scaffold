import styles from "../styles/components/Footer.module.scss";
import { FacebookIcon, GithubIcon, TwitterIcon } from "./Icon";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div id="profile" className={styles.profile}>
				<img src={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} alt={process.env.NEXT_PUBLIC_AUTHOR_NAME} />
				<div>
					<small>Author</small>
					<strong>
						{process.env.NEXT_PUBLIC_AUTHOR_NAME}
						{process.env.NEXT_PUBLIC_AUTHOR_GITHUB_URL && (
							<a rel="noopener noreferrer" target="_blank" href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB_URL}>
								<GithubIcon />
							</a>
						)}
						{process.env.NEXT_PUBLIC_AUTHOR_TWITTER_URL && (
							<a rel="noopener noreferrer" target="_blank" href={process.env.NEXT_PUBLIC_AUTHOR_TWITTER_URL}>
								<TwitterIcon />
							</a>
						)}
						{process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK_URL && (
							<a rel="noopener noreferrer" target="_blank" href={process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK_URL}>
								<FacebookIcon />
							</a>
						)}
					</strong>
					<p>{process.env.NEXT_PUBLIC_AUTHOR_BIO}</p>
				</div>
			</div>
			{process.env.NEXT_PUBLIC_COPYRIGHT && (
				<div className={styles.copyright}>&copy; {process.env.NEXT_PUBLIC_COPYRIGHT}</div>
			)}
		</footer>
	);
};
export default Footer;
