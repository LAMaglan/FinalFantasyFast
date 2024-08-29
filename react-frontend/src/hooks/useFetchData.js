import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                console.error("There was an error fetching data!", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [url]);

    return { data, loading };
};
