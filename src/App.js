import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import React, { useState, useEffect, useReducer, createContext } from "react";
import LoginPage from "./components/login-page";
import MainPage from "./components/main-page";
import HomePage from "./components/home-page";
import ArtistPage from "./components/artist-page";
import FavoritesPage from "./components/favorites-page";
import SearchPage from "./components/search-page";
import RegisterPage from "./components/register-page";
import PlaylistPage from "./components/playlist-page";
import playbarReducer from "./reducers/playbarReducer";
import fetchFavorites from "./fetch-data/fetchFavorites";
import fetchArtists from "./fetch-data/fetchArtists";
import fetchSingleArtist from "./fetch-data/fetchSingleArtist";
import fetchArtistPlaylists from "./fetch-data/fetchArtistPlaylists";
import fetchAllPlaylists from "./fetch-data/fetchAllPlaylists";
import fetchAllSongs from "./fetch-data/fetchAllSongs";
import checkJwtToken from "./fetch-data/checkJwtToken";
import Playbar from "./components/playbar";

const initialState = {
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
  volume: 1,
  songList: [],
  isShuffle: false,
  isRepeat: false,
  tempSongList: [],
  playHistory: [],
  playHistoryIndex: null,
  isSeek: false,
  progressMouseDown: false,
  volumeMouseDown: false,
  volumeMute: false,
};

const Application = createContext();

function App() {
  const [state, dispatch] = useReducer(playbarReducer, initialState);
  const [showPlaybar, setShowPlaybar] = useState(false);

  // Register and login states
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // User info from successful login or error if unsuccessful
  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("user")));
  }, [localStorage.getItem("user")]);

  return (
    <Application.Provider
      value={{
        state,
        dispatch,
        userInfo,
        fetchFavorites,
        fetchArtists,
        fetchSingleArtist,
        fetchArtistPlaylists,
        fetchAllPlaylists,
        fetchAllSongs,
        checkJwtToken,
        setShowPlaybar,
      }}
    >
      <Router>
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/login">
            {loginSuccess ? (
              <Redirect to="/home" />
            ) : (
              <LoginPage
                setLoginSuccess={setLoginSuccess}
                setError={setError}
                error={error}
              />
            )}
          </Route>
          <Route path="/register">
            {registerSuccess ? (
              <Redirect to="/login" />
            ) : (
              <RegisterPage setRegisterSuccess={setRegisterSuccess} />
            )}
          </Route>
          <Route path="/home" component={HomePage} />
          <Route exact path="/artist">
            <ArtistPage />
          </Route>
          <Route path="/favorites">
            <FavoritesPage />
          </Route>
          <Route path="/search">
            <SearchPage />
          </Route>

          <Route exact path="/artist/:name" children={<ArtistPage />}></Route>
          <Route
            path="/artist/:name/playlist/:title"
            children={<PlaylistPage />}
          ></Route>
        </Switch>

        {showPlaybar ? <Playbar /> : null}
      </Router>
    </Application.Provider>
  );
}

export { App, Application };
