import "../styling/search-page.css";
import "semantic-ui-css/semantic.min.css";
import SearchNavbar from "./search-navbar";
import Sidebar from "./sidebar";
import React, { useState, useEffect, useContext } from "react";
import { AiFillPlayCircle, AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import { BiTime, BiPlay, BiPause } from "react-icons/bi";
import { Link } from "react-router-dom";
import Loading from "./loading";
import { Application } from "../App";
import toggleFavorites from "../favorites-controller/toggleFavorites";
import fetchAllPlaylists from "../fetch-data/fetchAllPlaylists";
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
import { API_URL } from "../url";

const SearchPage = () => {
  const { state, dispatch, checkJwtToken, fetchFavorites, setShowPlaybar } =
    useContext(Application);

  const [searchTerm, setSearchTerm] = useState("");
  const [userFavorites, setUserFavorites] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState({});
  const [selectedIndex, setSelectedIndex] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [image, setImage] = useState("");

  const fetchArtists = async () => {
    try {
      const response = await fetch(`${API_URL}/artists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      let filteredArtists = data.filter((artist) => {
        if (searchTerm === "") {
          return false;
        } else if (
          artist.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return artist;
        }
        return false;
      });
      setArtists(filteredArtists);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await fetch(`${API_URL}/songs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      let filteredSongs = data.filter((song) => {
        if (searchTerm === "") {
          return false;
        } else if (
          song.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return song;
        }
        return false;
      });
      setSongs(filteredSongs);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${API_URL}/playlists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      let filteredPlaylists = data.filter((playlist) => {
        if (searchTerm === "") {
          return false;
        } else if (
          playlist.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return playlist;
        }
        return false;
      });
      setPlaylists(filteredPlaylists);
    } catch (err) {
      console.log(err);
    }
  };

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
      audio.src = `https://docs.google.com/uc?export=open&id=${split[5]}`;
      // audio.play();
      dispatch({ type: SONG_PLAYED });
      dispatch({ type: CHANGE_LIST, payload: { songs: songs } });
      dispatch({ type: SONG_CHANGED, payload: song });
      dispatch({ type: SET_IMAGE, payload: { image } });
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setLoading(true);
    const wait = async () => {
      await checkJwtToken();
      setShowPlaybar(true);
      await fetchArtists();
      await fetchSongs();
      await fetchPlaylists();
      let favorites = await fetchFavorites();
      setUserFavorites(favorites);
      setLoading(false);
    };
    wait();
  }, []);

  useEffect(() => {
    // const artistDisplay = document.querySelector(".filtered-artists-container");
    // const songDisplay = document.querySelector(".filtered-songs-container");
    // const playlistDisplay = document.querySelector(
    //   ".filtered-playlists-container"
    // );

    // if (searchTerm.length > 0) {
    //   artistDisplay.style.display = "none";
    //   songDisplay.style.display = "none";
    //   playlistDisplay.style.display = "none";
    // }

    const wait = async () => {
      await checkJwtToken();
      await fetchArtists();
      // if (artists.length === 0) {
      //   artistDisplay.style.display = "none";
      // }
      // if (artists.length > 0) {
      //   artistDisplay.style.display = "block";
      // }
      await fetchSongs();
      // if (songs.length === 0) {
      //   songDisplay.style.display = "none";
      // }
      // if (songs.length > 0) {
      //   songDisplay.style.display = "block";
      // }
      await fetchPlaylists();
      // if (playlists.length === 0) {
      //   playlistDisplay.style.display = "none";
      // }
      // if (playlists.length > 0) {
      //   playlistDisplay.style.display = "block";
      // }
    };
    wait();
  }, [searchTerm]);

  useEffect(() => {
    const wait = async () => {
      let allPlaylists = await fetchAllPlaylists();
      let filtered = await allPlaylists.filter((playlist) => {
        if (playlist.songs.includes(state.id)) {
          return playlist;
        } else {
          return false;
        }
      });
      if (filtered.length > 0) {
        setImage(
          `https://docs.google.com/uc?export=download&id=${
            filtered[0].image.split("/")[5]
          }`
        );
      }
    };
    wait();
  }, [state.playlist]);

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
  }, [state.playlist, playlists, dispatch, state.id]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <SearchNavbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSubmit={handleSubmit}
      />
      <Sidebar />
      <div className="search-page-container">
        <div className="search-results-container">
          <h1>Search Results</h1>
          {artists.length !== 0 ? (
            <div className="filtered-artists-container">
              <h2>Artists</h2>
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

          {songs.length !== 0 ? (
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
                {songs.map((song, index) => {
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
                          <div className="song-second-part">
                            {song.playlist}
                          </div>
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

          {playlists.length !== 0 ? (
            <div className="filtered-playlists-container">
              <h2>Albums</h2>
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
                            <h3 className="playlist-title">{playlist.title}</h3>
                          </div>
                          <div className="playlist-artist">
                            <h3 className="playlist-artist">
                              {playlist.artist}
                            </h3>
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
    </>
  );
};

export default SearchPage;
