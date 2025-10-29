import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserPlusIcon
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
      fetchUsers();
    } catch (error) {
      toast.error('Gagal memperbarui data pengguna');
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
      fetchUsers();
    } catch (error) {
      toast.error('Gagal menghapus pengguna');
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
      fetchUsers();
    } catch (error) {
      toast.error('Gagal memverifikasi dokumen');
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
                    {user.document_verified_at ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
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
        <p className="mb-4">
          Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.full_name}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex space-x-3">
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
    </div>
  );
};

export default UserManagement;