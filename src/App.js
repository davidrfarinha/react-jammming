import React, { useState, useEffect } from "react";
import "./App.css";
import { getSpotifyToken, getUserProfile } from "./spotify";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import Playlist from "./Playlist";

function App() {
    const [tokenObject, setTokenObject] = useState({});
    const token = tokenObject?.access_token;
    const [searchResultsState, setSearchResultsState] = useState([]);
    const [playlistState, setPlaylistState] = useState([]);
    const [userTokenState, setUserTokenState] = useState(null);
    const [userProfileState, setUserProfileState] = useState({});
    const userID = userProfileState?.id ?? null;

    useEffect(() => {
        // Checking for availability of Spotify token in local storage
        const tokenLocalStorage = localStorage.getItem("spotifyToken");
        const tokenCreationDateStorage = localStorage.getItem("tokenCreationDate");
        const tokenCreationDate = new Date(JSON.parse(tokenCreationDateStorage)).toLocaleString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });
        const tokenAgeInSeconds = (Date.now() - JSON.parse(tokenCreationDateStorage)) / 1000;
        const tokenAgeInMinutes = Math.floor(tokenAgeInSeconds / 60);
        const validToken = tokenAgeInSeconds < 3600;
        if (tokenLocalStorage && validToken) {
            console.log(`Token available in local storage and still valid. Created ${tokenAgeInMinutes} min ago (${tokenCreationDate}).`);
            const tokenObject = JSON.parse(tokenLocalStorage);
            setTokenObject(tokenObject);
        } else {
            console.log("Token not available in local storage or already expired. Retrieve process started");
            getSpotifyToken().then((response) => {
                if (response) {
                    localStorage.setItem("tokenCreationDate", JSON.stringify(Date.now()));
                    localStorage.setItem("spotifyToken", JSON.stringify(response));
                    setTokenObject(response);
                } else {
                    alert("Something went wrong. Try reloading the page.")
                }

            });
        }
        // Checking for availability of previous search results in local storage
        const resultsLocalStorage = localStorage.getItem("searchResultsStorage");
        if (resultsLocalStorage) {
            console.log("Search results available in local storage. Component will render with these results.");
            const resultsObject = JSON.parse(resultsLocalStorage);
            setSearchResultsState(resultsObject);
        } else {
            console.log("No search results available in local storage. User has to search for something.");
        }
        // Checking for availability of previous playlist in local storage
        const playlistStorage = localStorage.getItem("playlistStorage");
        if (playlistStorage) {
            console.log("Previous playlist available in local storage. Component will render with this data.");
            const playlistObject = JSON.parse(playlistStorage);
            setPlaylistState(playlistObject);
        } else {
            console.log("No playlist data available in local storage. User has to create new playlist.");
        }
    }, []);
    function handleSearchResults(arrayOfTracks) {
        setSearchResultsState(arrayOfTracks);
        localStorage.setItem("searchResultsStorage", JSON.stringify(arrayOfTracks));
    }

    function handleAddToPlaylist(newItemURI) {
        const itemIndex = searchResultsState.findIndex((item) => item.uri === newItemURI);
        const alreadyAdded = playlistState.some((item) => item.uri === newItemURI);
        if (!alreadyAdded) {
            setPlaylistState((previousPlaylistState) => {
                const newPlaylistState = [searchResultsState[itemIndex], ...previousPlaylistState];
                localStorage.setItem("playlistStorage", JSON.stringify(newPlaylistState));
                return newPlaylistState;
            });
        }
    }
    function handleRemoveFromPlaylist(removedItemURI) {
        setPlaylistState((previousPlaylistState) => {
            const newPlaylistState = previousPlaylistState.filter((item) => item.uri !== removedItemURI);
            localStorage.setItem("playlistStorage", JSON.stringify(newPlaylistState));
            return newPlaylistState;
        });
    }

    function resetPlaylist() {
        setPlaylistState([]);
        localStorage.setItem("playlistStorage", JSON.stringify([]));
    }

    // URL that redirects user to Spotify login page
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    const url = new URL("https://accounts.spotify.com/authorize");
    const state = generateRandomString(16);
    const clientID = process.env.REACT_APP_CLIENT_ID;
    const scope = "user-read-private user-read-email playlist-modify-private playlist-modify-public";
    const parameters = new URLSearchParams({
        response_type: "token",
        client_id: clientID,
        scope: scope,
        redirect_uri: "https://jammming-create-spotify-playlists.netlify.app/",
        state: state,
        show_dialog: true,
    });
    url.search = parameters;


    useEffect(() => {
        const windowURL = new URL(window.location);
        const parametersFromURL = new URLSearchParams(windowURL.hash);
        const userToken = parametersFromURL.get("#access_token");
        if (userToken) {
            setUserTokenState(userToken);
            getUserProfile(userToken).then((response) => {
                setUserProfileState(response);
            });
        }
    }, []);

    return (
        <div className="App">
            <nav>
                <h1>
                    Ja<span>mmm</span>ing
                </h1>
                <a
                    href={url}
                    className="loginLink"
                    title="Login to Spotify account"
                ></a>
            </nav>
            <div className="search-container">
            {token !== undefined && (
                <SearchBar
                    handleSearchResults={handleSearchResults}
                    token={token}
                />
            )}
                {searchResultsState.length > 0 && (
                    <>
                        <SearchResults
                            trackListArray={searchResultsState}
                            handlePlaylistButton={handleAddToPlaylist}
                        />
                        {playlistState.length > 0 && (
                            <Playlist
                                trackListArray={playlistState}
                                handlePlaylistButton={handleRemoveFromPlaylist}
                                resetPlaylist={resetPlaylist}
                                userToken={userTokenState}
                                userID={userID}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
