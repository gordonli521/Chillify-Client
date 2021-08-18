import {
  SONG_CHANGED,
  PREV_SONG,
  NEXT_SONG,
  SET_IMAGE,
  INCREMENT_TIME,
  SONG_END,
  SONG_PAUSED,
  SONG_PLAYED,
  CLEAR_SONG,
  CHANGE_TIME,
  ADJUST_VOLUME,
  CHANGE_LIST,
  TOGGLE_SHUFFLE,
  TOGGLE_REPEAT,
  REMOVE_CURR_SONG_FROM_TEMP,
  RENEW_SONG_LIST,
  ADD_SONG_TO_HISTORY,
  CLEAR_SONG_HISTORY,
  INCREMENT_HISTORY_INDEX,
  DECREMENT_HISTORY_INDEX,
  RESET_HISTORY_INDEX,
  SET_HISTORY_INDEX,
  SET_SEEK_ON,
  SET_SEEK_OFF,
  IS_MOUSEDOWN,
  IS_NOT_MOUSEDOWN,
  IS_VOLUME_MOUSEDOWN,
  IS_VOLUME_NOT_MOUSEDOWN,
  VOLUME_MUTE,
  VOLUME_UNMUTE,
} from "../actions/types";

// Change time from string to an integer
const increment = (time) => {
  let arrTime = time.split(":");
  let minutes = parseInt(arrTime[0], 10);
  let seconds = parseInt(arrTime[1], 10) + 1;
  if (seconds % 60 === 0) {
    seconds = "00";
    minutes += 1;
  } else if (seconds % 60 < 10) {
    seconds = `0${seconds % 60}`;
  } else {
    seconds = `${seconds % 60}`;
  }
  return `${minutes}:${seconds}`;
};

// Changes time from integer to a string
const convertIntToStr = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

const playbarReducer = (state, action) => {
  switch (action.type) {
    case SONG_PLAYED:
      return {
        ...state,
        isPlaying: true,
      };
    case SONG_PAUSED:
      return {
        ...state,
        isPlaying: false,
      };
    case SONG_CHANGED:
    case PREV_SONG:
    case NEXT_SONG:
      return {
        ...state,
        id: action.payload._id,
        artist: action.payload.artist,
        playlist: action.payload.playlist,
        title: action.payload.title,
        url: action.payload.url,
        currTime: "0:00",
        duration: action.payload.duration,
        isSet: true,
        isPlaying: true,
      };
    case SET_IMAGE:
      return {
        ...state,
        image: action.payload.image,
      };
    case INCREMENT_TIME:
      return {
        ...state,
        currTime: increment(state.currTime),
      };
    case SONG_END:
      return {
        ...state,
        currTime: "0:00",
        duration: "0:00",
        isPlaying: false,
      };
    case CLEAR_SONG:
      return {
        ...state,
        id: "",
        artist: "",
        playlist: "",
        title: "",
        url: "",
        duration: "0:00",
        isPlaying: false,
        isSet: false,
        image: "",
        currTime: "0:00",
        songList: [],
        tempSongList: [],
        isShuffle: false,
        isRepeat: false,
        volume: 1,
        playHistory: [],
        playHistoryIndex: null,
      };
    case CHANGE_TIME:
      return {
        ...state,
        currTime: convertIntToStr(action.payload.currentTime),
      };
    case ADJUST_VOLUME:
      return {
        ...state,
        volume: action.payload.volume,
      };
    case CHANGE_LIST:
      return {
        ...state,
        songList: action.payload.songs,
        tempSongList: action.payload.songs,
      };
    case TOGGLE_SHUFFLE:
      return {
        ...state,
        isShuffle: !state.isShuffle,
      };
    case TOGGLE_REPEAT:
      return {
        ...state,
        isRepeat: !state.isRepeat,
      };
    case REMOVE_CURR_SONG_FROM_TEMP:
      return {
        ...state,
        tempSongList: action.payload.remainingSongList,
      };
    case RENEW_SONG_LIST:
      return {
        ...state,
        tempSongList: [...action.payload.renewSongList],
      };
    case ADD_SONG_TO_HISTORY:
      return {
        ...state,
        playHistory: [...state.playHistory, action.payload.addSong],
      };
    case CLEAR_SONG_HISTORY:
      return {
        ...state,
        playHistory: [],
      };
    case INCREMENT_HISTORY_INDEX:
      return {
        ...state,
        playHistoryIndex: state.playHistoryIndex + 1,
      };
    case DECREMENT_HISTORY_INDEX:
      return {
        ...state,
        playHistoryIndex: state.playHistoryIndex - 1,
      };
    case RESET_HISTORY_INDEX:
      return {
        ...state,
        playHistoryIndex: null,
      };
    case SET_HISTORY_INDEX:
      return {
        ...state,
        playHistoryIndex: 0,
      };
    case SET_SEEK_ON:
      return {
        ...state,
        isSeek: true,
      };
    case SET_SEEK_OFF:
      return {
        ...state,
        isSeek: false,
      };
    case IS_MOUSEDOWN:
      return {
        ...state,
        progressMouseDown: true,
      };
    case IS_NOT_MOUSEDOWN:
      return {
        ...state,
        progressMouseDown: false,
      };
    case IS_VOLUME_MOUSEDOWN:
      return {
        ...state,
        volumeMouseDown: true,
      };
    case IS_VOLUME_NOT_MOUSEDOWN:
      return {
        ...state,
        volumeMouseDown: false,
      };
    case VOLUME_MUTE:
      return {
        ...state,
        volumeMute: true,
      };
    case VOLUME_UNMUTE:
      return {
        ...state,
        volumeMute: false,
      };
    default:
      return state;
  }
};

export default playbarReducer;
