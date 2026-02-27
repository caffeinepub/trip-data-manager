import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TripRecord, DashboardStats } from '../types/trip';
import { formatINR, formatDate } from '../utils/formatCurrency';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

interface DateRangeReportProps {
  trips: TripRecord[];
}

interface ValidationErrors {
  fromDate?: string;
  toDate?: string;
}

export default function DateRangeReport({ trips }: DateRangeReportProps) {
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [generated, setGenerated] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const filteredTrips = useMemo(() => {
    if (!generated) return [];
    return trips.filter((t) => t.date >= fromDate && t.date <= toDate);
  }, [trips, fromDate, toDate, generated]);

  const stats: DashboardStats = useMemo(
    () => ({
      totalTrips: filteredTrips.length,
      totalAmount: filteredTrips.reduce((s, t) => s + t.amount, 0),
      totalExtraCharges: filteredTrips.reduce((s, t) => s + t.extraCharge, 0),
      grandTotal: filteredTrips.reduce((s, t) => s + t.total, 0),
    }),
    [filteredTrips]
  );

  const statusCounts = useMemo(
    () => ({
      pending: filteredTrips.filter((t) => t.status === 'Pending').length,
      completed: filteredTrips.filter((t) => t.status === 'Complete').length,
      cancelled: filteredTrips.filter((t) => t.status === 'Cancel').length,
    }),
    [filteredTrips]
  );

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!fromDate) {
      newErrors.fromDate = 'Please select a From Date.';
    }
    if (!toDate) {
      newErrors.toDate = 'Please select a To Date.';
    }
    if (fromDate && toDate && fromDate > toDate) {
      newErrors.toDate = 'To Date must be on or after From Date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validate()) {
      setGenerated(true);
    }
  };

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    setGenerated(false);
    setErrors((prev) => ({ ...prev, fromDate: undefined }));
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    setGenerated(false);
    setErrors((prev) => ({ ...prev, toDate: undefined }));
  };

  const dateRangeLabel =
    fromDate === toDate
      ? formatDate(fromDate)
      : `${formatDate(fromDate)} – ${formatDate(toDate)}`;

  const filenameRange = `${fromDate}-to-${toDate}`;

  const handleExcelDownload = () => {
    exportToExcel(filteredTrips, `trip-report-${filenameRange}`);
  };

  const handlePDFDownload = () => {
    exportToPDF(filteredTrips, dateRangeLabel, `trip-report-${filenameRange}`);
  };

  return (
    <Card className="report-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Custom Date Range Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Date Range Selector + Generate */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className="w-44"
            />
            {errors.fromDate && (
              <p className="text-xs text-destructive mt-1">{errors.fromDate}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              className="w-44"
            />
            {errors.toDate && (
              <p className="text-xs text-destructive mt-1">{errors.toDate}</p>
            )}
          </div>
          <Button onClick={handleGenerate} className="btn-primary">
            📋 Generate Report
          </Button>
        </div>

        {/* Report Output */}
        {generated && (
          <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            {/* Summary Header */}
            <div className="report-summary-header">
              <h3 className="font-semibold text-foreground">
                Report: {dateRangeLabel}
              </h3>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ReportStatCard label="Number of Trips" value={String(stats.totalTrips)} icon="🚗" />
              <ReportStatCard label="Total Amount" value={formatINR(stats.totalAmount)} icon="💰" />
              <ReportStatCard
                label="Extra Charges"
                value={formatINR(stats.totalExtraCharges)}
                icon="➕"
              />
              <ReportStatCard
                label="Grand Total"
                value={formatINR(stats.grandTotal)}
                icon="🏆"
                highlight
              />
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <StatusStatCard label="Pending" value={statusCounts.pending} icon="⏳" color="amber" />
              <StatusStatCard label="Completed" value={statusCounts.completed} icon="✅" color="green" />
              <StatusStatCard label="Cancelled" value={statusCounts.cancelled} icon="❌" color="red" />
            </div>

            {/* Trip Details Table */}
            {filteredTrips.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header-row">
                      <TableHead className="table-head">#</TableHead>
                      <TableHead className="table-head">Date</TableHead>
                      <TableHead className="table-head">Order ID</TableHead>
                      <TableHead className="table-head">Vehicle No.</TableHead>
                      <TableHead className="table-head">From</TableHead>
                      <TableHead className="table-head">To</TableHead>
                      <TableHead className="table-head text-right">Amount</TableHead>
                      <TableHead className="table-head text-right">Extra Charge</TableHead>
                      <TableHead className="table-head">Remarks</TableHead>
                      <TableHead className="table-head text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrips.map((trip, idx) => (
                      <TableRow
                        key={trip.id}
                        className={idx % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                      >
                        <TableCell className="table-cell text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="table-cell text-xs">{formatDate(trip.date)}</TableCell>
                        <TableCell className="table-cell">
                          <span className="order-id-badge">{trip.orderId}</span>
                        </TableCell>
                        <TableCell className="table-cell font-mono text-xs">
                          {trip.vehicleNumber || '—'}
                        </TableCell>
                        <TableCell className="table-cell text-xs">{trip.from}</TableCell>
                        <TableCell className="table-cell text-xs">{trip.to}</TableCell>
                        <TableCell className="table-cell text-right font-medium">
                          {formatINR(trip.amount)}
                        </TableCell>
                        <TableCell className="table-cell text-right">
                          {formatINR(trip.extraCharge)}
                        </TableCell>
                        <TableCell className="table-cell text-muted-foreground text-xs">
                          {trip.remarks || '—'}
                        </TableCell>
                        <TableCell className="table-cell text-right">
                          <span className="total-badge">{formatINR(trip.total)}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed border-border rounded-lg">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">No trips found for the selected date range.</p>
              </div>
            )}

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={handleExcelDownload}
                className="btn-export-excel"
                disabled={filteredTrips.length === 0}
              >
                📊 Download Excel (.csv)
              </Button>
              <Button
                variant="outline"
                onClick={handlePDFDownload}
                className="btn-export-pdf"
                disabled={filteredTrips.length === 0}
              >
                📄 Download PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ReportStatCardProps {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}

function ReportStatCard({ label, value, icon, highlight }: ReportStatCardProps) {
  return (
    <div className={`report-stat-card ${highlight ? 'report-stat-highlight' : ''}`}>
      <span className="text-xl">{icon}</span>
      <p className="report-stat-label">{label}</p>
      <p className="report-stat-value">{value}</p>
    </div>
  );
}

interface StatusStatCardProps {
  label: string;
  value: number;
  icon: string;
  color: 'amber' | 'green' | 'red';
}

function StatusStatCard({ label, value, icon, color }: StatusStatCardProps) {
  const colorStyles = {
    amber: 'bg-amber-50 border border-amber-200 text-amber-800',
    green: 'bg-green-50 border border-green-200 text-green-800',
    red: 'bg-red-50 border border-red-200 text-red-800',
  };
  const valueStyles = {
    amber: 'text-amber-700',
    green: 'text-green-700',
    red: 'text-red-700',
  };

  return (
    <div className={`rounded-lg px-4 py-3 flex items-center gap-3 ${colorStyles[color]}`}>
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
        <p className={`text-2xl font-bold ${valueStyles[color]}`}>{value}</p>
      </div>
    </div>
  );
}
