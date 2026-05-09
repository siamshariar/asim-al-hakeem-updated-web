import { useState } from "react";
import classNames from "classnames";
import Link from "next/link";

import { server, youtube } from "../lib/config";

import ClassIcon from "@mui/icons-material/Class";
import AssessmentIcon from "@mui/icons-material/Assessment";

import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import Collapse from "@mui/material/Collapse";

import Drawer from "@mui/material/Drawer"; // Updated import
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary"; // Updated import
 // Updated import

export default function MobileNav(props) {
	// console.log(props.qnaCategories);
	const [expand, setExpand] = useState(false);
	const handleClick = () => {
		setExpand(!expand);
	};

	const [expand2, setExpand2] = useState(false);
	const handleClick2 = () => {
		setExpand2(!expand2);
	};

	return (
        <Drawer
			anchor="left"
			open={props.navOpen}
			onClose={props.navControl(false)}
			transitionDuration={{ enter: 140, exit: 100 }}
			ModalProps={{
				keepMounted: true,
			}}
			PaperProps={{
				sx: {
					willChange: "transform",
				},
			}}
			className="mobile-menu-root">
			<div className="mobile-menu">
				<div className="m-menu-wrap">
					<div className="m-menu-ctn">
						<div className="m-menu-top">
							{/* <Link href="/">
                <a
                  onClick={(e) => props.navControl(false)(e)}
                  className="m-menu-logo"
                >
                  <Image
                    // src={`${server}/img/id/logo.png`}
                    src={`${server}/img/dr-saifullah-logo.png`}
                    alt=""
                    width={80}
                    height={67}
                    objectFit="contain"
                    objectPosition="left center"
                    loading="eager"
                    unoptimized
                  />
                </a>
              </Link> */}

							<div
								className="m-menu-close"
								onClick={(e) => props.navControl(false)(e)}>
								<span></span>
								<span></span>
							</div>
						</div>

						<ul className="m-menu">
							<li>
								<Link href="/" onClick={(e) => props.navControl(false)(e)}>

                                    <HomeIcon />Home
                                </Link>
							</li>
							<li>
								{/* <Link href={`/lectures/${youtube.defaultPlaylistID}`}> */}
								<div className="m-sub-menu-wrap">
									<button
										className={classNames(
											"m-sub-menu-label",
											expand ? "expand" : ""
										)}
										onClick={() => handleClick()}>
										<div className="d-flex align-center">
											<VideoLibraryIcon />
											Lectures
										</div>
										<span>
											<i className="fa-solid fa-chevron-down"></i>
										</span>
									</button>
									<Collapse in={expand} timeout="auto" unmountOnExit>
										<ul className="m-sub-menu">
											{props.playlists &&
												props.playlists.map((item) => (
													<li key={item.id}>
														<Link
                                                            href={`/lectures/${item.id}`}
                                                            className={
                                                                item.id === props.activeId ? "active" : ""
                                                            }
                                                            onClick={(e) => props.navControl(false)(e)}>

                                                            {item.title}

                                                        </Link>
													</li>
												))}
										</ul>
									</Collapse>
								</div>
								{/* </Link> */}
							</li>
							<li>
								<Link href="/articles" onClick={(e) => props.navControl(false)(e)}>

                                    <ArticleIcon />Articles
                                </Link>
							</li>
							<li>
								<Link href="/books" onClick={(e) => props.navControl(false)(e)}>

                                    <LibraryBooksIcon />Books
                                </Link>
							</li>
							<li>
								<div className="m-sub-menu-wrap">
									<button
										className={classNames(
											"m-sub-menu-label",
											expand2 ? "expand" : ""
										)}
										onClick={() => handleClick2()}>
										<div className="d-flex align-center">
											<QuestionAnswer />
											Questions
										</div>
										<span>
											<i className="fa-solid fa-chevron-down"></i>
										</span>
									</button>
									<Collapse in={expand2} timeout="auto" unmountOnExit>
										<ul className="m-sub-menu">
											{props.qnaCategories &&
												props.qnaCategories.map((item, i) => (
													<li key={i}>
														<Link
                                                            href={`/questions/${item.slug}`}
                                                            className={
                                                                item.slug === props.activeCatSlug
                                                                    ? "active"
                                                                    : ""
                                                            }
                                                            onClick={(e) => props.navControl(false)(e)}>

                                                            {item.title}

                                                        </Link>
													</li>
												))}
										</ul>
									</Collapse>
								</div>
								{/* </Link> */}
							</li>

							<li>
								<Link href="/counselling-session" onClick={(e) => props.navControl(false)(e)}>

                                    {/* <ClassIcon /> */}
                                    <AssessmentIcon />Counselling Session
                                </Link>
							</li>
							<li>
								<Link href="/ask-a-question" onClick={(e) => props.navControl(false)(e)}>

                                    <QuestionAnswer />Ask a Question
                                </Link>
							</li>
							<li>
								<Link href="/contact" onClick={(e) => props.navControl(false)(e)}>

                                    <MailIcon />Contact
                                </Link>
							</li>
							<li>
								<Link href="/about" onClick={(e) => props.navControl(false)(e)}>

                                    <PersonIcon />About
                                </Link>
							</li>
						</ul>
					</div>

					<div className="m-menu-bottom">
						<h2>Social</h2>
						<div className="m-menu-social">
							<a
								href="https://www.facebook.com/SheikhAssimAlhakeemTeam/"
								target="_blank">
								<i className="facebook fab fa-facebook-f"></i>
								<span>Facebook</span>
							</a>
							<a
								href="https://instagram.com/assimalhakeem?igshid=1v9psnayget6c"
								target="_blank">
								<i className="instagram fab fa-instagram"></i>
								<span>Instagram</span>
							</a>
							<a href="https://twitter.com/Assimalhakeem" target="_blank">
								<i className="twitter fab fa-twitter"></i>
								<span>Twitter</span>
							</a>
							<a
								href="https://www.youtube.com/user/assimalhakeem"
								target="_blank">
								<i className="youtube fab fa-youtube"></i>
								<span>YouTube</span>
							</a>
							{/* <a
								href="https://podcasts.apple.com/ca/podcast/hacene-chebbani/id1138416079"
								target="_blank">
								<i className="fa fa-podcast"></i>
								<span>Apple Podcast</span>
							</a> */}
						</div>
						<p
							className="footer-powered-by"
							style={{ marginTop: "32px", color: "#fff" }}>
							Powered By -{" "}
							<a
								className="link-r"
								href="https://www.deeniinfotech.com"
								target="_blank"
								style={{ color: "#fff", opacity: "0.7" }}>
								Deeni Info Tech
							</a>
						</p>
					</div>

					{/*<div className="m-menu-bottom m-menu-address">*/}
					{/*  <p>Islamic Information Society of Calgary (IISC)</p>*/}
					{/*  <p>PO Box 64295, Thorncliffe PO</p>*/}
					{/*  <p>Calgary, AB, T2K 6J7</p>*/}
					{/*</div>*/}

					{/* <div className="m-menu-bottom">
            <hr className="m-menu-hr" />
          </div> */}

					{/*<div className="m-menu-bottom">*/}
					{/*  <p className="footer-powered-by">*/}
					{/*    Powered By -{" "}*/}
					{/*    <a*/}
					{/*      className="link-r"*/}
					{/*      href="https://www.deeniinfotech.com"*/}
					{/*      target="_blank"*/}
					{/*    >*/}
					{/*      Deeni Info Tech*/}
					{/*    </a>*/}
					{/*  </p>*/}
					{/*</div>*/}
				</div>
			</div>
		</Drawer>
    );
}
