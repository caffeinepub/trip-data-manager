import type { TripRecord } from '../types/trip';

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function exportToExcel(trips: TripRecord[], filename = 'trip-report'): void {
  const headers = [
    'Date',
    'Order ID',
    'Vehicle Number',
    'From',
    'To',
    'Amount (₹)',
    'Extra Charge (₹)',
    'Total (₹)',
    'Remarks',
  ];

  const rows = trips.map((trip) => [
    trip.date,
    trip.orderId,
    trip.vehicleNumber ?? '',
    trip.from ?? '',
    trip.to ?? '',
    trip.amount.toFixed(2),
    trip.extraCharge.toFixed(2),
    trip.total.toFixed(2),
    trip.remarks,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          // Escape cells that contain commas, quotes, or newlines
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(
  trips: TripRecord[],
  period: string,
  filename = 'trip-report'
): void {
  const totalAmount = trips.reduce((sum, t) => sum + t.amount, 0);
  const totalExtra = trips.reduce((sum, t) => sum + t.extraCharge, 0);
  const grandTotal = trips.reduce((sum, t) => sum + t.total, 0);

  const tableRows = trips
    .map(
      (trip, i) => `
      <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
        <td>${formatDate(trip.date)}</td>
        <td>${trip.orderId}</td>
        <td>${trip.vehicleNumber ?? ''}</td>
        <td>${trip.from ?? ''}</td>
        <td>${trip.to ?? ''}</td>
        <td class="num">${formatINR(trip.amount)}</td>
        <td class="num">${trip.extraCharge > 0 ? formatINR(trip.extraCharge) : '—'}</td>
        <td class="num total-cell">${formatINR(trip.total)}</td>
        <td>${trip.remarks || '—'}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Trip Report – ${period}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a1a; padding: 24px; }
    h1 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { font-size: 12px; color: #555; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #1e3a5f; color: #fff; padding: 7px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    tr.even td { background: #f9fafb; }
    tr.odd td { background: #ffffff; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .total-cell { font-weight: 700; color: #1e3a5f; }
    .summary { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px; }
    .summary-box { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 16px; min-width: 140px; }
    .summary-box .label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-box .value { font-size: 15px; font-weight: 700; color: #1e3a5f; margin-top: 2px; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <h1>Trip Report</h1>
  <p class="subtitle">Period: ${period} &nbsp;|&nbsp; Generated: ${new Date().toLocaleString('en-IN')} &nbsp;|&nbsp; Total Records: ${trips.length}</p>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Order ID</th>
        <th>Vehicle No.</th>
        <th>From</th>
        <th>To</th>
        <th>Amount</th>
        <th>Extra Charge</th>
        <th>Total</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-box">
      <div class="label">Total Trips</div>
      <div class="value">${trips.length}</div>
    </div>
    <div class="summary-box">
      <div class="label">Total Amount</div>
      <div class="value">${formatINR(totalAmount)}</div>
    </div>
    <div class="summary-box">
      <div class="label">Total Extra Charges</div>
      <div class="value">${formatINR(totalExtra)}</div>
    </div>
    <div class="summary-box">
      <div class="label">Grand Total</div>
      <div class="value">${formatINR(grandTotal)}</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      setTimeout(() => {
        win.print();
        URL.revokeObjectURL(url);
      }, 500);
    };
  } else {
    // Fallback: download the HTML file
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
