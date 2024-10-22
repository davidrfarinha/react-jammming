import React from "react";
import { useState } from "react";
export default function Track({ uri, imageURL, name, artist, album, preview_url, type, handlePlaylistButton }) {
    const buttonSetup = {
        class: type === "searchResults" ? "add" : "remove",
        title: type === "searchResults" ? "Add to playlist" : "Remove from Playlist",
    };
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    const audioPlayer = preview_url ? (
        <audio
            controls
            className="audio"
        >
            <source
                src={preview_url}
                type="audio/mpeg"
            ></source>
        </audio>
    ) : (
        <div className="audio noPlayer">
            <p>No playback preview available</p>
        </div>
    );

    return (
        <li
            id={uri}
            className="track"
        >
            <img src={imageURL} alt="Album art"></img>
            <div className="track-info">
                <span
                    title="Track Name"
                    className="track-name"
                >
                    {name}
                </span>
                <span title="Artist name">{artist}</span> - <span title="Album name">{album}</span>
            </div>
            {type === "searchResults" && (
                <button
                    className="playback-button"
                    title="Playback preview"
                    onMouseEnter={() => {
                        setShowAudioPlayer(true);
                    }}
                    onMouseLeave={() => setShowAudioPlayer(false)}
                >
                    {showAudioPlayer && audioPlayer}
                </button>
            )}
            <button
                className={`tracklist-button ${buttonSetup.class}`}
                title={buttonSetup.title}
                onClick={() => handlePlaylistButton(uri)}
            ></button>
        </li>
    );
}
