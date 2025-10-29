import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apartmentsAPI from '../api/apartments';

const useApartments = (filters = {}) => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  const fetchApartments = async (customFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        ...customFilters,
        page: pagination.page,
        per_page: pagination.per_page
      };
      
      const response = await apartmentsAPI.getApartments(params);
      setApartments(response.apartments);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal memuat apartemen';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [pagination.page]);

  return {
    apartments,
    loading,
    error,
    pagination,
    fetchApartments,
    setPage: (page) => setPagination(prev => ({ ...prev, page }))
  };
};

export default useApartments;