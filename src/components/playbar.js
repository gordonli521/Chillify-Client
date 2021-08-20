import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../styling/playbar.css";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import { CgPlayTrackPrev, CgPlayTrackNext } from "react-icons/cg";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { IoShuffle, IoRepeat } from "react-icons/io5";
import { Application } from "../App";
import {
  INCREMENT_TIME,
  SONG_END,
  SONG_PAUSED,
  SONG_PLAYED,
  SONG_CHANGED,
  CHANGE_TIME,
  ADJUST_VOLUME,
  TOGGLE_SHUFFLE,
  TOGGLE_REPEAT,
  REMOVE_CURR_SONG_FROM_TEMP,
  RENEW_SONG_LIST,
  CLEAR_SONG,
  INCREMENT_HISTORY_INDEX,
  ADD_SONG_TO_HISTORY,
  CLEAR_SONG_HISTORY,
  RESET_HISTORY_INDEX,
  DECREMENT_HISTORY_INDEX,
  SET_SEEK_OFF,
  SET_SEEK_ON,
  IS_MOUSEDOWN,
  IS_NOT_MOUSEDOWN,
  IS_VOLUME_NOT_MOUSEDOWN,
  IS_VOLUME_MOUSEDOWN,
  VOLUME_MUTE,
  VOLUME_UNMUTE,
} from "../actions/types";
import incrementPlays from "../playsController/incrementPlays";

const Playbar = () => {
  let audio;
  const { state, dispatch } = useContext(Application);

  const handlePlay = () => {
    let audio = document.getElementById("stereo");
    if (state.isSet) {
      if (state.isPlaying) {
        audio.pause();
        dispatch({ type: SONG_PAUSED });
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {})
            .catch((err) => {
              console.log(err);
            });
        }
        dispatch({
          type: CHANGE_TIME,
          payload: { currentTime: audio.currentTime },
        });
        dispatch({ type: SONG_PLAYED });
      }
    }
  };

  const nextSong = () => {
    audio = document.querySelector("#stereo");

    if (
      state.playHistory.length !== 0 &&
      state.playHistoryIndex + 1 < state.playHistory.length &&
      state.playHistoryIndex !== null
    ) {
      dispatch({
        type: SONG_CHANGED,
        payload: state.playHistory[state.playHistoryIndex + 1],
      });
      dispatch({ type: INCREMENT_HISTORY_INDEX });
    }
    // If shuffle is on, randomize next song
    else if (state.isSet && state.isShuffle) {
      let currSongIndex = state.tempSongList.findIndex(
        (song) => song.title === state.title
      );
      // Remove played song in shuffle so no repeat songs and add to history
      let songListAfterRemovingIndex = [...state.tempSongList];
      songListAfterRemovingIndex.splice(currSongIndex, 1);
      dispatch({
        type: REMOVE_CURR_SONG_FROM_TEMP,
        payload: { remainingSongList: [...songListAfterRemovingIndex] },
      });

      let randomIndex;

      if (songListAfterRemovingIndex.length === 0 && state.isRepeat) {
        dispatch({
          type: RENEW_SONG_LIST,
          payload: { renewSongList: state.songList },
        });
        randomIndex = Math.floor(Math.random() * state.songList.length);
        if (
          state.tempSongList[currSongIndex]._id ===
          state.songList[randomIndex]._id
        ) {
          randomIndex = (randomIndex + 1) % state.songList.length;
        }
        dispatch({
          type: ADD_SONG_TO_HISTORY,
          payload: { addSong: state.songList[randomIndex] },
        });
        dispatch({ type: INCREMENT_HISTORY_INDEX });
        dispatch({
          type: SONG_CHANGED,
          payload: state.songList[randomIndex],
        });
      } else if (songListAfterRemovingIndex.length === 0 && !state.isRepeat) {
        audio = document.querySelector("#stereo");
        audio.pause();
        audio.currentTime = 0;
        dispatch({ type: CLEAR_SONG_HISTORY });
        dispatch({ type: RESET_HISTORY_INDEX });
        dispatch({ type: SONG_END });
        dispatch({ type: CLEAR_SONG });
      } else {
        randomIndex = Math.floor(
          Math.random() * songListAfterRemovingIndex.length
        );
        dispatch({
          type: ADD_SONG_TO_HISTORY,
          payload: { addSong: songListAfterRemovingIndex[randomIndex] },
        });
        dispatch({ type: INCREMENT_HISTORY_INDEX });
        dispatch({
          type: SONG_CHANGED,
          payload: songListAfterRemovingIndex[randomIndex],
        });
      }
      // Shuffle is off
    } else if (state.isSet) {
      let currSongIndex = state.songList.findIndex(
        (song) => song.title === state.title
      );
      if (!state.isRepeat && currSongIndex === state.songList.length - 1) {
        audio = document.querySelector("#stereo");
        audio.pause();
        audio.currentTime = 0;
        dispatch({ type: CLEAR_SONG_HISTORY });
        dispatch({ type: RESET_HISTORY_INDEX });
        dispatch({ type: SONG_END });
        dispatch({ type: CLEAR_SONG });
      } else {
        let nextSongIndex = (currSongIndex + 1) % state.songList.length;
        dispatch({
          type: SONG_CHANGED,
          payload: state.songList[nextSongIndex],
        });
        dispatch({
          type: ADD_SONG_TO_HISTORY,
          payload: { addSong: state.songList[nextSongIndex] },
        });
        dispatch({ type: INCREMENT_HISTORY_INDEX });

        audio.play();
      }
    }
  };

  const prevSong = () => {
    if (
      state.isSet &&
      state.playHistoryIndex !== null &&
      state.playHistoryIndex > 0
    ) {
      audio = document.querySelector("#stereo");
      dispatch({
        type: SONG_CHANGED,
        payload: state.playHistory[state.playHistoryIndex - 1],
      });
      // audio.play();
      dispatch({ type: DECREMENT_HISTORY_INDEX });
    }
  };

  // mutes/unmutes volume
  const mute = () => {
    const audio = document.getElementById("stereo");
    if (!state.volumeMute) {
      dispatch({ type: VOLUME_MUTE });
      audio.volume = 0;
    } else {
      dispatch({ type: VOLUME_UNMUTE });
      audio.volume = state.volume;
    }
  };

  const shufflePlaylist = () => {
    if (state.isSet) {
      dispatch({ type: TOGGLE_SHUFFLE });
    }
  };

  const repeatPlaylist = () => {
    if (state.isSet) {
      dispatch({ type: TOGGLE_REPEAT });
    }
  };

  useEffect(() => {
    if (state.isSet) {
      audio = document.querySelector("#stereo");
      const progress = document.querySelector(".curr-time-bar");
      const songCircleProgress = document.querySelector(".song-circle-icon");

      // Create moving progress bar
      const updateProgress = (e) => {
        const { currentTime, duration } = e.target;
        console.log(currentTime, "current time", state.currTime, "state time");

        if (progress && !state.isSeek && !state.progressMouseDown) {
          const progressPercent = (currentTime / duration) * 100;
          progress.style.width = `${progressPercent}%`;
          songCircleProgress.style.left = `${progressPercent - 1}%`;
        }
      };

      audio.addEventListener("timeupdate", updateProgress);
      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
      };
    }
  }, [state.id, state.isSeek]);

  // Progress bar functionality
  useEffect(() => {
    if (state.isSet) {
      audio = document.querySelector("#stereo");
      const progress = document.querySelector(".curr-time-bar");
      const songCircleProgress = document.querySelector(".song-circle-icon");

      // Let the user skip to different parts of the song
      const progressContainer = document.querySelector(".time-bar-container");
      const offsets = progressContainer.getBoundingClientRect();
      let width = progressContainer.clientWidth;
      let duration = audio.duration;
      let clientX;

      const setProgress = (e) => {
        width = progressContainer.clientWidth;
        clientX = e.clientX;
        duration = audio.duration;

        let x;
        if (clientX < offsets.left) {
          x = 0;
        } else if (clientX > offsets.right) {
          x = offsets.right - offsets.left;
        } else {
          x = clientX - offsets.left;
        }

        audio.currentTime = (x / width) * duration;
        dispatch({
          type: CHANGE_TIME,
          payload: { currentTime: audio.currentTime },
        });
      };

      const updateSeekProgress = (e) => {
        if (state.isSeek && state.progressMouseDown) {
          width = progressContainer.clientWidth;
          clientX = e.clientX;
          duration = audio.duration;

          let x;
          if (clientX < offsets.left) {
            x = 0;
          } else if (clientX > offsets.right) {
            x = offsets.right - offsets.left;
          } else {
            x = clientX - offsets.left;
          }

          dispatch({
            type: CHANGE_TIME,
            payload: { currentTime: (x / width) * duration },
          });

          const progressPercent = (x / width) * 100;
          if (progress) {
            progress.style.width = `${progressPercent}%`;
            songCircleProgress.style.left = `${progressPercent - 1}%`;
          }
        }
      };

      const songSeekDown = (e) => {
        dispatch({ type: SET_SEEK_ON });
        dispatch({ type: IS_MOUSEDOWN });
        updateSeekProgress(e);
      };

      const songProgressSeekUp = (e) => {
        if (state.progressMouseDown) {
          width = progressContainer.clientWidth;
          clientX = e.clientX;
          duration = audio.duration;

          let x;
          if (clientX < offsets.left) {
            x = 0;
          } else if (clientX > offsets.right) {
            x = offsets.right - offsets.left;
          } else {
            x = clientX - offsets.left;
          }

          audio.currentTime = (x / width) * duration;
          dispatch({
            type: CHANGE_TIME,
            payload: { currentTime: audio.currentTime },
          });
          dispatch({ type: IS_NOT_MOUSEDOWN });
          dispatch({ type: SET_SEEK_OFF });
        }
      };

      progressContainer.addEventListener("click", setProgress);
      progressContainer.addEventListener("mousedown", songSeekDown);
      document.addEventListener("mouseup", songProgressSeekUp);

      document.addEventListener("mousemove", updateSeekProgress);

      return () => {
        progressContainer.removeEventListener("click", setProgress);
        progressContainer.removeEventListener("mousedown", songSeekDown);
        document.removeEventListener("mouseup", songProgressSeekUp);
        document.removeEventListener("mousemove", updateSeekProgress);
      };
    }
  }, [state, state.progressMouseDown, state.progressMouseUp]);

  // Let the user adjust volume
  useEffect(() => {
    if (state.isSet) {
      const updateProgress = (e) => {
        const progress = document.querySelector(".curr-volume-bar");
        const volumeCircleProgress = document.querySelector(
          ".volume-circle-icon"
        );
        const { volume } = e.target;
        audio.volume = volume;
        const progressPercent = volume * 100;
        progress.style.width = `${progressPercent}%`;
        volumeCircleProgress.style.left = `${progressPercent - 5}%`;
      };
      audio.addEventListener("volumechange", updateProgress);
      return () => {
        audio.removeEventListener("volumechange", updateProgress);
      };
    }
  }, [state.id, state.volume]);

  useEffect(() => {
    const volumeCircleProgress = document.querySelector(".volume-circle-icon");
    const audio = document.getElementById("stereo");
    const volumeContainer = document.querySelector(".volume-bar-container");
    let offsets = volumeContainer.getBoundingClientRect();
    const width = volumeContainer.clientWidth;

    const updateVolumeSeekProgress = (e) => {
      const progress = document.querySelector(".curr-volume-bar");
      const clientX = e.clientX;

      if (state.volumeMouseDown) {
        let x;
        if (clientX < offsets.left) {
          x = 0;
        } else if (clientX > offsets.right) {
          x = offsets.right - offsets.left;
        } else {
          x = clientX - offsets.left;
        }
        if (x / width > 1) {
          audio.volume = 1;
        } else {
          audio.volume = x / width;
        }
        const progressPercent = parseFloat((x / width).toFixed(2)) * 100;
        if (progress) {
          progress.style.width = `${progressPercent}%`;
          volumeCircleProgress.style.left = `${progressPercent - 5}%`;
        }
      }
    };

    const setVolume = (e) => {
      const clientX = e.clientX;

      let x;
      if (clientX < offsets.left) {
        x = 0;
      } else if (clientX > offsets.right) {
        x = offsets.right - offsets.left;
      } else {
        x = clientX - offsets.left;
      }
      if (x / width > 1) {
        audio.volume = 1;
      } else {
        audio.volume = x / width;
      }
      dispatch({ type: ADJUST_VOLUME, payload: { volume: audio.volume } });
    };

    const volumeMousedown = (e) => {
      dispatch({ type: IS_VOLUME_MOUSEDOWN });
      if (state.volumeMouseDown) {
        updateVolumeSeekProgress(e);
      }
    };

    const volumeMouseup = (e) => {
      if (state.volumeMouseDown) {
        setVolume(e);
        dispatch({ type: ADJUST_VOLUME, payload: { volume: audio.volume } });
        dispatch({ type: IS_VOLUME_NOT_MOUSEDOWN });
      }
    };
    volumeContainer.addEventListener("click", setVolume);
    volumeContainer.addEventListener("mousedown", volumeMousedown);
    document.addEventListener("mouseup", volumeMouseup);
    document.addEventListener("mousemove", updateVolumeSeekProgress);
    return () => {
      volumeContainer.removeEventListener("click", setVolume);
      volumeContainer.removeEventListener("mousedown", volumeMousedown);
      document.removeEventListener("mouseup", volumeMouseup);
      document.removeEventListener("mousemove", updateVolumeSeekProgress);
    };
  }, [state.volumeMouseDown]);

  // Change audio file if song changes
  useEffect(() => {
    let audio = document.getElementById("stereo");

    if (state ? state.isSet : false) {
      let split = state.url.split("/");
      audio.src = `https://docs.google.com/uc?export=download&id=${split[5]}`;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [state.url]);

  // Increment time in playbar
  useEffect(() => {
    const id = setTimeout(handleTime, 1000);
    function handleTime() {
      if (state) {
        if (
          state.currTime < state.duration &&
          state.isPlaying &&
          !state.progressMouseDown
        ) {
          console.log(state.currTime, "state time 2");
          dispatch({ type: INCREMENT_TIME });
        } else if (
          state.currTime === state.duration &&
          state.duration !== "0:00"
        ) {
          incrementPlays(state.id);
          return nextSong();
        }
      }
    }

    return () => clearTimeout(id);
  }, [state.currTime, state.isPlaying, state.progressMouseDown]);

  return (
    <div className="playbar-container">
      <audio id="stereo" />
      <div className="song-container">
        <audio id="stereo" />
        <Link to={`/artist/${state.artist}/playlist/${state.playlist}`}>
          <div className="song-picture">
            <img src={state ? state.image : ""} />
          </div>
        </Link>
        <div className="playbar-song-title-and-artist">
          <Link to={`/artist/${state.artist}/playlist/${state.playlist}`}>
            <div className="playbar-song-title">{state ? state.title : ""}</div>
          </Link>
          <Link to={`/artist/${state.artist}`}>
            <div className="playbar-song-artist">
              {state ? state.artist : ""}
            </div>
          </Link>
        </div>
      </div>

      <div className="playbar-function">
        <div className="playbar-actions">
          <IoShuffle
            className={`shuffle-btn ${state.isShuffle ? "shuffle-on" : ""}`}
            onClick={() => shufflePlaylist()}
          />
          <CgPlayTrackPrev className="prev-btn" onClick={() => prevSong()} />
          {state ? (
            state.isPlaying ? (
              <AiFillPauseCircle
                className="play-pause-btn"
                onClick={() => handlePlay()}
              />
            ) : (
              <AiFillPlayCircle
                className="play-pause-btn"
                onClick={() => handlePlay()}
              />
            )
          ) : (
            <AiFillPlayCircle className="play-pause-btn" />
          )}
          <CgPlayTrackNext className="next-btn" onClick={() => nextSong()} />
          <IoRepeat
            className={`repeat-btn ${state.isRepeat ? "repeat-on" : ""}`}
            onClick={() => {
              repeatPlaylist();
            }}
          />
        </div>
        <div className="playbar-duration">
          <div className="curr-time">{state && state.currTime}</div>
          <div className="time-bar-container">
            <div className="song-circle-icon">
              <BsCircleFill />
            </div>
            <div className="curr-time-bar"></div>
            <div className="full-time-bar"></div>
          </div>
          <div className="full-time">{state && state.duration}</div>
        </div>
      </div>

      <div className="playbar-volume">
        <div className="volume-icon" onClick={() => mute()}>
          {state.volumeMute ? <FiVolumeX /> : <FiVolume2 />}
        </div>
        <div className="volume-bar-container">
          <div className="volume-circle-icon">
            <BsCircleFill />
          </div>
          <div className="curr-volume-bar"></div>
          <div className="full-volume-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Playbar;
