import { LedgerTransaction } from '../types';

/**
 * Export ledger transactions to CSV format with UTF-8 BOM for Excel compatibility
 */
export function exportLedgerToCSV(transactions: LedgerTransaction[], filename = 'Laporan-Buku-Kas-EcoCampus-UNM.csv') {
  if (!transactions || transactions.length === 0) {
    alert('Tidak ada data transaksi untuk diekspor.');
    return;
  }

  const headers = [
    'ID Transaksi',
    'Tanggal & Waktu',
    'Nama Mahasiswa/Sivitas',
    'Fakultas',
    'Titik Setor / Drop Point',
    'Total Berat (Kg)',
    'Eco-Points',
    'Total XP',
    'Status Verifikasi',
    'Rincian Material',
    'Hash Kriptografi Transaksi',
  ];

  const rows = transactions.map((t) => {
    const details = t.items
      .map((item) => `${item.categoryName}: ${item.materialName} (${item.weightKg} kg)`)
      .join('; ');

    return [
      `"${t.id}"`,
      `"${new Date(t.timestamp).toLocaleString('id-ID')}"`,
      `"${t.userName.replace(/"/g, '""')}"`,
      `"${t.faculty.replace(/"/g, '""')}"`,
      `"${t.dropPointName.replace(/"/g, '""')}"`,
      t.totalWeightKg,
      t.totalPoints,
      t.totalXp,
      `"${t.status === 'verified' ? 'Terverifikasi' : t.status === 'flagged' ? 'Perlu Audit' : 'Menunggu'}"`,
      `"${details.replace(/"/g, '""')}"`,
      `"${t.hash}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a printable official institutional audit report in clean PDF printable format
 */
export function printOfficialAuditReport(
  transactions: LedgerTransaction[],
  options?: {
    facultyFilter?: string;
    operatorName?: string;
  }
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Izin pop-up browser dibutuhkan untuk mencetak laporan.');
    return;
  }

  const totalKg = transactions.reduce((acc, t) => acc + t.totalWeightKg, 0);
  const totalPoints = transactions.reduce((acc, t) => acc + t.totalPoints, 0);
  const verifiedCount = transactions.filter((t) => t.status === 'verified').length;
  const flaggedCount = transactions.filter((t) => t.status === 'flagged').length;
  const estimatedCo2 = (totalKg * 2.1).toFixed(1);

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Resmi Audit Buku Kas Bank Sampah - EcoCampus UNM</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #1e293b;
      margin: 24px;
      font-size: 11px;
      line-height: 1.4;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .inst-title {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .sub-title {
      font-size: 12px;
      font-weight: 600;
      color: #047857;
      margin: 2px 0 0 0;
    }
    .doc-meta {
      font-size: 10px;
      color: #64748b;
      margin-top: 4px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
      background: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .metric-card {
      text-align: center;
    }
    .metric-val {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .metric-label {
      font-size: 9px;
      color: #64748b;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 700;
      font-size: 9px;
      text-transform: uppercase;
    }
    .text-right { text-align: right; }
    .status-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: bold;
    }
    .verified { background: #d1fae5; color: #065f46; }
    .flagged { background: #fee2e2; color: #991b1b; }
    .footer {
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .signature-box {
      text-align: center;
      width: 220px;
    }
    .signature-line {
      margin-top: 50px;
      border-bottom: 1px solid #334155;
    }
    @media print {
      body { margin: 10mm; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div style="margin-bottom: 12px; display: flex; justify-content: flex-end; gap: 8px;">
    <button onclick="window.print()" style="padding: 6px 14px; background: #047857; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Cetak Laporan / Simpan PDF</button>
  </div>

  <div class="header">
    <h1 class="inst-title">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
    <div class="inst-title">UNIVERSITAS NEGERI MAKASSAR (UNM)</div>
    <div class="sub-title">UNIT PENGELOLAAN BANK SAMPAH & SUSTAINABLE CAMPUS 3R</div>
    <div class="doc-meta">Alamat: Kampus Gunungsari & Parangtambung, Jl. A. P. Pettarani / Daeng Tata Raya, Makassar</div>
    <div class="doc-meta">Dicetak pada: ${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</div>
  </div>

  <div class="summary-grid">
    <div class="metric-card">
      <div class="metric-val">${totalKg.toFixed(1)} Kg</div>
      <div class="metric-label">Total Sampah Terkelola</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${transactions.length}</div>
      <div class="metric-label">Total Transaksi Setor</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${totalPoints.toLocaleString()}</div>
      <div class="metric-label">Total Eco-Points Beredar</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${estimatedCo2} Kg</div>
      <div class="metric-label">Potensi Reduksi CO2e</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 24px;">No</th>
        <th>Waktu Setor</th>
        <th>Nasabah / Mahasiswa</th>
        <th>Fakultas</th>
        <th>Titik Penyetoran</th>
        <th class="text-right">Berat (Kg)</th>
        <th class="text-right">Eco-Points</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${transactions
        .map(
          (t, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${new Date(t.timestamp).toLocaleDateString('id-ID')} ${new Date(t.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
          <td><strong>${t.userName}</strong></td>
          <td>${t.faculty}</td>
          <td>${t.dropPointName}</td>
          <td class="text-right font-bold">${t.totalWeightKg.toFixed(1)}</td>
          <td class="text-right">${t.totalPoints}</td>
          <td><span class="status-badge ${t.status === 'verified' ? 'verified' : 'flagged'}">${t.status === 'verified' ? 'Terverifikasi' : 'Flagged'}</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <div class="signature-box">
      <div>Mengetahui,</div>
      <div>Ketua Pokja Kampus Hijau UNM</div>
      <div class="signature-line"></div>
      <div style="font-size: 10px; margin-top: 4px;">NIP. 19820512 200812 1 002</div>
    </div>
    <div class="signature-box">
      <div>Makassar, ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</div>
      <div>Petugas Auditor Bank Sampah</div>
      <div class="signature-line"></div>
      <div style="font-size: 10px; margin-top: 4px;">${options?.operatorName || 'Admin / Operator TPST UNM'}</div>
    </div>
  </div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
