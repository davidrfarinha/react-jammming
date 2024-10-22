import React from "react";
import { useState } from "react";
import { searchTracks } from "./spotify";

export default function SearchBar({ handleSearchResults, token }) {
    const [formData, setFormData] = useState({ searchKeyword: "", searchLimit: "10" });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [name]: value,
            };
        });
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (formData.searchKeyword) {
            searchTracks(token, formData.searchKeyword, formData.searchLimit).then((response) => {
                handleSearchResults(response);
                setFormData({ searchKeyword: "", searchLimit: "10" })
            });
        } else {
            alert("Type something in the search bar.");
        }
    };

    return (
        <form
            className="Search-bar"
            onSubmit={handleSearch}
        >
            <label
                htmlFor="searchKeyword"
                className="search-input-label"
            >
                Search for:
            </label>
            <input
                type="text"
                name="searchKeyword"
                value={formData.searchKeyword}
                onChange={handleChange}
            ></input>
            <input
                type="range"
                name="searchLimit"
                value={formData.searchLimit}
                onChange={handleChange}
                min="1"
                max="50"
                className="search-range-limit"
            ></input>
            <span>Show {formData.searchLimit} results</span>
            <button className="blue-button">Search</button>
        </form>
    );
}
