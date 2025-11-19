import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

/**
 * Generate and download invoice PDF for a payment
 * @param {Object} payment - Payment object with booking and tenant details
 */
export const generateInvoicePDF = (payment) => {
  if (!payment || !payment.booking) {
    console.error('Invalid payment data for invoice generation');
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const primaryColor = [147, 51, 234]; // Purple-600
  const darkColor = [31, 41, 55]; // Gray-800
  const lightColor = [156, 163, 175]; // Gray-400
  const bgColor = [249, 250, 251]; // Gray-50

  // Margins
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;
  let currentY = 20;

  // ===== HEADER =====
  // Logo and Company Info (Left side)
  doc.setFillColor(...primaryColor);
  doc.roundedRect(leftMargin, currentY, 8, 8, 1, 1, 'F');
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('VIDA VIEW', leftMargin + 12, currentY + 6);

  doc.setFontSize(9);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Apartment Living', leftMargin, currentY + 13);

  // Invoice Title (Right side)
  doc.setFontSize(24);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', rightMargin, currentY + 6, { align: 'right' });

  // Invoice Number and Date (Right side)
  doc.setFontSize(9);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice: ${payment.payment_code}`, rightMargin, currentY + 13, { align: 'right' });
  doc.text(`Tanggal: ${formatDate(payment.payment_date || payment.created_at, 'short')}`, rightMargin, currentY + 18, { align: 'right' });

  currentY += 35;

  // ===== DIVIDER =====
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, currentY, rightMargin, currentY);

  currentY += 15;

  // ===== BILLING INFO SECTION =====
  const columnWidth = (pageWidth - 40) / 2;

  // Left Column - Bill To
  doc.setFontSize(10);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'bold');
  doc.text('TAGIHAN KEPADA:', leftMargin, currentY);

  currentY += 6;
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.booking.tenant?.full_name || 'N/A', leftMargin, currentY);

  doc.setFontSize(9);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'normal');
  currentY += 5;
  doc.text(payment.booking.tenant?.email || '-', leftMargin, currentY);
  currentY += 4;
  doc.text(payment.booking.tenant?.phone || '-', leftMargin, currentY);

  // Right Column - Property Info
  const rightColumnX = leftMargin + columnWidth + 10;
  currentY -= 15; // Reset to same level as left column

  doc.setFontSize(10);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'bold');
  doc.text('DETAIL PROPERTI:', rightColumnX, currentY);

  currentY += 6;
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`Unit ${payment.booking.apartment?.unit_number || 'N/A'}`, rightColumnX, currentY);

  doc.setFontSize(9);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'normal');
  currentY += 5;
  doc.text(payment.booking.apartment?.unit_type || '-', rightColumnX, currentY);
  currentY += 4;
  doc.text(`Booking: ${payment.booking.booking_code}`, rightColumnX, currentY);

  currentY += 20;

  // ===== RENTAL PERIOD SECTION =====
  doc.setFillColor(...bgColor);
  doc.roundedRect(leftMargin, currentY, pageWidth - 40, 18, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'bold');
  doc.text('PERIODE SEWA:', leftMargin + 5, currentY + 7);

  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'normal');
  const periodText = `${formatDate(payment.booking.start_date, 'short')} - ${formatDate(payment.booking.end_date, 'short')} (${payment.booking.total_months} bulan)`;
  doc.text(periodText, leftMargin + 5, currentY + 13);

  currentY += 28;

  // ===== PAYMENT DETAILS TABLE =====
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text('RINCIAN PEMBAYARAN', leftMargin, currentY);

  currentY += 5;

  // Prepare table data
  const tableData = [];

  // Monthly Rent
  if (payment.booking.monthly_rent && payment.booking.total_months) {
    tableData.push([
      'Sewa Bulanan',
      `${formatCurrency(payment.booking.monthly_rent)} x ${payment.booking.total_months} bulan`,
      formatCurrency(payment.booking.monthly_rent * payment.booking.total_months)
    ]);
  }

  // Deposit
  if (payment.booking.deposit_paid) {
    tableData.push([
      'Deposit',
      '1x',
      formatCurrency(payment.booking.deposit_paid)
    ]);
  }

  // Utility Deposit
  if (payment.booking.utility_deposit) {
    tableData.push([
      'Deposit Utilitas',
      '1x',
      formatCurrency(payment.booking.utility_deposit)
    ]);
  }

  // Admin Fee
  if (payment.booking.admin_fee) {
    tableData.push([
      'Biaya Administrasi',
      '1x',
      formatCurrency(payment.booking.admin_fee)
    ]);
  }

  // Calculate subtotal
  const subtotal = (payment.booking.monthly_rent * payment.booking.total_months) +
    (payment.booking.deposit_paid || 0) +
    (payment.booking.utility_deposit || 0) +
    (payment.booking.admin_fee || 0);

  // Add subtotal row if there's a discount
  if (payment.booking.discount_amount && payment.booking.discount_amount > 0) {
    tableData.push([
      { content: 'Subtotal', colSpan: 2, styles: { fontStyle: 'bold' } },
      { content: formatCurrency(subtotal), styles: { fontStyle: 'bold' } }
    ]);

    // Add discount row
    tableData.push([
      {
        content: `Diskon Promo ${payment.booking.promotion?.code ? `(${payment.booking.promotion.code})` : ''}`,
        colSpan: 2,
        styles: { textColor: [34, 197, 94] }
      },
      {
        content: `-${formatCurrency(payment.booking.discount_amount)}`,
        styles: { textColor: [34, 197, 94] }
      }
    ]);
  }

  // Generate table
  autoTable(doc, {
    startY: currentY,
    head: [['Deskripsi', 'Qty', 'Jumlah']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: darkColor
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 50, halign: 'center' },
      2: { cellWidth: 60, halign: 'right' }
    },
    margin: { left: leftMargin, right: 20 }
  });

  currentY = doc.lastAutoTable.finalY + 5;

  // ===== TOTAL SECTION =====
  const totalBoxY = currentY;
  const totalBoxHeight = 15;

  doc.setFillColor(...primaryColor);
  doc.roundedRect(pageWidth - 110, totalBoxY, 90, totalBoxHeight, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PEMBAYARAN:', pageWidth - 105, totalBoxY + 6);

  doc.setFontSize(14);
  doc.text(formatCurrency(payment.amount), pageWidth - 25, totalBoxY + 11, { align: 'right' });

  currentY += 25;

  // ===== PAYMENT INFO =====
  doc.setFillColor(...bgColor);
  doc.roundedRect(leftMargin, currentY, pageWidth - 40, 30, 2, 2, 'F');

  const paymentInfoY = currentY + 6;

  doc.setFontSize(9);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMASI PEMBAYARAN', leftMargin + 5, paymentInfoY);

  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Metode: ${payment.payment_method ? payment.payment_method.replace('_', ' ').toUpperCase() : '-'}`, leftMargin + 5, paymentInfoY + 6);
  doc.text(`ID Transaksi: ${payment.transaction_id || '-'}`, leftMargin + 5, paymentInfoY + 11);
  doc.text(`Tanggal Bayar: ${formatDate(payment.payment_date, 'time')}`, leftMargin + 5, paymentInfoY + 16);

  // Status badge
  const statusX = rightMargin - 40;
  doc.setFillColor(34, 197, 94); // Green for completed
  doc.roundedRect(statusX, paymentInfoY - 2, 35, 8, 1, 1, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('LUNAS', statusX + 17.5, paymentInfoY + 3, { align: 'center' });

  currentY += 40;

  // ===== NOTES SECTION =====
  if (payment.notes) {
    doc.setFontSize(9);
    doc.setTextColor(...lightColor);
    doc.setFont('helvetica', 'bold');
    doc.text('CATATAN:', leftMargin, currentY);

    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(payment.notes, pageWidth - 40);
    doc.text(splitNotes, leftMargin, currentY + 5);
    currentY += 15;
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 40;

  // Thank you message
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Terima kasih atas kepercayaan Anda!', pageWidth / 2, footerY, { align: 'center' });

  // Contact info
  doc.setFontSize(8);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Jl. Topaz Raya Masale, Panakkukang Kota Makassar, Sulawesi Selatan 90215', pageWidth / 2, footerY + 6, { align: 'center' });
  doc.text('Email: info@vidaview.com | Telp: (021) 1234-5678', pageWidth / 2, footerY + 10, { align: 'center' });

  // Divider
  doc.setDrawColor(...lightColor);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, footerY + 15, rightMargin, footerY + 15);

  // Bottom text
  doc.setFontSize(7);
  doc.text('Dokumen ini digenerate secara otomatis dan sah tanpa tanda tangan', pageWidth / 2, footerY + 20, { align: 'center' });

  // ===== SAVE PDF =====
  const fileName = `Invoice-${payment.payment_code}-${payment.booking.tenant?.full_name?.replace(/\s+/g, '-') || 'Tenant'}.pdf`;
  doc.save(fileName);
};

export default generateInvoicePDF;
