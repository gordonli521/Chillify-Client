import "../styling/main-page.css";
import "semantic-ui-css/semantic.min.css";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Loading from "./loading";
import { AiFillPlayCircle, AiOutlineHeart } from "react-icons/ai";
import { Application } from "../App";
import toggleFavorites from "../favorites-controller/toggleFavorites";
import fetchFavorites from "../fetch-data/fetchFavorites";

const HomePage = () => {
  const { checkJwtToken, fetchArtists, fetchAllPlaylists, setShowPlaybar } =
    useContext(Application);

  const [artists, setArtists] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState({});

  const handleMouseOver = (selected) => {
    setHover(true);
    setSelected(selected);
  };

  const clickPlaylistFavorite = (e, id) => {
    e.preventDefault();
    toggleFavorites(id);
    if (userFavorites.includes(id)) {
      let removedFavorite = userFavorites.filter((favorite) => {
        return favorite !== id;
      });
      setUserFavorites(removedFavorite);
    } else {
      setUserFavorites([...userFavorites, id]);
    }
  };

  useEffect(() => {
    setLoading(true);
    const wait = async () => {
      await checkJwtToken();
      setShowPlaybar(true);
      let allArtists = await fetchArtists();
      setArtists(allArtists);
      let allPlaylists = await fetchAllPlaylists();
      const sortPlays = allPlaylists.sort((a, b) => b.plays - a.plays);

      setPlaylists(sortPlays);
      let favorites = await fetchFavorites();
      setUserFavorites(favorites);

      setLoading(false);
    };
    wait();
  }, [checkJwtToken, fetchAllPlaylists, fetchArtists, setShowPlaybar]);

  return loading ? (
    <Loading />
  ) : (
    <div className="outer-home">
      <Navbar />
      <Sidebar />
      <div className="home-page-container">
        {artists && artists.length !== 0 ? (
          <div>
            <h1>Suggested Artists</h1>
            <div className="artists-container">
              {artists.map((artist) => {
                return (
                  <div
                    key={artist._id}
                    className="outer-artist-pic-and-name-container"
                  >
                    <Link
                      to={`/artist/${artist.name}`}
                      className="artist-pic-and-name"
                      onMouseOver={() => handleMouseOver(artist)}
                      onMouseOut={() => setHover(false)}
                    >
                      {hover && selected._id === artist._id ? (
                        <AiFillPlayCircle
                          className="artist-overlay"
                          onMouseOver={() => handleMouseOver(artist)}
                        />
                      ) : (
                        <AiFillPlayCircle className="artist-overlay-hidden" />
                      )}

                      <div className="artist-pic-container">
                        <img
                          src={`https://docs.google.com/uc?export=download&id=${
                            artist.image.split("/")[5]
                          }`}
                          className="artist-img"
                          alt="artist"
                        />
                      </div>
                      <div className="artist-name-container">
                        <h3 className="artist-name">{artist.name}</h3>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
        {playlists && playlists.length !== 0 ? (
          <div>
            <h1>Featured Tracks</h1>
            <div className="playlists-container">
              {playlists.map((playlist) => {
                return (
                  <div
                    key={playlist._id}
                    className="playlist-container"
                    onMouseOver={() => handleMouseOver(playlist)}
                    onMouseOut={() => setHover(false)}
                  >
                    <Link
                      to={`/artist/${playlist.artist}/playlist/${playlist.title}`}
                    >
                      {hover && selected._id === playlist._id ? (
                        <AiFillPlayCircle className="playlist-overlay" />
                      ) : (
                        <AiFillPlayCircle className="artist-overlay-hidden" />
                      )}
                      <div
                        className="playlist-img playlist-ele"
                        key={playlist._id}
                      >
                        <img
                          src={`https://docs.google.com/uc?export=download&id=${
                            playlist.image.split("/")[5]
                          }`}
                          className="playlist-img"
                          alt="playlist"
                        />
                      </div>
                      <div className="playlist-ele-2">
                        <div className="playlist-title">
                          <h3>{playlist.title}</h3>
                        </div>
                        <div className="playlist-artist">
                          <h3>{playlist.artist}</h3>
                        </div>
                        <div className="playlist-favorite-btn">
                          <AiOutlineHeart
                            onClick={(e) => {
                              clickPlaylistFavorite(e, playlist._id);
                            }}
                            className={
                              userFavorites.includes(playlist._id)
                                ? "isFavorited"
                                : "notFavorited"
                            }
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default HomePage;
