import "../styling/favorites-page.css";
import "semantic-ui-css/semantic.min.css";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AiFillPlayCircle, AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import { BiTime, BiPlay, BiPause } from "react-icons/bi";
import Loading from "./loading";
import { Application } from "../App";
import toggleFavorites from "../favorites-controller/toggleFavorites";
import {
  SONG_PAUSED,
  SONG_PLAYED,
  CHANGE_LIST,
  SONG_CHANGED,
  SET_IMAGE,
  CLEAR_SONG_HISTORY,
  RESET_HISTORY_INDEX,
  ADD_SONG_TO_HISTORY,
  SET_HISTORY_INDEX,
} from "../actions/types";

const FavoritesPage = () => {
  const [songs, setSongs] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [favoritePlaylists, setFavoritePlaylists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState({});
  const [selectedIndex, setSelectedIndex] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);
  const {
    state,
    dispatch,
    checkJwtToken,
    fetchFavorites,
    fetchAllPlaylists,
    fetchAllSongs,
    setShowPlaybar,
  } = useContext(Application);

  const handleMouseOver = (selected) => {
    setHover(true);
    setSelected(selected);
  };

  const handleSongMouseOver = (index) => {
    setIsHovering(true);
    setSelectedIndex(index + 1);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
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
      audio.src = `https://docs.google.com/uc?export=download&id=${split[5]}`;
      dispatch({ type: SONG_PLAYED });
      dispatch({ type: CHANGE_LIST, payload: { songs: favoriteSongs } });
      dispatch({ type: SONG_CHANGED, payload: song });
    }
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
      let favorites = await fetchFavorites();
      setUserFavorites(favorites);

      let allSongs = await fetchAllSongs();
      setSongs(allSongs);

      let allPlaylists = await fetchAllPlaylists();
      setPlaylists(allPlaylists);

      setLoading(false);
    };
    wait();
  }, [
    checkJwtToken,
    fetchFavorites,
    fetchAllSongs,
    fetchAllPlaylists,
    setShowPlaybar,
  ]);

  useEffect(() => {
    let filteredSongs = songs.filter((song) => {
      if (userFavorites.includes(song._id)) {
        return song;
      }
      return false;
    });
    setFavoriteSongs(filteredSongs);

    let filteredPlaylists = playlists.filter((playlist) => {
      if (userFavorites.includes(playlist._id)) {
        return playlist;
      }
      return false;
    });
    setFavoritePlaylists(filteredPlaylists);
  }, [songs, playlists, userFavorites]);

  // Change image when playlist changes
  useEffect(() => {
    const wait = async () => {
      let filtered = await playlists.filter((playlist) => {
        if (playlist.songs.includes(state.id)) {
          return playlist;
        }
        return false;
      });
      if (filtered.length > 0) {
        dispatch({
          type: SET_IMAGE,
          payload: {
            image: `https://docs.google.com/uc?export=download&id=${
              filtered[0].image.split("/")[5]
            }`,
          },
        });
      }
    };
    wait();
  }, [state.playlist]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Navbar />
      <Sidebar />
      <div className="favorites-page-container">
        <h1>Favorites</h1>
        {favoriteSongs.length === 0 && favoritePlaylists.length === 0 ? (
          <div className="no-results">
            <h3>Please add songs or albums to your favorites.</h3>
          </div>
        ) : (
          ""
        )}

        {favoriteSongs.length !== 0 ? (
          <div className="filtered-songs-container">
            <h2>Songs</h2>
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
                <div className="song-second-and-third-part-header">
                  <div className="song-second-part-header">ALBUM</div>
                  <div className="song-third-part-header">
                    <p className="time-icon">
                      <BiTime />
                    </p>
                    <p className="view-icon">
                      <AiOutlineEye />
                    </p>
                  </div>
                </div>
              </div>
              {favoriteSongs.map((song, index) => {
                return (
                  <div
                    key={song._id}
                    className="song"
                    onMouseEnter={() => handleSongMouseOver(index)}
                    onMouseLeave={() => handleMouseOut()}
                  >
                    <div className="song-item-info">
                      <div
                        className="song-index-container"
                        onClick={() => handlePlay(song)}
                      >
                        {isHovering && selectedIndex === index + 1 ? (
                          <div className="play-song">
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
                        <div className="search-song-artist-container">
                          <Link
                            to={`/artist/${song.artist}`}
                            className="song-artist"
                          >
                            {song.artist}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="song-second-and-third-part">
                      <Link
                        to={`/artist/${song.artist}/playlist/${song.playlist}`}
                        className="song-playlist"
                      >
                        <div className="song-second-part">{song.playlist}</div>
                      </Link>
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
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}

        {favoritePlaylists.length !== 0 ? (
          <div className="filtered-playlists-container">
            <h2>Albums</h2>
            <div className="playlists-container">
              {favoritePlaylists.map((playlist) => {
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
    </>
  );
};

export default FavoritesPage;
