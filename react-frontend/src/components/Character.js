import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { origins } from '../constants';

const Character = () => {
    const [characters, setCharacters] = useState([]);
    const [characterName, setCharacterName] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (characterName || selectedOrigin) {
            setLoading(true);
            axios.get(`${config.API_URL}/characters`, { 
                params: { 
                    name: characterName,
                    origin: selectedOrigin
                } 
            })
            .then(response => {
                setCharacters(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the characters!", error);
                setLoading(false);
 });
        } else {
            // Reset the displayed characters when no filter is empty
            setCharacters([]);  
        }
    }, [characterName, selectedOrigin]);

    const handleInputChange = (e) => {
        setCharacterName(e.target.value);
    }

    const handleOriginChange = (e) => {
        setSelectedOrigin(e.target.value);
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter character name"
                value={characterName}
                onChange={handleInputChange}
            />
            <select value={selectedOrigin} onChange={handleOriginChange}>
                <option value="">All Games</option>
                {origins.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                ))}
            </select>
            {loading && <div>Loading...</div>}
            {characters.length > 0 ? (
                characters.map(character => (
                    <div key={character.characterId}>
                        <h1>{character.name}</h1>
                        <p>Japanese Name: {character.japaneseName || 'N/A'}</p>
                        <p>Age: {character.age}</p>
                        <p>Gender: {character.gender}</p>
                        <p>Race: {character.race}</p>
                        <p>Job: {character.job}</p>
                        <p>Height: {character.height}</p>
                        <p>Weight: {character.weight}</p>
                        <p>Origin: {character.origin}</p>
                        <p>Description: {character.description || 'N/A'}</p>
                        {character.pictures && character.pictures.length > 0 && (
                            <img src={character.pictures[0].url} alt={character.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                        )}
                    </div>
                ))
            ) : (
                (characterName || selectedOrigin) && !loading && <p>No characters found</p>
            )}
        </div>
    );
};

export default Character;