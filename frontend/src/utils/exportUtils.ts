import type { TripRecord, DashboardStats } from '../types/trip';
import { formatDate } from './formatCurrency';

/**
 * Export trips to CSV (Excel-compatible)
 */
export function exportToExcel(trips: TripRecord[], stats: DashboardStats, reportDate: string): void {
  const headers = ['Date', 'Order ID', 'From', 'To', 'Extra Charge (₹)', 'Remarks', 'Amount (₹)', 'Total (₹)'];

  const rows = trips.map((t) => [
    formatDate(t.date),
    t.orderId,
    t.from ?? '',
    t.to ?? '',
    t.extraCharge.toFixed(2),
    t.remarks,
    t.amount.toFixed(2),
    t.total.toFixed(2),
  ]);

  // Summary rows
  const summaryRows = [
    [],
    ['SUMMARY', '', '', '', '', '', '', ''],
    ['Report Date', formatDate(reportDate), '', '', '', '', '', ''],
    ['Number of Trips', String(stats.totalTrips), '', '', '', '', '', ''],
    ['Total Amount', '', '', '', '', '', stats.totalAmount.toFixed(2), ''],
    ['Total Extra Charges', '', '', '', stats.totalExtraCharges.toFixed(2), '', '', ''],
    ['Grand Total', '', '', '', '', '', '', stats.grandTotal.toFixed(2)],
  ];

  const allRows = [headers, ...rows, ...summaryRows];

  // Build CSV content
  const csvContent = allRows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '');
          // Escape cells containing commas, quotes, or newlines
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    )
    .join('\n');

  // Add BOM for Excel UTF-8 compatibility
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `trip-report-${reportDate}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export trips to PDF using browser print
 */
export function exportToPDF(trips: TripRecord[], stats: DashboardStats, reportDate: string): void {
  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);

  const tableRows = trips
    .map(
      (t) => `
      <tr>
        <td>${formatDate(t.date)}</td>
        <td>${t.orderId}</td>
        <td>${t.from || '—'}</td>
        <td>${t.to || '—'}</td>
        <td>${formatINR(t.extraCharge)}</td>
        <td>${t.remarks || '—'}</td>
        <td>${formatINR(t.amount)}</td>
        <td><strong>${formatINR(t.total)}</strong></td>
      </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Trip Report - ${formatDate(reportDate)}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 32px; }
        .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #d97706; padding-bottom: 16px; }
        .header h1 { font-size: 24px; color: #92400e; margin-bottom: 4px; }
        .header p { color: #6b7280; font-size: 14px; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; text-align: center; }
        .stat-card .label { font-size: 11px; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .stat-card .value { font-size: 18px; font-weight: 700; color: #78350f; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        thead tr { background: #92400e; color: white; }
        thead th { padding: 8px 6px; text-align: left; font-weight: 600; }
        tbody tr:nth-child(even) { background: #fef9f0; }
        tbody tr:nth-child(odd) { background: #ffffff; }
        tbody td { padding: 7px 6px; border-bottom: 1px solid #e5e7eb; }
        .footer { margin-top: 24px; text-align: center; font-size: 11px; color: #9ca3af; }
        @media print {
          body { padding: 16px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚗 Trip Daily Report</h1>
        <p>Report Date: ${formatDate(reportDate)} &nbsp;|&nbsp; Generated: ${new Date().toLocaleString('en-IN')}</p>
      </div>
      <div class="summary">
        <div class="stat-card">
          <div class="label">Total Trips</div>
          <div class="value">${stats.totalTrips}</div>
        </div>
        <div class="stat-card">
          <div class="label">Total Amount</div>
          <div class="value">${formatINR(stats.totalAmount)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Extra Charges</div>
          <div class="value">${formatINR(stats.totalExtraCharges)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Grand Total</div>
          <div class="value">${formatINR(stats.grandTotal)}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Order ID</th>
            <th>From</th>
            <th>To</th>
            <th>Extra Charge</th>
            <th>Remarks</th>
            <th>Amount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows || '<tr><td colspan="8" style="text-align:center;padding:20px;color:#9ca3af;">No trips found for this date</td></tr>'}
        </tbody>
      </table>
      <div class="footer">
        <p>Trip Data Manager &mdash; Built with caffeine.ai</p>
      </div>
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
