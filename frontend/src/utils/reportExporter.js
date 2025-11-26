import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency } from './formatters';

export const exportReportPDF = async (occupancyData, revenueData, topApartments, selectedYear) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const primaryColor = [147, 51, 234]; // Purple
  const darkColor = [31, 41, 55];
  const lightColor = [156, 163, 175];
  const greenColor = [34, 197, 94];
  const blueColor = [59, 130, 246];
  const yellowColor = [234, 179, 8];

  let currentY = 20;
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;

  // ===== HEADER =====
  // Add logo image
  try {
    const logoImg = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = '/logo_full.png';
    });
    doc.addImage(logoImg, 'PNG', leftMargin, currentY, 50, 15);
  } catch (error) {
    // Fallback to text if image fails to load
    console.warn('Failed to load logo, using text fallback');
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('VIDA VIEW', leftMargin, currentY + 6);

    doc.setFontSize(10);
    doc.setTextColor(...lightColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Apartment Living', leftMargin, currentY + 13);
  }

  // Report Title
  doc.setFontSize(20);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN SISTEM', rightMargin, currentY + 8, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Tanggal: ${currentDate}`, rightMargin, currentY + 14, { align: 'right' });

  currentY += 30;

  // Divider
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, currentY, rightMargin, currentY);

  currentY += 15;

  // ===== OCCUPANCY SECTION =====
  if (occupancyData) {
    doc.setFontSize(14);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN OKUPANSI', leftMargin, currentY);

    currentY += 10;

    // Summary Cards
    const cardWidth = (pageWidth - 60) / 4;
    const cardData = [
      { label: 'Total Unit', value: occupancyData.summary.total, color: primaryColor },
      { label: 'Terisi', value: occupancyData.summary.occupied, color: greenColor },
      { label: 'Tersedia', value: occupancyData.summary.available, color: blueColor },
      { label: 'Okupansi', value: `${occupancyData.summary.occupancy_rate}%`, color: yellowColor }
    ];

    cardData.forEach((card, index) => {
      const x = leftMargin + (index * (cardWidth + 5));

      // Card background
      doc.setFillColor(card.color[0], card.color[1], card.color[2], 0.1);
      doc.roundedRect(x, currentY, cardWidth, 18, 2, 2, 'F');

      // Label
      doc.setFontSize(8);
      doc.setTextColor(...lightColor);
      doc.setFont('helvetica', 'normal');
      doc.text(card.label, x + cardWidth / 2, currentY + 5, { align: 'center' });

      // Value
      doc.setFontSize(16);
      doc.setTextColor(...card.color);
      doc.setFont('helvetica', 'bold');
      doc.text(String(card.value), x + cardWidth / 2, currentY + 13, { align: 'center' });
    });

    currentY += 28;

    // By Type Table
    if (occupancyData.by_type && Object.keys(occupancyData.by_type).length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(...darkColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Okupansi per Tipe Unit', leftMargin, currentY);

      currentY += 5;

      const typeTableData = Object.entries(occupancyData.by_type).map(([type, data]) => [
        type,
        data.total,
        data.occupied,
        data.available,
        `${Math.round((data.occupied / data.total) * 100)}%`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Tipe Unit', 'Total', 'Terisi', 'Tersedia', 'Okupansi']],
        body: typeTableData,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 9
        },
        margin: { left: leftMargin, right: 20 }
      });

      currentY = doc.lastAutoTable.finalY + 15;
    }
  }

  // ===== NEW PAGE FOR REVENUE =====
  doc.addPage();
  currentY = 20;

  // ===== REVENUE SECTION =====
  if (revenueData) {
    doc.setFontSize(14);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`LAPORAN PENDAPATAN ${selectedYear}`, leftMargin, currentY);

    currentY += 10;

    // Total Revenue Box
    doc.setFillColor(...primaryColor);
    doc.roundedRect(leftMargin, currentY, pageWidth - 40, 20, 2, 2, 'F');

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Pendapatan', leftMargin + 5, currentY + 7);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(revenueData.total_revenue), leftMargin + 5, currentY + 15);

    currentY += 30;

    // Monthly Revenue Table
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Pendapatan Bulanan', leftMargin, currentY);

    currentY += 5;

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const revenueTableData = Object.entries(revenueData.monthly_data).map(([month, value]) => [
      monthNames[parseInt(month) - 1],
      formatCurrency(value)
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Bulan', 'Pendapatan']],
      body: revenueTableData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        1: { halign: 'right' }
      },
      margin: { left: leftMargin, right: 20 }
    });

    currentY = doc.lastAutoTable.finalY + 15;
  }

  // ===== NEW PAGE FOR TOP APARTMENTS =====
  doc.addPage();
  currentY = 20;

  // ===== TOP APARTMENTS SECTION =====
  if (topApartments) {
    doc.setFontSize(14);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('UNIT TERPOPULER', leftMargin, currentY);

    currentY += 10;

    // Most Viewed
    if (topApartments.most_viewed && topApartments.most_viewed.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(...darkColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Paling Banyak Dilihat', leftMargin, currentY);

      currentY += 5;

      const viewedTableData = topApartments.most_viewed.slice(0, 10).map((apt, index) => [
        index + 1,
        apt.unit_number,
        apt.unit_type,
        apt.total_views || 0
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['#', 'Unit', 'Tipe', 'Total Views']],
        body: viewedTableData,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          3: { halign: 'right' }
        },
        margin: { left: leftMargin, right: 20 }
      });

      currentY = doc.lastAutoTable.finalY + 15;
    }

    // Highest Rated
    if (topApartments.highest_rated && topApartments.highest_rated.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(...darkColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Rating Tertinggi', leftMargin, currentY);

      currentY += 5;

      const ratedTableData = topApartments.highest_rated.slice(0, 10).map((apt, index) => [
        index + 1,
        apt.unit_number,
        apt.unit_type,
        `★ ${apt.avg_rating}`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['#', 'Unit', 'Tipe', 'Rating']],
        body: ratedTableData,
        theme: 'striped',
        headStyles: {
          fillColor: yellowColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          3: { halign: 'center' }
        },
        margin: { left: leftMargin, right: 20 }
      });
    }
  }

  // ===== FOOTER ON LAST PAGE =====
  const footerY = pageHeight - 30;

  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('VIDA VIEW - Premium Apartment Living', pageWidth / 2, footerY, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(...lightColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Jl. Topaz Raya Masale, Panakkukang Kota Makassar, Sulawesi Selatan 90215', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.text('Email: info@vidaview.com | Telp: (021) 1234-5678', pageWidth / 2, footerY + 10, { align: 'center' });

  // Divider
  doc.setDrawColor(...lightColor);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, footerY + 15, rightMargin, footerY + 15);

  doc.setFontSize(7);
  doc.text('Dokumen ini digenerate secara otomatis oleh sistem', pageWidth / 2, footerY + 20, { align: 'center' });

  // Save
  const fileName = `Laporan-Vida-View-${currentDate.replace(/\s+/g, '-')}.pdf`;
  doc.save(fileName);
};

export const exportReportExcel = (occupancyData, revenueData, topApartments, selectedYear) => {
  const workbook = XLSX.utils.book_new();

  // ===== SHEET 1: OCCUPANCY =====
  if (occupancyData) {
    const occupancySheet = [];

    // Header
    occupancySheet.push(['LAPORAN OKUPANSI VIDA VIEW']);
    occupancySheet.push([]);

    // Summary
    occupancySheet.push(['RINGKASAN']);
    occupancySheet.push(['Total Unit', occupancyData.summary.total]);
    occupancySheet.push(['Unit Terisi', occupancyData.summary.occupied]);
    occupancySheet.push(['Unit Tersedia', occupancyData.summary.available]);
    occupancySheet.push(['Tingkat Okupansi', `${occupancyData.summary.occupancy_rate}%`]);
    occupancySheet.push([]);

    // By Type
    if (occupancyData.by_type && Object.keys(occupancyData.by_type).length > 0) {
      occupancySheet.push(['OKUPANSI PER TIPE UNIT']);
      occupancySheet.push(['Tipe Unit', 'Total', 'Terisi', 'Tersedia', 'Okupansi']);

      Object.entries(occupancyData.by_type).forEach(([type, data]) => {
        occupancySheet.push([
          type,
          data.total,
          data.occupied,
          data.available,
          `${Math.round((data.occupied / data.total) * 100)}%`
        ]);
      });
    }

    const ws1 = XLSX.utils.aoa_to_sheet(occupancySheet);

    // Styling
    ws1['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, ws1, 'Okupansi');
  }

  // ===== SHEET 2: REVENUE =====
  if (revenueData) {
    const revenueSheet = [];

    // Header
    revenueSheet.push([`LAPORAN PENDAPATAN VIDA VIEW ${selectedYear}`]);
    revenueSheet.push([]);

    // Total
    revenueSheet.push(['Total Pendapatan', revenueData.total_revenue]);
    revenueSheet.push([]);

    // Monthly
    revenueSheet.push(['PENDAPATAN BULANAN']);
    revenueSheet.push(['Bulan', 'Pendapatan']);

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    Object.entries(revenueData.monthly_data).forEach(([month, value]) => {
      revenueSheet.push([
        monthNames[parseInt(month) - 1],
        value
      ]);
    });

    const ws2 = XLSX.utils.aoa_to_sheet(revenueSheet);

    // Styling
    ws2['!cols'] = [
      { wch: 20 },
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(workbook, ws2, 'Pendapatan');
  }

  // ===== SHEET 3: TOP APARTMENTS =====
  if (topApartments) {
    const topSheet = [];

    // Most Viewed
    if (topApartments.most_viewed && topApartments.most_viewed.length > 0) {
      topSheet.push(['UNIT PALING BANYAK DILIHAT']);
      topSheet.push(['Rank', 'Unit', 'Tipe', 'Total Views']);

      topApartments.most_viewed.forEach((apt, index) => {
        topSheet.push([
          index + 1,
          apt.unit_number,
          apt.unit_type,
          apt.total_views || 0
        ]);
      });

      topSheet.push([]);
      topSheet.push([]);
    }

    // Highest Rated
    if (topApartments.highest_rated && topApartments.highest_rated.length > 0) {
      topSheet.push(['UNIT RATING TERTINGGI']);
      topSheet.push(['Rank', 'Unit', 'Tipe', 'Rating']);

      topApartments.highest_rated.forEach((apt, index) => {
        topSheet.push([
          index + 1,
          apt.unit_number,
          apt.unit_type,
          apt.avg_rating
        ]);
      });
    }

    const ws3 = XLSX.utils.aoa_to_sheet(topSheet);

    // Styling
    ws3['!cols'] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, ws3, 'Unit Terpopuler');
  }

  // Save
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const fileName = `Laporan-Vida-View-${currentDate.replace(/\s+/g, '-')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export default {
  exportReportPDF,
  exportReportExcel
};
