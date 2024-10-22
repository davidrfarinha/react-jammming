import React from "react";
import Track from "./Track";

export default function Tracklist(props) {
    const { trackListArray, handlePlaylistButton, cssClass, type } = props;
    const playlistArray = trackListArray.map((item) => {
        const { uri, name, preview_url } = item;
        const artist = item.artists[0].name;
        const album = item.album.name;
        const imageURL = item.album.images[2].url;
        return (
            <Track
                key={uri}
                uri={uri}
                imageURL={imageURL}
                name={name}
                artist={artist}
                album={album}
                preview_url={preview_url}
                type={type}
                handlePlaylistButton={handlePlaylistButton}
            />
        );
    });
    return <ul className={cssClass}> {playlistArray}</ul>;
}
