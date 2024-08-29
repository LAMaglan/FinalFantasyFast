import { useState, useCallback } from 'react';
import { debounce, sampleSize } from 'lodash';

export const useSearch = (data, itemsPerPage) => {
    const [filteredNames, setFilteredNames] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);

    const updateFilteredNames = useCallback(
        debounce(() => {
            const uniqueNames = new Set();
            data.forEach(item => {
                if (
                    (!searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (!selectedFilter || item.game === selectedFilter || item.origin === selectedFilter)
                ) {
                    uniqueNames.add(item.name);
                }
            });
            setFilteredNames(Array.from(uniqueNames));
            setLoading(false);
        }, 300),
        [searchTerm, selectedFilter, data]
    );

    const updateDisplayedItems = useCallback(() => {
        const matchedItems = data.filter(item =>
            (!searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!selectedFilter || item.game === selectedFilter || item.origin === selectedFilter)
        );

        const startIndex = itemsPerPage * (currentPage - 1);
        const paginatedItems = matchedItems.slice(startIndex, startIndex + itemsPerPage);
        setDisplayedItems(paginatedItems);
    }, [searchTerm, selectedFilter, currentPage, data, itemsPerPage]);

    const displayRandomItems = () => {
        const filteredItems = data.filter(item =>
            (!selectedFilter || item.game === selectedFilter || item.origin === selectedFilter)
        );
        const randomItems = sampleSize(filteredItems, itemsPerPage);
        setDisplayedItems(randomItems);
        setSearchTerm('');
        setShowDropdown(false);
        setCurrentPage(1);
    };

    return {
        displayedItems,
        filteredNames,
        searchTerm,
        selectedFilter,
        showDropdown,
        loading,
        currentPage,
        totalItems: data.length,
        setSearchTerm,
        setSelectedFilter,
        setShowDropdown,
        setCurrentPage,
        displayRandomItems,
        updateFilteredNames,
        updateDisplayedItems
    };
};
