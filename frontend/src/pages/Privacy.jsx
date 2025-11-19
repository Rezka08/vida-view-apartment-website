import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Privacy = () => {
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
                        Kebijakan Privasi
                    </h1>
                    <p className="text-sm text-gray-500">
                        Terakhir diperbarui: 19 November 2025
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            1. Pendahuluan
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Vida View ("kami", "kami", "platform") berkomitmen untuk melindungi privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, membagikan, dan melindungi informasi pribadi Anda ketika Anda menggunakan layanan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            2. Informasi yang Kami Kumpulkan
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">2.1 Informasi yang Anda Berikan</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Nama lengkap</li>
                                    <li>Username</li>
                                    <li>Alamat email</li>
                                    <li>Nomor telepon</li>
                                    <li>Alamat</li>
                                    <li>Tanggal lahir</li>
                                    <li>Foto profil</li>
                                    <li>Informasi pembayaran</li>
                                    <li>Dokumen verifikasi (KTP, NPWP untuk pemilik)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">2.2 Informasi yang Dikumpulkan Secara Otomatis</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Alamat IP</li>
                                    <li>Jenis browser dan perangkat</li>
                                    <li>Sistem operasi</li>
                                    <li>Halaman yang Anda kunjungi</li>
                                    <li>Waktu dan durasi kunjungan</li>
                                    <li>Data lokasi (dengan izin Anda)</li>
                                    <li>Cookie dan teknologi pelacakan serupa</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">2.3 Informasi dari Pihak Ketiga</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Informasi dari media sosial (jika Anda login menggunakan akun sosial)</li>
                                    <li>Data verifikasi dari layanan pihak ketiga</li>
                                    <li>Informasi pembayaran dari payment gateway</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            3. Cara Kami Menggunakan Informasi Anda
                        </h2>
                        <p className="text-gray-700 mb-3">Kami menggunakan informasi yang dikumpulkan untuk:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Menyediakan, mengoperasikan, dan meningkatkan layanan kami</li>
                            <li>Memproses transaksi dan mengirimkan konfirmasi</li>
                            <li>Mengirimkan notifikasi tentang pemesanan, pembayaran, dan aktivitas akun</li>
                            <li>Merespons pertanyaan dan memberikan dukungan pelanggan</li>
                            <li>Mendeteksi dan mencegah penipuan atau aktivitas ilegal</li>
                            <li>Personalisasi pengalaman pengguna</li>
                            <li>Mengirimkan informasi pemasaran (dengan persetujuan Anda)</li>
                            <li>Melakukan analisis dan riset untuk meningkatkan layanan</li>
                            <li>Mematuhi kewajiban hukum</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            4. Pembagian Informasi
                        </h2>
                        <p className="text-gray-700 mb-3">Kami dapat membagikan informasi Anda dengan:</p>

                        <div className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">Pengguna Lain</h3>
                                <p className="text-gray-700 ml-4">
                                    Penyewa dapat melihat informasi dasar pemilik (nama, foto profil, rating). Pemilik dapat melihat informasi penyewa yang memesan unit mereka.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Penyedia Layanan Pihak Ketiga</h3>
                                <p className="text-gray-700 ml-4">
                                    Payment gateway, layanan hosting, analitik, email service, dan layanan teknis lainnya yang membantu operasional platform.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Otoritas Hukum</h3>
                                <p className="text-gray-700 ml-4">
                                    Jika diwajibkan oleh hukum atau untuk melindungi hak, keamanan, dan keselamatan.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Transfer Bisnis</h3>
                                <p className="text-gray-700 ml-4">
                                    Dalam hal merger, akuisisi, atau penjualan aset perusahaan.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            5. Keamanan Data
                        </h2>
                        <p className="text-gray-700 mb-3">
                            Kami menerapkan langkah-langkah keamanan untuk melindungi informasi Anda:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Enkripsi data menggunakan SSL/TLS</li>
                            <li>Penyimpanan password menggunakan hashing yang aman</li>
                            <li>Akses terbatas ke informasi pribadi</li>
                            <li>Monitoring keamanan secara berkala</li>
                            <li>Firewall dan perlindungan terhadap serangan</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            Namun, tidak ada sistem yang 100% aman. Kami mendorong Anda untuk melindungi password dan tidak membagikannya kepada siapa pun.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            6. Cookie dan Teknologi Pelacakan
                        </h2>
                        <p className="text-gray-700 mb-3">
                            Kami menggunakan cookie dan teknologi serupa untuk:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Mengingat preferensi Anda</li>
                            <li>Memahami cara Anda menggunakan platform</li>
                            <li>Meningkatkan keamanan</li>
                            <li>Menyajikan iklan yang relevan</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            Anda dapat mengatur browser untuk menolak cookie, tetapi ini mungkin membatasi fungsi platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            7. Hak Anda
                        </h2>
                        <p className="text-gray-700 mb-3">Anda memiliki hak untuk:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li><strong>Akses:</strong> Meminta salinan informasi pribadi Anda</li>
                            <li><strong>Koreksi:</strong> Memperbarui atau memperbaiki informasi yang tidak akurat</li>
                            <li><strong>Penghapusan:</strong> Meminta penghapusan data Anda (dengan batasan tertentu)</li>
                            <li><strong>Pembatasan:</strong> Membatasi pemrosesan data Anda</li>
                            <li><strong>Portabilitas:</strong> Menerima data Anda dalam format yang dapat dibaca mesin</li>
                            <li><strong>Keberatan:</strong> Menolak pemrosesan data untuk tujuan tertentu</li>
                            <li><strong>Penarikan Persetujuan:</strong> Menarik persetujuan kapan saja</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            Untuk menggunakan hak-hak ini, hubungi kami di privacy@vidaview.com
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            8. Penyimpanan Data
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Kami menyimpan informasi Anda selama akun Anda aktif atau sepanjang diperlukan untuk menyediakan layanan. Setelah akun dihapus, kami akan menghapus atau mengaononimkan data Anda, kecuali jika diwajibkan oleh hukum untuk menyimpannya lebih lama.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            9. Pengguna Anak-Anak
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Layanan kami tidak ditujukan untuk anak-anak di bawah 18 tahun. Kami tidak secara sengaja mengumpulkan informasi dari anak-anak. Jika Anda mengetahui bahwa anak Anda memberikan informasi kepada kami, hubungi kami segera.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            10. Transfer Data Internasional
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Informasi Anda dapat ditransfer dan disimpan di server yang berlokasi di luar negara Anda. Kami memastikan bahwa transfer tersebut dilakukan dengan perlindungan yang memadai sesuai hukum yang berlaku.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            11. Perubahan Kebijakan Privasi
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal "Terakhir diperbarui" yang baru. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            12. Hubungi Kami
                        </h2>
                        <p className="text-gray-700 mb-3">
                            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau praktik privasi kami:
                        </p>
                        <div className="text-gray-700 space-y-1 ml-4">
                            <p><strong>Email:</strong> privacy@vidaview.com</p>
                            <p><strong>Telepon:</strong> +62 811-2345-6789</p>
                            <p><strong>Alamat:</strong> Jl. Perintis Kemerdekaan KM. 10, Makassar, Sulawesi Selatan 90245</p>
                        </div>
                    </section>

                    <section className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-900 mb-2">
                            Persetujuan
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            Dengan menggunakan layanan Vida View, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui kebijakan privasi ini.
                        </p>
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

export default Privacy;
