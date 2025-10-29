import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import apartmentsAPI from '../../api/apartments';
import ApartmentCard from '../../components/apartment/ApartmentCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';

const MyUnits = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, per_page: 12, total: 0, pages: 0 });
  const [filter, setFilter] = useState('all');
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApartments();
  }, [pagination.page, filter]);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        status: filter !== 'all' ? filter : undefined
      };
      const response = await apartmentsAPI.getApartments(params);
      setApartments(response.apartments);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Gagal memuat data unit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apartmentsAPI.deleteApartment(selectedApartment.id);
      toast.success('Unit berhasil dihapus');
      setShowDeleteModal(false);
      fetchApartments();
    } catch (error) {
      toast.error('Gagal menghapus unit');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && apartments.length === 0) return <Loading fullScreen text="Memuat unit..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Unit Saya</h1>
        <Button onClick={() => toast.info('Fitur tambah unit akan segera tersedia')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Unit
        </Button>
      </div>

      <div className="flex space-x-2">
        {['all', 'available', 'occupied'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'available' ? 'Tersedia' : 'Terisi'}
          </button>
        ))}
      </div>

      {apartments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apartment) => (
              <div key={apartment.id} className="relative">
                <ApartmentCard apartment={apartment} showFavorite={false} />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/apartments/${apartment.id}`)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <EyeIcon className="h-5 w-5 text-purple-600" />
                  </button>
                  <button
                    onClick={() => toast.info('Fitur edit akan segera tersedia')}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <PencilIcon className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedApartment(apartment);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <TrashIcon className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg">
          <BuildingOfficeIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Belum ada unit</p>
          <Button onClick={() => toast.info('Fitur tambah unit akan segera tersedia')}>
            Tambah Unit Pertama
          </Button>
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Unit"
      >
        <p className="mb-4">
          Apakah Anda yakin ingin menghapus unit <strong>{selectedApartment?.unit_number}</strong>?
        </p>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} fullWidth>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} fullWidth>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyUnits;