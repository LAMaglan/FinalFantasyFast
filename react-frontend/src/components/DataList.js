import React from 'react';

const DataList = ({ items, onNextPage, onPreviousPage, currentPage, totalPages, itemsPerPage }) => (
    <>
        {items.length > 0 ? (
            <>
                {items.map(item => (
                    <div key={item.id || item.characterId || item.monsterId}>
                        <h1>{item.name}</h1>
                        <img
                            src={item.picture || (item.pictures && item.pictures[0] && item.pictures[0].url)}
                            alt={item.name}
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                        {item.japaneseName && <p>Japanese Name: {item.japaneseName}</p>}
                        {item.age && <p>Age: {item.age}</p>}
                        {item.gender && <p>Gender: {item.gender}</p>}
                        {item.race && <p>Race: {item.race}</p>}
                        {item.job && <p>Job: {item.job}</p>}
                        {item.height && <p>Height: {item.height}</p>}
                        {item.weight && <p>Weight: {item.weight}</p>}
                        {item.origin && <p>Origin: {item.origin}</p>}
                        {item.description && <p>Description: {item.description}</p>}
                        {item.elementalAffinity && <p>Elemental Affinity: {item.elementalAffinity}</p>}
                        {item.elementalWeakness && <p>Elemental Weakness: {item.elementalWeakness}</p>}
                        {item.hitPoints && <p>Hit Points: {item.hitPoints}</p>}
                        {item.manaPoints && <p>Mana Points: {item.manaPoints}</p>}
                        {item.attack && <p>Attack: {item.attack}</p>}
                        {item.defense && <p>Defense: {item.defense}</p>}
                        {item.game && <p>Game: {item.game}</p>}
                    </div>
                ))}
                <div className="pagination-buttons">
                    {currentPage > 1 && (
                        <button onClick={onPreviousPage}>Previous {itemsPerPage}</button>
                    )}
                    {currentPage < totalPages && (
                        <button onClick={onNextPage}>Next {itemsPerPage}</button>
                    )}
                </div>
            </>
        ) : (
            <p>No items found</p>
        )}
    </>
);

export default DataList;