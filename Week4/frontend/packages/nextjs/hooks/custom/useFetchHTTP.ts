import { useState, useEffect } from 'react';


const useFetchHTTP = (url: string) => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url)
        if (!response.ok) {
            setError(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.result);
        setLoading(false);

      } catch (error) {        
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchData();

  }, [url]);

  return { data, loading, error };
};

export default useFetchHTTP;