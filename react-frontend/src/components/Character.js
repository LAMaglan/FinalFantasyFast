import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const Character = () => {
    const [characters, setCharacters] = useState([]);
    const [characterName, setCharacterName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (characterName) {
            setLoading(true);
            axios.get(`${config.API_URL}/characters`, { params: { name: characterName } })
                .then(response => {
                    setCharacters(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("There was an error fetching the characters!", error);
                    setLoading(false);
                });
        } else {
            // Reset the displayed characters when the input is empty
            setCharacters([]);  
        }
    }, [characterName]);

    const handleInputChange = (e) => {
        setCharacterName(e.target.value);
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter character name"
                value={characterName}
                onChange={handleInputChange}
            />
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
                characterName && !loading && <p>No characters found</p>
            )}
        </div>
    );
};

export default Character;
