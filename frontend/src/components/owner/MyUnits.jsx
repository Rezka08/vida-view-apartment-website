import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, EyeIcon, BuildingOfficeIcon, ArchiveBoxIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import apartmentsAPI from '../../api/apartments';
import ApartmentCard from '../../components/apartment/ApartmentCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import AddUnitModal from '../../components/owner/AddUnitModal';
import EditUnitModal from '../../components/owner/EditUnitModal';
import axios from '../../api/axios';

const MyUnits = () => {
    const navigate = useNavigate();
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, per_page: 12, total: 0, pages: 0 });
    const [filter, setFilter] = useState('all');
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [actionType, setActionType] = useState('archive'); // 'delete' or 'archive'
    const [hasBookings, setHasBookings] = useState(false);
    const [checkingBookings, setCheckingBookings] = useState(false);

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
        const response = await apartmentsAPI.getMyUnits(params);
        setApartments(response.apartments);
        setPagination(response.pagination);
    } catch (error) {
        toast.error('Gagal memuat data unit');
    } finally {
        setLoading(false);
    }
    };

    const checkApartmentBookings = async (apartmentId) => {
    setCheckingBookings(true);
    try {
        const response = await axios.get(`/apartments/${apartmentId}/has-bookings`);
        return response.data.has_bookings;
    } catch (error) {
        console.error('Error checking bookings:', error);
        return false;
    } finally {
        setCheckingBookings(false);
    }
    };

    const handleDeleteClick = async (apartment) => {
    setSelectedApartment(apartment);
    const hasBooking = await checkApartmentBookings(apartment.id);
    setHasBookings(hasBooking);

    // If has bookings, force archive mode
    if (hasBooking) {
        setActionType('archive');
    } else {
      // If no bookings, allow delete
        setActionType('delete');
    }

    setShowDeleteModal(true);
    };

    const handleArchiveClick = (apartment) => {
    setSelectedApartment(apartment);
    setActionType('archive');
    setHasBookings(false);
    setShowDeleteModal(true);
    };

    const handleConfirmAction = async () => {
    setDeleting(true);
    try {
        const action = actionType === 'delete' ? 'delete' : 'archive';
        await axios.delete(`/apartments/${selectedApartment.id}?action=${action}`);

        if (actionType === 'delete') {
        toast.success('Unit berhasil dihapus permanen.');
        } else {
        toast.success('Unit berhasil diarsipkan. Penyewa yang sudah booking masih bisa akses.');
        }

        setShowDeleteModal(false);
        fetchApartments();
    } catch (error) {
        toast.error(error.response?.data?.message || `Gagal ${actionType === 'delete' ? 'menghapus' : 'mengarsipkan'} unit`);
    } finally {
        setDeleting(false);
    }
    };

    const handleAddSuccess = () => {
    fetchApartments(); // Refresh list after adding
    };

    const handleEditSuccess = () => {
    fetchApartments(); // Refresh list after editing
    };

    if (loading && apartments.length === 0) return <Loading fullScreen text="Memuat unit..." />;

    return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Unit Saya</h1>
        <Button onClick={() => setShowAddModal(true)}>
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
                {apartment.is_archived && (
                    <div className="absolute top-2 left-2 z-10">
                    <Badge status="cancelled">
                        <ArchiveBoxIcon className="h-4 w-4 inline mr-1" />
                        Diarsipkan
                    </Badge>
                    </div>
                )}
                <div className={apartment.is_archived ? 'opacity-75' : ''}>
                    <ApartmentCard apartment={apartment} showFavorite={false} />
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                    onClick={() => navigate(`/apartments/${apartment.id}`)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    title="Lihat Detail"
                    >
                    <EyeIcon className="h-5 w-5 text-purple-600" />
                    </button>
                    {!apartment.is_archived && (
                    <>
                        <button
                        onClick={() => {
                            setSelectedApartment(apartment);
                            setShowEditModal(true);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                        title="Edit"
                        >
                        <PencilIcon className="h-5 w-5 text-blue-600" />
                        </button>
                        <button
                        onClick={() => handleDeleteClick(apartment)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                        title="Hapus Unit"
                        >
                        <TrashIcon className="h-5 w-5 text-red-600" />
                        </button>
                        <button
                        onClick={() => handleArchiveClick(apartment)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                        title="Arsipkan"
                        >
                        <ArchiveBoxIcon className="h-5 w-5 text-orange-600" />
                        </button>
                    </>
                    )}
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
            <Button onClick={() => setShowAddModal(true)}>
            Tambah Unit Pertama
            </Button>
        </div>
        )}

        <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={actionType === 'delete' ? 'Hapus Unit' : 'Arsipkan Unit'}
        >
        <div className="mb-4">
            {actionType === 'delete' ? (
            <>
                <p className="mb-2">
                Apakah Anda yakin ingin menghapus unit <strong>{selectedApartment?.unit_number}</strong>?
                </p>
                {hasBookings ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                    <p className="text-red-900">
                    <strong>Tidak dapat menghapus!</strong> Unit ini sudah memiliki booking aktif.
                    </p>
                    <p className="text-red-800 mt-2">
                    Gunakan fitur <strong>Arsip</strong> sebagai gantinya untuk menyembunyikan unit dari calon penyewa baru.
                    </p>
                </div>
                ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                    <p className="text-red-900">
                    <strong>Peringatan:</strong> Unit akan dihapus permanen!
                    </p>
                    <ul className="list-disc ml-5 mt-1 text-red-800">
                    <li>Data unit akan dihapus dari database</li>
                    <li>Semua foto dan informasi unit akan hilang</li>
                    <li>Aksi ini tidak dapat dibatalkan</li>
                    </ul>
                    <p className="mt-2 text-red-900">
                    <strong>Catatan:</strong> Hapus permanen hanya bisa dilakukan jika unit belum pernah memiliki booking.
                    </p>
                </div>
                )}
            </>
            ) : (
            <>
                <p className="mb-2">
                Apakah Anda yakin ingin mengarsipkan unit <strong>{selectedApartment?.unit_number}</strong>?
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="text-blue-900">
                    <strong>Catatan:</strong> Unit yang diarsipkan:
                </p>
                <ul className="list-disc ml-5 mt-1 text-blue-800">
                    <li>Tidak akan muncul untuk calon penyewa baru</li>
                    <li>Tetap bisa diakses oleh penyewa yang sudah booking</li>
                    <li>Masih bisa Anda lihat di halaman ini dengan badge "Diarsipkan"</li>
                </ul>
                </div>
            </>
            )}
        </div>
        <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} fullWidth>
            Batal
            </Button>
            {actionType === 'delete' && hasBookings ? (
            <Button
                variant="warning"
                onClick={() => {
                setShowDeleteModal(false);
                setTimeout(() => handleArchiveClick(selectedApartment), 100);
                }}
                fullWidth>
                Arsipkan Saja
            </Button>
            ) : (
            <Button
                variant="danger"
                onClick={handleConfirmAction}
                loading={deleting || checkingBookings}
                fullWidth
            >
                {actionType === 'delete' ? 'Ya, Hapus Permanen' : 'Ya, Arsipkan'}
            </Button>
            )}
        </div>
        </Modal>

        <AddUnitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        />

        <EditUnitModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        apartment={selectedApartment}
        />
    </div>
    );
};

export default MyUnits;