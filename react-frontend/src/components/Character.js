import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const Character = () => {
    const [characters, setCharacters] = useState(null);

    useEffect(() => {
        axios.get(`${config.API_URL}/stored-characters`)
            .then(response => {
                setCharacters(response.data);
            })
            .catch(error => console.error("There was an error fetching the characters!", error));
    }, []);

    if (!characters) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {characters.map(character => (
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
            ))}
        </div>
    );
};

export default Character;