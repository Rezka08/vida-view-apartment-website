-- Sample Data untuk Testing Vida View Database
USE vidaview_db;

-- Sample Users (password: hashed 'password123')
INSERT INTO users (username, email, password, full_name, phone, role, status) VALUES
('admin', 'admin@vidaview.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5iSy.k3F6xBXe', 'Admin Vida View', '081234567890', 'admin', 'active'),
('owner1', 'owner1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5iSy.k3F6xBXe', 'John Doe', '081234567891', 'owner', 'active'),
('owner2', 'owner2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5iSy.k3F6xBXe', 'Jane Smith', '081234567892', 'owner', 'active'),
('tenant1', 'tenant1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5iSy.k3F6xBXe', 'Alice Johnson', '081234567893', 'tenant', 'active'),
('tenant2', 'tenant2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5iSy.k3F6xBXe', 'Bob Williams', '081234567894', 'tenant', 'active');

-- Sample Facilities
INSERT INTO facilities (name, description, icon, category, status) VALUES
('Kolam Renang', 'Kolam renang outdoor dengan pemandangan kota', 'pool', 'building', 'active'),
('Gym', 'Fitness center dengan peralatan lengkap', 'dumbbell', 'building', 'active'),
('Parkir', 'Parkir basement dengan sistem keamanan 24 jam', 'car', 'building', 'active'),
('Keamanan 24/7', 'Petugas keamanan dan CCTV 24 jam', 'shield', 'building', 'active'),
('Wi-Fi', 'Internet berkecepatan tinggi', 'wifi', 'unit', 'active'),
('AC', 'Pendingin ruangan', 'wind', 'unit', 'active'),
('Kitchen Set', 'Dapur lengkap dengan peralatan', 'utensils', 'unit', 'active'),
('Water Heater', 'Pemanas air', 'droplet', 'unit', 'active'),
('Supermarket', 'Minimarket dalam gedung', 'shopping-cart', 'building', 'active'),
('Playground', 'Area bermain anak', 'toy-brick', 'building', 'active');

-- Sample Apartments
INSERT INTO apartments (unit_number, unit_type, floor, size_sqm, bedrooms, bathrooms, price_per_month, deposit_amount, minimum_stay_months, description, furnished, view_direction, electricity_watt, water_source, parking_slots, pet_friendly, smoking_allowed, availability_status, owner_id) VALUES
('A-101', 'Studio', 1, 25.00, 1, 1, 3500000, 3500000, 3, 'Unit studio modern dengan pemandangan taman. Lokasi strategis dekat dengan lobby dan fasilitas umum.', TRUE, 'Selatan', 1300, 'PDAM', 1, FALSE, FALSE, 'available', 2),
('A-205', '1BR', 2, 35.00, 1, 1, 4500000, 4500000, 3, 'Apartemen 1 kamar tidur dengan balkon luas. View menghadap kolam renang.', TRUE, 'Utara', 2200, 'PDAM', 1, TRUE, FALSE, 'available', 2),
('B-310', '2BR', 3, 50.00, 2, 1, 6500000, 6500000, 6, 'Apartemen 2 kamar tidur cocok untuk keluarga kecil. Fully furnished dengan perabotan berkualitas.', TRUE, 'Timur', 2200, 'PDAM', 1, FALSE, FALSE, 'available', 3),
('B-415', '2BR', 4, 55.00, 2, 2, 7500000, 7500000, 6, 'Unit premium dengan 2 kamar mandi. Pemandangan city view yang menakjubkan.', TRUE, 'Barat', 3500, 'PDAM', 2, TRUE, FALSE, 'available', 3),
('C-520', '3BR', 5, 75.00, 3, 2, 10000000, 10000000, 12, 'Apartemen mewah 3 kamar tidur. Lantai tinggi dengan pemandangan 360 derajat.', TRUE, 'Utara', 4400, 'PDAM', 2, FALSE, FALSE, 'available', 2),
('C-625', '3BR', 6, 80.00, 3, 2, 11000000, 11000000, 12, 'Penthouse dengan interior mewah. Dilengkapi smart home system.', TRUE, 'Selatan', 5500, 'PDAM', 3, TRUE, FALSE, 'occupied', 3);

-- Sample Unit Photos
INSERT INTO unit_photos (apartment_id, photo_url, photo_type, caption, display_order, is_cover) VALUES
(1, '/images/units/a101-living.jpg', 'living_room', 'Ruang tamu yang nyaman', 1, TRUE),
(1, '/images/units/a101-bedroom.jpg', 'bedroom', 'Kamar tidur dengan tempat tidur queen', 2, FALSE),
(1, '/images/units/a101-bathroom.jpg', 'bathroom', 'Kamar mandi modern', 3, FALSE),
(2, '/images/units/a205-living.jpg', 'living_room', 'Living room dengan balkon', 1, TRUE),
(2, '/images/units/a205-bedroom.jpg', 'bedroom', 'Master bedroom', 2, FALSE),
(2, '/images/units/a205-balcony.jpg', 'balcony', 'Balkon dengan view kolam renang', 3, FALSE),
(3, '/images/units/b310-living.jpg', 'living_room', 'Spacious living area', 1, TRUE),
(3, '/images/units/b310-kitchen.jpg', 'kitchen', 'Modern kitchen set', 2, FALSE),
(3, '/images/units/b310-bedroom1.jpg', 'bedroom', 'Master bedroom', 3, FALSE),
(4, '/images/units/b415-main.jpg', 'main', 'Premium unit city view', 1, TRUE),
(5, '/images/units/c520-main.jpg', 'main', 'Luxury 3BR apartment', 1, TRUE),
(6, '/images/units/c625-main.jpg', 'main', 'Penthouse interior', 1, TRUE);

-- Sample Apartment Facilities
INSERT INTO apartment_facilities (apartment_id, facility_id) VALUES
-- Unit A-101
(1, 5), (1, 6), (1, 7), (1, 8),
-- Unit A-205
(2, 5), (2, 6), (2, 7), (2, 8),
-- Unit B-310
(3, 5), (3, 6), (3, 7), (3, 8),
-- Unit B-415
(4, 5), (4, 6), (4, 7), (4, 8),
-- Unit C-520
(5, 5), (5, 6), (5, 7), (5, 8),
-- Unit C-625
(6, 5), (6, 6), (6, 7), (6, 8);

-- Sample Bookings
INSERT INTO bookings (apartment_id, tenant_id, booking_code, start_date, end_date, total_months, monthly_rent, deposit_paid, utility_deposit, admin_fee, total_amount, status, approved_by) VALUES
(6, 4, 'BK20250101001', '2025-01-01', '2026-01-01', 12, 11000000, 11000000, 2000000, 500000, 145500000, 'active', 1),
(2, 5, 'BK20250115001', '2025-01-15', '2025-07-15', 6, 4500000, 4500000, 1000000, 500000, 33000000, 'confirmed', 1);

-- Sample Reviews
INSERT INTO reviews (apartment_id, tenant_id, booking_id, rating, review_text, is_approved, approved_by, approved_at) VALUES
(6, 4, 1, 5, 'Apartemen yang sangat nyaman dan bersih. Fasilitas lengkap dan lokasi strategis. Highly recommended!', TRUE, 1, NOW()),
(2, 5, 2, 4, 'Unit bagus dengan view yang menarik. Hanya saja kadang lift agak lambat saat jam sibuk.', TRUE, 1, NOW());

-- Sample Favorites
INSERT INTO favorites (user_id, apartment_id) VALUES
(4, 1), (4, 3), (4, 5),
(5, 1), (5, 4);

-- Sample Promotions
INSERT INTO promotions (code, title, description, type, value, start_date, end_date, min_nights, active) VALUES
('NEWYEAR2025', 'Promo Tahun Baru 2025', 'Diskon 10% untuk sewa minimal 6 bulan', 'percent', 10.0000, '2025-01-01', '2025-01-31', 6, TRUE),
('LONGSTAY', 'Promo Sewa Tahunan', 'Diskon 15% untuk sewa 12 bulan', 'percent', 15.0000, '2025-01-01', '2025-12-31', 12, TRUE);

-- Sample Notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(4, 'Booking Dikonfirmasi', 'Booking Anda untuk unit C-625 telah dikonfirmasi. Selamat menempati unit baru Anda!', 'booking', TRUE),
(5, 'Booking Menunggu Pembayaran', 'Silakan lakukan pembayaran untuk booking unit A-205 sebelum tanggal 2025-01-20.', 'payment', FALSE),
(2, 'Unit Baru Ditambahkan', 'Selamat! Unit A-101 Anda telah berhasil ditambahkan ke sistem.', 'system', TRUE);

-- Sample Payments
INSERT INTO payments (booking_id, payment_code, payment_type, amount, payment_method, payment_status, payment_date, transaction_id) VALUES
(1, 'PAY20250101001', 'deposit', 11000000, 'bank_transfer', 'completed', '2024-12-25 10:30:00', 'TRX-20241225-001'),
(1, 'PAY20250101002', 'monthly_rent', 11000000, 'bank_transfer', 'completed', '2025-01-01 14:20:00', 'TRX-20250101-001'),
(2, 'PAY20250115001', 'deposit', 4500000, 'e_wallet', 'pending', NULL, NULL);