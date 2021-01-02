import React from "react";
import styles from "../styles/footer.module.scss";

const Header = () => {
	return (
		<footer className={styles.footer}>
			<div id="profile" className={styles.profile}>
				<img src={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
				<p>
					<small>Author</small>
					<h3>{process.env.NEXT_PUBLIC_AUTHOR_NAME}</h3>
				</p>
			</div>
			{process.env.NEXT_PUBLIC_COPYRIGHT && (
				<div className={styles.copyright}>&copy; {process.env.NEXT_PUBLIC_COPYRIGHT}</div>
			)}
		</footer>
	);
};
export default Header;
