import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { debounce } from 'lodash';

const Character = () => {
    const [allCharacters, setAllCharacters] = useState([]);
    const [filteredCharacterNames, setFilteredCharacterNames] = useState([]);
    const [displayedCharacters, setDisplayedCharacters] = useState([]);
    const [characterName, setCharacterName] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [origins, setOrigins] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchAllCharacters();
        fetchOrigins();
    }, []);

    const fetchAllCharacters = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/stored-characters`);
            setAllCharacters(response.data);
            // Initialize displayed characters with the first page characters
            setDisplayedCharacters(response.data.slice(0, itemsPerPage));
        } catch (error) {
            console.error("There was an error fetching all characters!", error);
        }
    };

    const fetchOrigins = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/characters/origins`);
            setOrigins(response.data);
        } catch (error) {
            console.error("There was an error fetching origins!", error);
        }
    };

    const updateFilteredCharacterNames = useCallback(
        debounce(() => {
            let uniqueNames = new Set();
            allCharacters.forEach(character => {
                if (
                    (!characterName || character.name.toLowerCase().includes(characterName.toLowerCase())) &&
                    (!selectedOrigin || character.origin === selectedOrigin)
                ) {
                    uniqueNames.add(character.name);
                }
            });
            setFilteredCharacterNames(Array.from(uniqueNames));
            setLoading(false);
        }, 300),
        [characterName, selectedOrigin, allCharacters]
    );

    const updateDisplayedCharacters = useCallback(() => {
        const matchedCharacters = allCharacters.filter(character =>
            (!characterName || character.name.toLowerCase().includes(characterName.toLowerCase())) &&
            (!selectedOrigin || character.origin === selectedOrigin)
        );

        // Slice based on pagination
        const startIndex = itemsPerPage * (currentPage - 1);
        const paginatedCharacters = matchedCharacters.slice(startIndex, startIndex + itemsPerPage);

        setDisplayedCharacters(paginatedCharacters);
    }, [characterName, selectedOrigin, currentPage, allCharacters]);

    useEffect(() => {
        setLoading(true);
        updateFilteredCharacterNames();
    }, [characterName, selectedOrigin, updateFilteredCharacterNames]);

    useEffect(() => {
        updateDisplayedCharacters();
    }, [currentPage, updateDisplayedCharacters]);

    const handleInputChange = (e) => {
        setCharacterName(e.target.value);
        setShowDropdown(true);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleOriginChange = (e) => {
        setSelectedOrigin(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleInputFocus = () => {
        setShowDropdown(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => setShowDropdown(false), 200);
    };

    const handleCharacterSelect = (name) => {
        setCharacterName(name);
        setShowDropdown(false);
    };

    const loadPreviousCharacters = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const loadNextCharacters = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const matchedCharacters = allCharacters.filter(character =>
        (!characterName || character.name.toLowerCase().includes(characterName.toLowerCase())) &&
        (!selectedOrigin || character.origin === selectedOrigin)
    );

    const totalPages = Math.ceil(matchedCharacters.length / itemsPerPage);

    return (
        <div className="character-container">
            <input
                type="text"
                placeholder="Enter character name"
                value={characterName}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="character-input"
            />
            <select value={selectedOrigin} onChange={handleOriginChange}>
                <option value="">All Origins</option>
                {origins.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                ))}
            </select>
            {loading && <div>Loading...</div>}
            {showDropdown && filteredCharacterNames.length > 0 && (
                <div className="dropdown">
                    {filteredCharacterNames.map(name => (
                        <div key={name} onMouseDown={() => handleCharacterSelect(name)} className="dropdown-option">
                            {name}
                        </div>
                    ))}
                </div>
            )}
            {displayedCharacters.length > 0 ? (
                <>
                    {displayedCharacters.map(character => (
                        <div key={character.characterId}>
                            <h1>{character.name}</h1>
                            {(character.picture || (character.pictures && character.pictures[0] && character.pictures[0].url)) && (
                                <img 
                                    src={character.picture || character.pictures[0].url} 
                                    alt={character.name} 
                                    style={{ maxWidth: '200px', maxHeight: '200px' }} 
                                />
                            )}
                            <p>Japanese Name: {character.japaneseName || 'N/A'}</p>
                            <p>Age: {character.age}</p>
                            <p>Gender: {character.gender}</p>
                            <p>Race: {character.race}</p>
                            <p>Job: {character.job}</p>
                            <p>Height: {character.height}</p>
                            <p>Weight: {character.weight}</p>
                            <p>Origin: {character.origin}</p>
                            <p>Description: {character.description || 'N/A'}</p>
                        </div>
                    ))}
                    <div className="pagination-buttons">
                        {currentPage > 1 && (
                            <button onClick={loadPreviousCharacters}>Previous 5</button>
                        )}
                        {currentPage < totalPages && (
                            <button onClick={loadNextCharacters}>Next 5</button>
                        )}
                    </div>
                </>
            ) : (
                (characterName || selectedOrigin) && !loading && <p>No characters found</p>
            )}
        </div>
    );
};

export default Character;