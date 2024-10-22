import React from "react";
import { useState, useEffect } from "react";
import Tracklist from "./Tracklist";
import { createPlaylist, addTracksToPlaylist } from "./spotify";

export default function Playlist(props) {
    const { trackListArray, handlePlaylistButton, userToken, userID, resetPlaylist } = props;

    const [playlistName, setPlaylistName] = useState("Name your Jammm playlist");

    const handleChange = (event) => {
        setPlaylistName(event.target.value);
        localStorage.setItem("playlistNameStorage", JSON.stringify(event.target.value));
    };

    useEffect(() => {
        console.log("Effect ran!");
        const playlistNameStorage = localStorage.getItem("playlistNameStorage");
        if (playlistNameStorage) {
            const playlistNameObject = JSON.parse(playlistNameStorage);
            setPlaylistName(playlistNameObject);
        }
    }, []);

    const arrayOfUris = trackListArray.map((item) => item.uri.toString());
    const handleSubmit = (event) => {
        event.preventDefault();
        if (userToken && userID) {
            if (trackListArray.length > 0) {
                if (playlistName.length > 0) {
                    createPlaylist(userID, userToken, playlistName).then((response) => {
                        console.log(response);
                        if (response) {
                            const newPlaylistID = response.id;
                            addTracksToPlaylist(arrayOfUris, newPlaylistID, userToken);
                            resetPlaylist();
                            setPlaylistName("Name your Jammm playlist");
                            localStorage.removeItem("playlistNameStorage");
                            alert("Playlist successfully added! You can now check it in your spotify account.");
                        } else {
                            alert("Unable to create new playlist. Try logging in to spotify account and try again.");
                        }
                    });
                } else {
                    alert("You have to type a name for the new playlist!");
                }
            } else {
                alert("You need to add tracks in order to create a new playlist!");
            }
        } else {
            alert("You have to login to Spotify in order to save a new playlist!");
        }
    };

    return (
        <div className="playlist">
            <h2>Playlist</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="playlist-name"
                    type="text"
                    value={playlistName}
                    onChange={handleChange}
                ></input>
                <button className="blue-button">Save to Spotify</button>
            </form>
            <Tracklist
                trackListArray={trackListArray}
                handlePlaylistButton={handlePlaylistButton}
                cssClass="playlist-list"
                type="playlist"
            />
        </div>
    );
}
