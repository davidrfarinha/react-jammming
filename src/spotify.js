async function getSpotifyToken() {
    console.log("Token fetched!")
    const clientID = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    const url = "https://accounts.spotify.com/api/token";
    const authOptions = {
        method: "POST",
        headers: {
            Authorization: "Basic " + btoa(`${clientID}:${clientSecret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    };
    try {
        const response = await fetch(url, authOptions);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const token = await response.json();
        return token;
    } catch (error) {
        console.error(error);
    }
}


async function searchTracks(token, searchKeyword, searchLimit) {
    const url = new URL("https://api.spotify.com/v1/search");
    const parameters = new URLSearchParams({
        q: searchKeyword,
        type: "track",
        limit: searchLimit,
    });
    url.search = parameters;

    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const searchResults = await response.json();
        const arrayTracks = searchResults.tracks.items;
        console.log(arrayTracks);
        // arrayTracks.forEach(track => {
        //     console.log(`Track Name: ${track.name} - Artist: ${track.artists[0].name} - Album: ${track.album.name} - uri code: ${track.uri}`)
        // });
        // console.log("----------------------------------------------------------------")
        return arrayTracks;
    } catch (error) {
        console.error(error);
    }
}

async function getUserProfile(userToken) {
    const url = new URL("https://api.spotify.com/v1/me");
    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + userToken,
        },
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const userProfile = await response.json();
        return userProfile;
    } catch (error) {
        console.log(error);
    }
}

async function createPlaylist(userID, userToken, playlistName) {
    const url = new URL(`https://api.spotify.com/v1/users/${userID}/playlists`);
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: playlistName,
        }),
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error while creating new playlist: ${response.status}: ${response.statusText}`);
        }
        const playlistResponse = await response.json();
        return playlistResponse;
    } catch (error) {
        console.log(error);
    }
}

async function addTracksToPlaylist(arrayOfUris, playlistID, userToken) {
    const url = new URL(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`);
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: arrayOfUris }),
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error while adding tracks to newly created playlist: ${response.status}: ${response.statusText}.`);
        }
        const tracksResponse = await response.json();
        return tracksResponse;
    } catch (error) {
        console.log(error);
    }
}

export { getSpotifyToken, searchTracks, getUserProfile, createPlaylist, addTracksToPlaylist };
