import React, { useEffect } from 'react';
import config from '../config';
import { useFetchData } from '../hooks/useFetchData';
import { useSearch } from '../hooks/useSearch';
import DataList from './DataList';

const Monster = () => {
    const { data: allMonsters, loading: monstersLoading } = useFetchData(`${config.API_URL}/stored-monsters`);
    const { data: games = [] } = useFetchData(`${config.API_URL}/monsters/games`);

    const {
        displayedItems,
        filteredNames,
        searchTerm,
        selectedFilter,
        showDropdown,
        loading,
        currentPage,
        setSearchTerm,
        setSelectedFilter,
        setShowDropdown,
        setCurrentPage,
        displayRandomItems,
        updateFilteredNames,
        updateDisplayedItems
    } = useSearch(allMonsters, 5);

    useEffect(() => {
        updateFilteredNames();
    }, [searchTerm, selectedFilter, updateFilteredNames]);

    useEffect(() => {
        updateDisplayedItems();
    }, [currentPage, updateDisplayedItems]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setShowDropdown(true);
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleInputFocus = () => {
        setShowDropdown(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => setShowDropdown(false), 200);
    };

    return (
        <div className="container">
            <input
                type="text"
                placeholder="Enter monster name"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="input"
            />
            <select value={selectedFilter} onChange={handleFilterChange} className="input">
                <option value="">All Games</option>
                {games.map(game => (
                    <option key={game} value={game}>{game}</option>
                ))}
            </select>
            <button onClick={displayRandomItems} className="input">Show Random 5 Monsters</button>
            {loading && <div>Loading...</div>}
            {showDropdown && filteredNames.length > 0 && (
                <div className="dropdown">
                    {filteredNames.map(name => (
                        <div key={name} onMouseDown={() => setSearchTerm(name)} className="dropdown-option">
                            {name}
                        </div>
                    ))}
                </div>
            )}
            <DataList
                items={displayedItems}
                onNextPage={() => setCurrentPage(prevPage => prevPage + 1)}
                onPreviousPage={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                currentPage={currentPage}
                totalPages={Math.ceil(allMonsters.length / 5)}
                itemsPerPage={5}  // Add this line
            />
        </div>
    );
};

export default Monster;