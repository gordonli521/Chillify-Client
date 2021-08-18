import "../styling/artist-page.css";
import "semantic-ui-css/semantic.min.css";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import React, { useState, useEffect, useContext } from "react";
import Loading from "./loading";
import { Link, useParams } from "react-router-dom";
import { AiFillPlayCircle, AiOutlineHeart } from "react-icons/ai";
import { BiPlay, BiPause } from "react-icons/bi";
import toggleFavorites from "../favorites-controller/toggleFavorites";
import { Application } from "../App";
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

const ArtistPage = () => {
  const {
    state,
    dispatch,
    checkJwtToken,
    fetchSingleArtist,
    fetchArtistPlaylists,
    fetchAllSongs,
    fetchFavorites,
    setShowPlaybar,
  } = useContext(Application);

  const [userFavorites, setUserFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [popularSongs, setPopularSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [artist, setArtist] = useState(null);
  const [image, setImage] = useState("");
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState({});
  const [isHovering, setIsHovering] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const { name } = useParams();

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
      // audio.play();
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
      dispatch({ type: CHANGE_LIST, payload: { songs: popularSongs } });
      dispatch({ type: SONG_CHANGED, payload: song });
      playlists.forEach((playlist) => {
        if (playlist.songs.includes(song._id)) {
          let currSongImage = `https://docs.google.com/uc?export=download&id=${
            playlist.image.split("/")[5]
          }`;
          dispatch({ type: SET_IMAGE, payload: { image: currSongImage } });

          return playlist;
        }
      });
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
      let singleArtist = await fetchSingleArtist(name);
      setArtist(singleArtist);
      let artistPlaylists = await fetchArtistPlaylists(name);
      setPlaylists(artistPlaylists);
      let allSongs = await fetchAllSongs();
      setSongs(allSongs);
      let favorites = await fetchFavorites();
      setUserFavorites(favorites);
      setLoading(false);
    };
    wait();
  }, []);

  useEffect(() => {
    if (artist) {
      setPlaylists(artist.playlists);
      setImage(
        `https://docs.google.com/uc?export=download&id=${
          artist.image.split("/")[5]
        }`
      );
    }
  }, [artist]);

  // Filters and loads the songs by views
  useEffect(() => {
    let playlistsSongs = [];
    playlists.forEach((playlist) => {
      songs.forEach((song) => {
        if (song.playlist === playlist.title) {
          playlistsSongs.push(song);
        }
      });
    });
    let sortPopular = playlistsSongs.sort((a, b) => b.plays - a.plays);
    if (sortPopular.length >= 4) {
      setPopularSongs(sortPopular.slice(0, 4));
    } else {
      setPopularSongs(sortPopular);
    }
  }, [playlists, songs]);

  // Change image when playlist changes
  useEffect(() => {
    const wait = async () => {
      let filtered = await playlists.filter((playlist) => {
        if (playlist.songs.includes(state.id)) {
          return playlist;
        }
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
      <div className="artist">
        <div className="artist-pic-and-name-2">
          <div>
            <img src={image} className="artist-img" alt="artist" />
          </div>
          <div>
            <h1 className="artist-title">
              {artist ? artist.name : "default name"}
            </h1>
          </div>
        </div>
        <div className="popular">
          <h2>Popular</h2>
          <div className="popular-songs">
            {popularSongs ? (
              <div className="songs-container">
                {popularSongs.map((song, index) => {
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
                        </div>
                      </div>
                      <div className="song-second-and-third-part">
                        <Link to={`/artist/${name}/playlist/${song.playlist}`}>
                          <div className="song-second-part">
                            {song.playlist}
                          </div>
                        </Link>
                        {/* </div> */}
                        <div className="song-third-part">
                          <div className="favorites-btn">
                            <AiOutlineHeart
                              onClick={() => {
                                clickFavorite(song._id);
                              }}
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
            ) : (
              "No songs available"
            )}
          </div>
        </div>
        <div className="albums">
          <h2>Albums</h2>
          <div className="playlists-container">
            {playlists.length !== 0
              ? playlists.map((playlist) => {
                  return (
                    <div key={playlist._id} className="playlist-container">
                      <Link
                        to={`/artist/${name}/playlist/${playlist.title}`}
                        onMouseOver={() => handleMouseOver(playlist)}
                        onMouseOut={() => setHover(false)}
                      >
                        {hover && selected._id === playlist._id ? (
                          <AiFillPlayCircle
                            className="playlist-overlay"
                            onMouseOver={() => handleMouseOver(playlist)}
                          />
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
                })
              : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtistPage;
