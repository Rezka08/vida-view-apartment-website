import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserPlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import usersAPI from '../../api/users';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/formatters';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters
      };
      const response = await usersAPI.getUsers(params);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      address: user.address || '',
      birth_date: user.birth_date || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    setSubmitting(true);
    try {
      await usersAPI.updateUser(selectedUser.id, editFormData);
      toast.success('Data pengguna berhasil diperbarui');
      setShowEditModal(false);
      await fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui data pengguna';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await usersAPI.deleteUser(selectedUser.id);
      toast.success('Pengguna berhasil dihapus');
      setShowDeleteModal(false);
      await fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menghapus pengguna';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setSubmitting(true);
    try {
      await usersAPI.verifyDocuments(selectedUser.id);
      toast.success('Dokumen berhasil diverifikasi');
      setShowVerifyModal(false);
      setShowDocumentsModal(false);
      await fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal memverifikasi dokumen';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && users.length === 0) {
    return <Loading fullScreen text="Memuat data pengguna..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-600">Kelola semua pengguna sistem</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Cari nama, email, atau username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Semua Role</option>
            <option value="tenant">Penyewa</option>
            <option value="owner">Pemilik</option>
            <option value="admin">Admin</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
            <option value="suspended">Suspended</option>
          </select>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terdaftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokumen
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profile_photo ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profile_photo}
                            alt={user.full_name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">
                              {user.full_name?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="primary" size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={user.status === 'active' ? 'success' : 'default'}
                      size="sm"
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at, 'short')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {user.document_verified_at ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : user.id_card_photo ? (
                        <XCircleIcon className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {user.id_card_photo && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDocumentsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Lihat Dokumen"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      )}
                      {!user.document_verified_at && user.id_card_photo && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowVerifyModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Verifikasi Dokumen"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada data pengguna</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Pengguna"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Username"
              name="username"
              value={editFormData.username || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
            />
            <Input
              label="Nama Lengkap"
              name="full_name"
              value={editFormData.full_name || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              label="Telepon"
              name="phone"
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={editFormData.role || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="tenant">Penyewa</option>
                <option value="owner">Pemilik</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editFormData.status || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <Input
            label="Alamat"
            name="address"
            value={editFormData.address || ''}
            onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              fullWidth
            >
              Batal
            </Button>
            <Button
              onClick={handleEditSubmit}
              loading={submitting}
              fullWidth
            >
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Pengguna"
      >
        <div className="space-y-4">
          <p>
            Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.full_name}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          {selectedUser?.role === 'owner' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Perhatian!</h4>
                  <p className="text-sm text-yellow-700">
                    Pastikan owner ini tidak memiliki unit apartemen. Jika masih ada unit yang terkait, hapus atau transfer unit terlebih dahulu.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedUser?.role === 'tenant' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Perhatian!</h4>
                  <p className="text-sm text-yellow-700">
                    Pastikan penyewa ini tidak memiliki booking aktif. Jika masih ada booking yang sedang berjalan, selesaikan atau batalkan terlebih dahulu.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            fullWidth
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={submitting}
            fullWidth
          >
            Hapus
          </Button>
        </div>
      </Modal>

      {/* Verify Modal */}
      <Modal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        title="Verifikasi Dokumen"
      >
        <p className="mb-4">
          Verifikasi dokumen identitas untuk <strong>{selectedUser?.full_name}</strong>?
        </p>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowVerifyModal(false)}
            fullWidth
          >
            Batal
          </Button>
          <Button
            onClick={handleVerify}
            loading={submitting}
            fullWidth
          >
            Verifikasi
          </Button>
        </div>
      </Modal>

      {/* Documents Modal */}
      <Modal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        title={`Dokumen - ${selectedUser?.full_name}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Document Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Status Verifikasi</h4>
              <p className="text-sm text-gray-600">
                {selectedUser?.document_verified_at
                  ? `Terverifikasi pada ${formatDate(selectedUser.document_verified_at)}`
                  : 'Belum diverifikasi'
                }
              </p>
            </div>
            <Badge variant={selectedUser?.document_verified_at ? 'success' : 'warning'}>
              {selectedUser?.document_verified_at ? 'Terverifikasi' : 'Pending'}
            </Badge>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID Card */}
            {selectedUser?.id_card_photo && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Kartu Identitas (KTP)
                </h5>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={selectedUser.id_card_photo}
                    alt="KTP"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => window.open(selectedUser.id_card_photo, '_blank')}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Lihat Full
                </Button>
              </div>
            )}

            {/* Selfie with ID */}
            {selectedUser?.selfie_photo && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Foto Selfie dengan KTP
                </h5>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={selectedUser.selfie_photo}
                    alt="Selfie"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => window.open(selectedUser.selfie_photo, '_blank')}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Lihat Full
                </Button>
              </div>
            )}

            {/* Income Proof */}
            {selectedUser?.income_proof && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Bukti Penghasilan
                </h5>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                  {selectedUser.income_proof.endsWith('.pdf') ? (
                    <div className="text-center">
                      <svg className="h-16 w-16 mx-auto text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      <p className="text-sm text-gray-600">PDF Document</p>
                    </div>
                  ) : (
                    <img
                      src={selectedUser.income_proof}
                      alt="Income Proof"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => window.open(selectedUser.income_proof, '_blank')}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Lihat Full
                </Button>
              </div>
            )}

            {/* Reference Letter */}
            {selectedUser?.reference_letter && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Surat Referensi
                </h5>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                  {selectedUser.reference_letter.endsWith('.pdf') ? (
                    <div className="text-center">
                      <svg className="h-16 w-16 mx-auto text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      <p className="text-sm text-gray-600">PDF Document</p>
                    </div>
                  ) : (
                    <img
                      src={selectedUser.reference_letter}
                      alt="Reference"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => window.open(selectedUser.reference_letter, '_blank')}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Lihat Full
                </Button>
              </div>
            )}
          </div>

          {/* No Documents Message */}
          {!selectedUser?.id_card_photo && !selectedUser?.selfie_photo && !selectedUser?.income_proof && !selectedUser?.reference_letter && (
            <div className="text-center py-8">
              <XCircleIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Belum ada dokumen yang diupload</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowDocumentsModal(false)}
              fullWidth
            >
              Tutup
            </Button>
            {!selectedUser?.document_verified_at && selectedUser?.id_card_photo && (
              <Button
                variant="primary"
                onClick={() => {
                  setShowDocumentsModal(false);
                  setShowVerifyModal(true);
                }}
                fullWidth
              >
                Verifikasi Dokumen
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;