import "./Home.css";
import { FaGithub } from "react-icons/fa";
import { SiThreedotjs, SiGithubpages, SiArchlinux } from "react-icons/si";
import CardTilt from "../stuff/CardTilt";
import SceneCanvas from "../hooks/SceneCanvas";
import React, { useEffect } from "react";
import UserInfo from "../stuff/UserInfo";
import GithubInfo from "../stuff/GhInfo";
import ListPosts from "../stuff/ListPosts.js";

function Home() {
  const [triggerAnimation, setTriggerAnimation] = React.useState(null);
  const [setTriggerTextAnimation] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const baseUrl = "https://api.github.com";

  const currentlyReading = "To The Lighthouse";
  const currentlyLearning = "Three JS, lua, rust, opengl";

  useEffect(() => {
    const fetchDate = async () => {
      const userInfo = await getGithubUserInfo("camtisocial");
      setUserInfo(userInfo);
      console.log("public Repos: ", userInfo.publicRepos);
      console.log("name: ", userInfo.name);
      console.log("avatar Url: ", userInfo.avatarUrl);
      console.log("updated at: ", userInfo.updated_at);
    };
    fetchDate();
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }, 50);
  }, []);

  const handleButtonAnims = () => {
    if (triggerAnimation) triggerAnimation();
    setTimeout(() => {
      scrollDown();
      fadeOutButtonGlow();
    }, 1000);
  };

  const scrollDown = () => {
    const start = window.pageYOffset;
    const end = start + window.innerHeight;
    const duration = 1000;
    const startTime = performance.now();

    const easeInOutQuint = (t, b, c, d) => {
      t /= d;
      return -c * t * (t - 2) + b;
    };

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const nextScrollY = easeInOutQuint(
        timeElapsed,
        start,
        end - start,
        duration,
      );

      window.scrollTo(0, nextScrollY);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, end);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const fadeOutButtonGlow = () => {
    const button = document.querySelector(".Hover-area");
    if (button) {
      button.style.transition = "opacity 0.6s ease-out";
      button.style.opacity = "0";
    }
  };

  async function getGithubUserInfo(userName) {
    try {
      const response = await fetch(`${baseUrl}/users/${userName}`);
      const json = await response.json();
      return new GithubInfo(json);
    } catch (error) {
      console.error("Error fetching GitHub user info:", error);
      return null;
    }
  }

  return (
    <div className="App">
      <div className="Background">
        <SceneCanvas
          setTriggerAnimation={setTriggerAnimation}
          setTriggerTextAnimation={setTriggerTextAnimation}
        />
        <UserInfo className="User-info" />
        <button className="Hover-area" onClick={handleButtonAnims} />
        <div style={{ height: "20vh" }}>asdf</div>

        <CardTilt>
          <div className="Text-container">
            {/* ----------MAKE THIS AN ARRAY---------- */}
            {/* ----------first column---------- */}
            <div className="Header-container">
              <a
                className="Github-stats"
                href="https://github.com/camtisocial"
                target="_blank"
                rel="noreferrer"
              >
                <div>
                  <div className="GH-rectangle GH-subsection">
                    <img
                      className="Profile-pic"
                      src={userInfo?.avatarUrl}
                      alt="Avatar"
                    />
                    <p>
                      <strong>{userInfo?.name}</strong> <br />
                      <FaGithub className="GH-icon" />
                      <span className="GH-text">{userInfo?.username}</span>
                      <br />
                    </p>
                  </div>
                  <div className="GH-subsection GH-rectangle2">
                    <strong>public repos - {userInfo?.publicRepos}</strong>
                  </div>
                  <div className="GH-subsection GH-rectangle3">
                    <ul className="GH-list">
                      <li>
                        {" "}
                        <a
                          href="https://github.com/camtisocial/p2p-chess"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="GH-links">
                            <strong>p2p-chess:</strong>{" "}
                            <span style={{ color: "white" }}>
                              a CLI chess app with peer-to-peer multiplayer and
                              chat. Packaged for debian and arch linux
                            </span>
                          </span>
                        </a>
                      </li>
                      <li>
                        {" "}
                        <a
                          href="https://cameronthompson.org/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="GH-links">
                            <strong>cameronthompson.org:</strong>{" "}
                            <span style={{ color: "white" }}>
                              React frontend and serverless backend, hosted with
                              AWS
                            </span>
                          </span>
                        </a>
                      </li>
                      <li>
                        {" "}
                        <a
                          href="https://github.com/camtisocial/dot-files"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="GH-links">
                            <strong>dot-files:</strong>{" "}
                            <span style={{ color: "white" }}>
                              modern dot files for neovim, bash, tmux, and more
                            </span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </a>
            </div>
            {/* ----------second column---------- */}
            <div className="Header-container">
              <br /> <br />
              <h1 className="Header"> About </h1>
              <div
                style={{ display: "flex", alignItems: "center", gap: "70px" }}
              >
                <img
                  className="Profile-pic-2"
                  src={`${process.env.PUBLIC_URL}/images/IMG_4652.jpg`}
                  alt="Avatar"
                />
                <span style={{ fontSize: "2vh" }}> {"<------ me"} </span>
              </div>
              <p className="About-text">
                <br />
                Hi, thanks for looking at my website. I post here once in a while. You can find my contact info on github.
                <br />
                <br />
              </p>
              <table className="About-table">
                <tr></tr>
                <tr>
                  <th>Age:</th>
                  <td>25</td>
                </tr>
                <tr>
                  <th>Location:</th>
                  <td>Austin</td>
                </tr>
                <tr>
                  <th>Reading:</th>
                  <td>{currentlyReading} </td>
                </tr>
              </table>
            </div>
            {/* ----------third column---------- */}
              <br /> <br />
              <ListPosts />
          </div>
        </CardTilt>
      </div>
    </div>
  );
}

export default Home;
