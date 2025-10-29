import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import usersAPI from '../../api/users';
import useUserStore from '../../stores/userStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { formatDate, formatFileSize } from '../../utils/formatters';

const MyDocuments = () => {
  const { profile, fetchProfile } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    document_type: '',
    file: null
  });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      await fetchProfile();
      // Mock documents for demo - in real app, get from API
      setDocuments([
        {
          id: 1,
          type: 'id_card',
          name: 'KTP',
          file_name: profile?.id_card_photo ? 'ktp.jpg' : null,
          file_url: profile?.id_card_photo,
          status: profile?.document_verified_at ? 'verified' : 'pending',
          uploaded_at: profile?.created_at,
          verified_at: profile?.document_verified_at
        }
      ]);
    } catch (error) {
      toast.error('Gagal memuat dokumen');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF');
        return;
      }

      setUploadData(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadData.document_type) {
      toast.error('Pilih jenis dokumen');
      return;
    }

    if (!uploadData.file) {
      toast.error('Pilih file untuk diupload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      
      if (uploadData.document_type === 'id_card') {
        formData.append('id_card', uploadData.file);
      }

      await usersAPI.uploadDocuments(formData);
      toast.success('Dokumen berhasil diupload!');
      setShowUploadModal(false);
      setUploadData({ document_type: '', file: null });
      loadProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal upload dokumen');
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocument = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank');
    } else {
      toast.error('File tidak tersedia');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      verified: { variant: 'success', text: 'Terverifikasi' },
      pending: { variant: 'warning', text: 'Menunggu Verifikasi' },
      rejected: { variant: 'danger', text: 'Ditolak' },
      not_uploaded: { variant: 'default', text: 'Belum Upload' }
    };
    
    const config = statusMap[status] || statusMap.not_uploaded;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const requiredDocuments = [
    {
      type: 'id_card',
      name: 'Kartu Identitas (KTP)',
      description: 'Upload foto KTP yang masih berlaku',
      required: true
    },
    {
      type: 'selfie',
      name: 'Foto Selfie dengan KTP',
      description: 'Selfie sambil memegang KTP untuk verifikasi',
      required: true
    },
    {
      type: 'income',
      name: 'Bukti Penghasilan',
      description: 'Slip gaji atau surat keterangan penghasilan',
      required: false
    },
    {
      type: 'reference',
      name: 'Surat Referensi',
      description: 'Surat referensi dari tempat kerja atau sewa sebelumnya',
      required: false
    }
  ];

  if (loading) {
    return <Loading fullScreen text="Memuat dokumen..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokumen Saya</h1>
          <p className="text-gray-600">Kelola dokumen untuk verifikasi akun</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
          Upload Dokumen
        </Button>
      </div>

      {/* Verification Status */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              profile?.document_verified_at
                ? 'bg-green-100'
                : 'bg-yellow-100'
            }`}>
              {profile?.document_verified_at ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : (
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Status Verifikasi Dokumen
              </h3>
              <p className="text-sm text-gray-600">
                {profile?.document_verified_at
                  ? `Terverifikasi pada ${formatDate(profile.document_verified_at)}`
                  : 'Dokumen Anda sedang dalam proses verifikasi'
                }
              </p>
            </div>
          </div>
          {getStatusBadge(profile?.document_verified_at ? 'verified' : 'pending')}
        </div>

        {!profile?.document_verified_at && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Info:</strong> Proses verifikasi dokumen membutuhkan waktu 1-2 hari kerja. 
              Pastikan dokumen yang diupload jelas dan valid.
            </p>
          </div>
        )}
      </Card>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiredDocuments.map((docType) => {
          const uploadedDoc = documents.find(d => d.type === docType.type);
          
          return (
            <Card key={docType.type}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(uploadedDoc?.status || 'not_uploaded')}
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        {docType.name}
                        {docType.required && (
                          <span className="ml-2 text-xs text-red-500">*Wajib</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {docType.description}
                      </p>
                    </div>
                  </div>
                </div>

                {uploadedDoc?.file_name ? (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {uploadedDoc.file_name}
                        </span>
                      </div>
                      {getStatusBadge(uploadedDoc.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Upload: {formatDate(uploadedDoc.uploaded_at)}</span>
                      {uploadedDoc.verified_at && (
                        <span>Verified: {formatDate(uploadedDoc.verified_at)}</span>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(uploadedDoc)}
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Lihat
                      </Button>
                      {uploadedDoc.status !== 'verified' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadData({ document_type: docType.type, file: null });
                            setShowUploadModal(true);
                          }}
                        >
                          <DocumentArrowUpIcon className="h-4 w-4 mr-1" />
                          Upload Ulang
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setUploadData({ document_type: docType.type, file: null });
                      setShowUploadModal(true);
                    }}
                  >
                    <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                    Upload {docType.name}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Important Information */}
      <Card title="Informasi Penting">
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Dokumen harus jelas, tidak blur, dan dapat terbaca dengan baik</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Format file yang diterima: JPG, PNG, atau PDF (maksimal 5MB)</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Pastikan KTP masih berlaku dan tidak kadaluarsa</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Foto selfie harus menunjukkan wajah dengan jelas bersama KTP</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Proses verifikasi membutuhkan waktu 1-2 hari kerja</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Data pribadi Anda akan dijaga kerahasiaannya</span>
          </li>
        </ul>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadData({ document_type: '', file: null });
        }}
        title="Upload Dokumen"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Dokumen <span className="text-red-500">*</span>
            </label>
            <select
              value={uploadData.document_type}
              onChange={(e) => setUploadData(prev => ({ ...prev, document_type: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Pilih jenis dokumen</option>
              {requiredDocuments.map((doc) => (
                <option key={doc.type} value={doc.type}>
                  {doc.name} {doc.required ? '(Wajib)' : '(Opsional)'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Dokumen <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <input
                type="file"
                id="document-upload"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="document-upload" className="cursor-pointer">
                <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  {uploadData.file ? (
                    <span className="text-purple-600 font-medium">
                      {uploadData.file.name}
                    </span>
                  ) : (
                    'Klik untuk upload atau drag and drop'
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG, PDF (max. 5MB)
                </p>
              </label>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Perhatian:</strong> Pastikan dokumen yang diupload jelas dan sesuai dengan jenis dokumen yang dipilih.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowUploadModal(false);
                setUploadData({ document_type: '', file: null });
              }}
              fullWidth
            >
              Batal
            </Button>
            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={!uploadData.document_type || !uploadData.file || uploading}
              fullWidth
            >
              Upload Dokumen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyDocuments;