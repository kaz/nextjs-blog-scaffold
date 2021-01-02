import React from "react";
import style from "../styles/footer.module.scss";

const Header = () => {
	return (
		<div className={style.Footer}>
			<div className="profile">
				<img src={process.env.NEXT_PUBLIC_AUTHOR_IMAGE} />
				<p>
					<small>Author</small>
					<h3>{process.env.NEXT_PUBLIC_AUTHOR_NAME}</h3>
				</p>
			</div>
			{process.env.NEXT_PUBLIC_COPYRIGHT && <div className="copyright">&copy; {process.env.NEXT_PUBLIC_COPYRIGHT}</div>}
		</div>
	);
};
export default Header;
