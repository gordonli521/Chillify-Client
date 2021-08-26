import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import "../styling/playlist-page.css";
import "semantic-ui-css/semantic.min.css";
import { BiTime, BiPlay, BiPause } from "react-icons/bi";
import { AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import Loading from "./loading";
import toggleFavorites from "../favorites-controller/toggleFavorites";
import {
  SONG_PAUSED,
  SONG_PLAYED,
  SONG_CHANGED,
  SET_IMAGE,
  CHANGE_LIST,
  ADD_SONG_TO_HISTORY,
  CLEAR_SONG_HISTORY,
  RESET_HISTORY_INDEX,
  SET_HISTORY_INDEX,
} from "../actions/types";
import { Application } from "../App";
import { API_URL } from "../url";

const PlaylistPage = () => {
  const {
    state,
    dispatch,
    checkJwtToken,
    fetchFavorites,
    fetchAllSongs,
    setShowPlaybar,
  } = useContext(Application);
  const { name, title } = useParams();
  const [playlist, setPlaylist] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [image, setImage] = useState("");
  const [length, setLength] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [userFavorites, setUserFavorites] = useState([]);

  const fetchPlaylist = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/artists/${name}/playlist/${title}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setPlaylist(data[0]);
      setImage(
        `https://docs.google.com/uc?export=download&id=${
          data[0].image.split("/")[5]
        }`
      );
      setLength(data[0].songs.length);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePlay = (song) => {
    let audio = document.getElementById("stereo");
    let split = song.url.split("/");
    dispatch({ type: CLEAR_SONG_HISTORY });
    dispatch({ type: RESET_HISTORY_INDEX });
    dispatch({ type: ADD_SONG_TO_HISTORY, payload: { addSong: song } });
    dispatch({ type: SET_HISTORY_INDEX });
    if (state.isPlaying && song._id === state.id) {
      audio.pause();
      dispatch({ type: SONG_PAUSED });
    } else if (!state.isPlaying && song._id === state.id) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      }
      dispatch({ type: SONG_PLAYED });
    } else {
      audio.src = `https://docs.google.com/uc?export=open&id=${split[5]}`;
      dispatch({ type: SONG_PLAYED });
      dispatch({ type: CHANGE_LIST, payload: { songs: songs } });
      dispatch({ type: SONG_CHANGED, payload: song });
      dispatch({ type: SET_IMAGE, payload: { image } });
    }
  };

  const handleMouseOver = (index) => {
    setIsHovering(true);
    setSelectedIndex(index + 1);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const clickFavorite = (id) => {
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
      let favorites = await fetchFavorites();
      setUserFavorites(favorites);
      await fetchPlaylist();
      let allSongs = await fetchAllSongs();
      let playlistSongs = allSongs.filter((song) => song.playlist === title);
      setSongs(playlistSongs);

      setLoading(false);
    };
    wait();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Navbar />
      <Sidebar />
      <div className="playlist-page-container">
        <div className="playlist-info">
          <img src={image} alt="playlist" />
          <div className="playlist-text">
            <div className="playlist-text-top">
              <h5>ALBUM</h5>
              <h1>{playlist.title}</h1>
            </div>
            <div className="playlist-text-bottom">
              <div className="playlist-artist-name">
                <p>
                  By{" "}
                  <Link
                    to={`/artist/${playlist.artist}`}
                    className="artist-link"
                  >
                    {playlist.artist}
                  </Link>
                </p>
              </div>
              <div className="playlist-extra-info">
                <p>{playlist.year}</p>
                <p className="bullet">{"\u2B24"}</p>
                <p>{length} songs</p>
              </div>
              <div className="playlist-favorite-btn">
                <AiOutlineHeart
                  onClick={() => clickFavorite(playlist._id)}
                  className={
                    userFavorites.includes(playlist._id)
                      ? "isFavorited"
                      : "notFavorited"
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="songs-container">
          <div className="song-header">
            <div className="song-item-info-header">
              <div className="index-num">
                <h5>#</h5>
              </div>
              <div className="title">
                <h5>TITLE</h5>
              </div>
            </div>
            <div className="song-third-part-header">
              <p className="time-icon">
                <BiTime />
              </p>
              <p className="view-icon">
                <AiOutlineEye />
              </p>
            </div>
          </div>
          {songs.map((song, index) => {
            return (
              <div
                className="song"
                key={song._id}
                onMouseEnter={() => handleMouseOver(index)}
                onMouseLeave={() => handleMouseOut()}
              >
                <div className="song-item-info">
                  <div className="song-index-container">
                    {isHovering && selectedIndex === index + 1 ? (
                      <div
                        className="play-song"
                        onClick={() => handlePlay(song)}
                      >
                        {song._id === state.id && state.isPlaying ? (
                          <BiPause className="pause-icon" />
                        ) : (
                          <BiPlay className="play-icon" />
                        )}
                      </div>
                    ) : (
                      <div
                        className={`${
                          state.id === song._id
                            ? "song-highlight"
                            : "song-index"
                        }`}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="song-title-and-artist">
                    <div
                      className={`song-title ${
                        state.id === song._id ? "song-highlight" : ""
                      }`}
                    >
                      {song.title}
                    </div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                </div>
                <div className="song-third-part">
                  <div className="favorites-btn">
                    <AiOutlineHeart
                      onClick={() => clickFavorite(song._id)}
                      className={
                        userFavorites.includes(song._id)
                          ? "isFavorited"
                          : "notFavorited"
                      }
                    />
                  </div>
                  <div className="song-duration">{song.duration}</div>
                  <div className="song-plays">{song.plays}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PlaylistPage;
