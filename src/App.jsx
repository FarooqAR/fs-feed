import { useCallback, useEffect, useState } from "react";
import ReactTimeago from "react-timeago";
import { Card } from "./components/Card";
import { Flex } from "./components/Flex";
import { Image } from "./components/Image";
import { Text } from "./components/Text";
import { IconYoutube } from "./components/icons/IconYoutube";
import { Link } from "./components/Link";
import { IconMoon } from "./components/icons/IconMoon";
import { IconSun } from "./components/icons/IconSun";
import { IconRefresh } from "./components/icons/IconRefresh";
import { IconButton } from "./components/IconButton";
import { IconArchive } from "./components/icons/IconArchive";

const YOUTUBE_API_ENDPOINT = "https://youtube.googleapis.com/youtube/v3";
const FS_LATEST_PLAYLIST_ID = "PLmOlpCLzJ-tQZ5U8dn_HZps80_k4PVZW8";
const API_KEY = "AIzaSyAMxQ4yTWkh9FcG0uE-SqactNRMe-dDT48";
const MAX_RESULTS = 20;

function App() {
  const [error, setError] = useState(null);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const [videos, setVideos] = useState(null);
  const [archivedVideoIds, setArchivedVideoIds] = useState([]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const fetchVideos = useCallback(async () => {
    setIsFetchingVideos(true);
    setError(null)
    try {
      let result = await fetch(
        `${YOUTUBE_API_ENDPOINT}/playlistItems?playlistId=${FS_LATEST_PLAYLIST_ID}&key=${API_KEY}&part=snippet&maxResults=${MAX_RESULTS}`
      );
      result = await result.json();
      setVideos(result.items);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsFetchingVideos(false);
    }
  }, []);

  useEffect(() => {
    const root = document.querySelector(":root");
    if (theme === "light") {
      root.style.setProperty("background-color", "#eaeaea");
      root.style.setProperty("color-scheme", "light");
    } else {
      root.style.setProperty("background-color", "#21262d");
      root.style.setProperty("color-scheme", "dark");
    }
  }, [theme]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const onArchive = (videoId) => {
    setArchivedVideoIds((prev) => [...prev, videoId]);
  };

  return (
    <>
      <Flex justify="space-between" style={{ maxWidth: "530px" }}>
        <IconButton
          onClick={fetchVideos}
          disabled={isFetchingVideos}
          title="Refresh feed"
          aria-label="Refresh feed"
        >
          <IconRefresh />
        </IconButton>
        <IconButton
          onClick={toggleTheme}
          title="Switch color mode"
          aria-label="Switch color mode"
        >
          {theme === "light" ? <IconMoon /> : <IconSun />}
        </IconButton>
      </Flex>
      <h1 style={{ textAlign: "center" }}>Framestore Feed</h1>

      {isFetchingVideos ? (
        <div style={{ textAlign: "center" }}>Loading...</div>
      ) : error ? <div style={{ textAlign: "center", color: 'red' }}>{error}</div> : (
        videos
          ?.filter((v) => !archivedVideoIds.includes(v.id))
          ?.map((v) => (
            <Card
              key={v.id}
              className="card"
              color={theme === "light" ? "black" : "white"}
              bgcolor={theme === "light" ? "white" : "#30363d"}
            >
              <Flex>
                <div style={{ flex: 1, paddingRight: "0.5rem" }}>
                  <Flex alignitems="center">
                    <Flex alignitems="center" flex="1">
                      <IconYoutube style={{ marginRight: "0.3rem" }} />
                      <ReactTimeago
                        date={v.snippet.publishedAt}
                        title={new Date(v.snippet.publishedAt).toLocaleString()}
                        style={{
                          fontSize: "0.9rem",
                          color:
                            theme === "light"
                              ? "rgba(0,0,0,0.8)"
                              : "rgba(255,255,255,0.8)",
                        }}
                      />
                    </Flex>
                    <IconButton
                      title="Archive"
                      aria-label="Archive"
                      className="button"
                      onClick={() => onArchive(v.id)}
                    >
                      <IconArchive width="16" height="16" />
                    </IconButton>
                  </Flex>
                  <Link
                    target="_blank"
                    href={`https://youtube.com/watch?v=${v.snippet.resourceId.videoId}`}
                  >
                    {v.snippet.title}
                  </Link>
                  {v.snippet.description && (
                    <Text>{v.snippet.description.slice(0, 90)}...</Text>
                  )}
                </div>
                <Image
                  borderradius="0.4rem"
                  height="100px"
                  src={v.snippet.thumbnails.standard.url}
                />
              </Flex>
            </Card>
          ))
      )}
    </>
  );
}

export default App;
