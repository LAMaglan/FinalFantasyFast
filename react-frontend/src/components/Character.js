import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { debounce } from 'lodash';

const Character = () => {
    const [allCharacters, setAllCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [displayedCharacters, setDisplayedCharacters] = useState([]);
    const [characterName, setCharacterName] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [origins, setOrigins] = useState([]);

    useEffect(() => {
        fetchAllCharacters();
        fetchOrigins();
    }, []);

    const fetchAllCharacters = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/stored-characters`);
            setAllCharacters(response.data);
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

    const updateFilteredCharacters = useCallback(
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
            setFilteredCharacters(Array.from(uniqueNames));
            setLoading(false);
        }, 300),
        [characterName, selectedOrigin, allCharacters]
    );

    useEffect(() => {
        setLoading(true);
        updateFilteredCharacters();
    }, [characterName, selectedOrigin, updateFilteredCharacters]);

    const handleInputChange = (e) => {
        setCharacterName(e.target.value);
        setShowDropdown(true);
    };

    const handleOriginChange = (e) => {
        setSelectedOrigin(e.target.value);
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
        const matchedCharacters = allCharacters.filter(character => character.name === name);
        setDisplayedCharacters(matchedCharacters);
    };

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
            {showDropdown && filteredCharacters.length > 0 && (
                <div className="dropdown">
                    {filteredCharacters.map(name => (
                        <div key={name} onMouseDown={() => handleCharacterSelect(name)} className="dropdown-option">
                            {name}
                        </div>
                    ))}
                </div>
            )}
            {displayedCharacters.length > 0 ? (
                displayedCharacters.map(character => (
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
                ))
            ) : (
                (characterName || selectedOrigin) && !loading && <p>No characters found</p>
            )}
        </div>
    );
};

export default Character;