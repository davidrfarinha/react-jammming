import React from "react";
import Tracklist from "./Tracklist";

export default function SearchResults({ trackListArray, handlePlaylistButton }) {
    console.log(trackListArray);
    return (
        <div className="search-results">
            <h2>Search results</h2>
            <Tracklist
                trackListArray={trackListArray}
                handlePlaylistButton={handlePlaylistButton}
                cssClass="search-results-list"
                type="searchResults"
            />
        </div>
    );
}
