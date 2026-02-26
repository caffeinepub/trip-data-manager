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

interface DailyReportProps {
  trips: TripRecord[];
}

export default function DailyReport({ trips }: DailyReportProps) {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [generated, setGenerated] = useState(false);

  const filteredTrips = useMemo(
    () => trips.filter((t) => t.date === reportDate),
    [trips, reportDate]
  );

  const stats: DashboardStats = useMemo(
    () => ({
      totalTrips: filteredTrips.length,
      totalAmount: filteredTrips.reduce((s, t) => s + t.amount, 0),
      totalExtraCharges: filteredTrips.reduce((s, t) => s + t.extraCharge, 0),
      grandTotal: filteredTrips.reduce((s, t) => s + t.total, 0),
    }),
    [filteredTrips]
  );

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleExcelDownload = () => {
    exportToExcel(filteredTrips, stats, reportDate);
  };

  const handlePDFDownload = () => {
    exportToPDF(filteredTrips, stats, reportDate);
  };

  return (
    <Card className="report-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">End of Day Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Date Selector + Generate */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Report Date</Label>
            <Input
              type="date"
              value={reportDate}
              onChange={(e) => {
                setReportDate(e.target.value);
                setGenerated(false);
              }}
              className="w-44"
            />
          </div>
          <Button onClick={handleGenerate} className="btn-primary">
            📋 Generate Daily Report
          </Button>
        </div>

        {/* Report Output */}
        {generated && (
          <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            {/* Summary Stats */}
            <div className="report-summary-header">
              <h3 className="font-semibold text-foreground">
                Report for {formatDate(reportDate)}
              </h3>
            </div>

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

            {/* Trip Details Table */}
            {filteredTrips.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header-row">
                      <TableHead className="table-head">#</TableHead>
                      <TableHead className="table-head">Order ID</TableHead>
                      <TableHead className="table-head text-right">Extra Charge</TableHead>
                      <TableHead className="table-head">Remarks</TableHead>
                      <TableHead className="table-head text-right">Amount</TableHead>
                      <TableHead className="table-head text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrips.map((trip, idx) => (
                      <TableRow key={trip.id} className={idx % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                        <TableCell className="table-cell text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="table-cell">
                          <span className="order-id-badge">{trip.orderId}</span>
                        </TableCell>
                        <TableCell className="table-cell text-right">
                          {formatINR(trip.extraCharge)}
                        </TableCell>
                        <TableCell className="table-cell text-muted-foreground">
                          {trip.remarks || '—'}
                        </TableCell>
                        <TableCell className="table-cell text-right font-medium">
                          {formatINR(trip.amount)}
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
                <p className="text-sm">No trips recorded for {formatDate(reportDate)}</p>
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
