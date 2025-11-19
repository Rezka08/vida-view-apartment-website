import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <Link
                        to="/register"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Kembali ke Registrasi
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Syarat dan Ketentuan
                    </h1>
                    <p className="text-sm text-gray-500">
                        Terakhir diperbarui: 19 November 2025
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            1. Penerimaan Syarat
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Dengan mengakses dan menggunakan platform Vida View, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat dan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            2. Definisi Pengguna
                        </h2>
                        <div className="text-gray-700 leading-relaxed space-y-2">
                            <p><strong>Penyewa:</strong> Pengguna yang mencari dan menyewa unit apartemen melalui platform.</p>
                            <p><strong>Pemilik:</strong> Pengguna yang mendaftarkan dan menyewakan unit apartemen melalui platform.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            3. Registrasi Akun
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Anda harus berusia minimal 18 tahun untuk membuat akun</li>
                            <li>Informasi yang Anda berikan harus akurat dan terkini</li>
                            <li>Anda bertanggung jawab untuk menjaga kerahasiaan password</li>
                            <li>Satu akun hanya untuk satu pengguna</li>
                            <li>Vida View berhak menangguhkan atau menghapus akun yang melanggar ketentuan</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            4. Kewajiban Penyewa
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Memberikan informasi yang benar saat melakukan pemesanan</li>
                            <li>Melakukan pembayaran sesuai dengan kesepakatan</li>
                            <li>Menjaga unit apartemen dengan baik selama masa sewa</li>
                            <li>Mematuhi aturan yang ditetapkan oleh pemilik dan pengelola apartemen</li>
                            <li>Melaporkan kerusakan atau masalah pada unit tepat waktu</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            5. Kewajiban Pemilik
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Memberikan informasi yang akurat tentang unit apartemen</li>
                            <li>Memastikan unit dalam kondisi layak huni</li>
                            <li>Menyediakan fasilitas sesuai yang tercantum dalam listing</li>
                            <li>Merespons keluhan dan pertanyaan penyewa dengan cepat</li>
                            <li>Tidak melakukan diskriminasi terhadap calon penyewa</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            6. Pembayaran dan Biaya
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Semua harga tercantum dalam Rupiah (IDR)</li>
                            <li>Pembayaran dilakukan melalui metode yang tersedia di platform</li>
                            <li>Vida View mengenakan biaya layanan untuk setiap transaksi</li>
                            <li>Pemilik menerima pembayaran setelah dikurangi biaya platform</li>
                            <li>Pengembalian dana mengikuti kebijakan pembatalan yang berlaku</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            7. Kebijakan Pembatalan
                        </h2>
                        <div className="text-gray-700 space-y-3">
                            <p><strong>Pembatalan oleh Penyewa:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Lebih dari 30 hari sebelum check-in: pengembalian 100%</li>
                                <li>15-30 hari sebelum check-in: pengembalian 50%</li>
                                <li>Kurang dari 15 hari: tidak ada pengembalian</li>
                            </ul>
                            <p className="mt-3"><strong>Pembatalan oleh Pemilik:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Pengembalian 100% kepada penyewa</li>
                                <li>Denda untuk pemilik yang sering membatalkan</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            8. Larangan Penggunaan
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Menggunakan platform untuk tujuan ilegal</li>
                            <li>Memposting konten yang menyesatkan atau palsu</li>
                            <li>Melakukan penipuan atau aktivitas mencurigakan</li>
                            <li>Mengganggu operasional platform</li>
                            <li>Melanggar hak kekayaan intelektual</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            9. Tanggung Jawab Platform
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Vida View bertindak sebagai perantara antara penyewa dan pemilik. Kami tidak bertanggung jawab atas:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                            <li>Kualitas, kondisi, atau keamanan unit apartemen</li>
                            <li>Perilaku pengguna di luar platform</li>
                            <li>Sengketa antara penyewa dan pemilik</li>
                            <li>Kerugian akibat force majeure</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            10. Perubahan Syarat dan Ketentuan
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Vida View berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diberitahukan melalui email atau notifikasi di platform. Penggunaan platform setelah perubahan berarti Anda menyetujui syarat dan ketentuan yang baru.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            11. Hukum yang Berlaku
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui musyawarah atau melalui pengadilan yang berwenang di Indonesia.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            12. Kontak
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami:
                        </p>
                        <div className="mt-3 text-gray-700 space-y-1">
                            <p>Email: legal@vidaview.com</p>
                            <p>Telepon: +62 811-2345-6789</p>
                            <p>Alamat: Jl. Perintis Kemerdekaan KM. 10, Makassar, Sulawesi Selatan</p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <Link
                        to="/register"
                        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Kembali ke Registrasi
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Terms;
