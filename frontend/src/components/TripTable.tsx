import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { TripRecord } from '../types/trip';
import { formatINR, formatDate } from '../utils/formatCurrency';

interface TripTableProps {
  trips: TripRecord[];
  onEdit: (trip: TripRecord) => void;
  onDelete: (id: string) => void;
}

export default function TripTable({ trips, onEdit, onDelete }: TripTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<TripRecord | null>(null);
  const [search, setSearch] = useState('');

  const filtered = trips.filter(
    (t) =>
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.remarks.toLowerCase().includes(search.toLowerCase()) ||
      t.date.includes(search) ||
      (t.from ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (t.to ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Card className="table-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">
              All Records{' '}
              <span className="text-sm font-normal text-muted-foreground">
                ({trips.length} total)
              </span>
            </CardTitle>
            <Input
              placeholder="Search by Order ID, date, from, to, remarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm w-full sm:w-72"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm font-medium">
                {trips.length === 0 ? 'No trip records yet' : 'No records match your search'}
              </p>
              {trips.length === 0 && (
                <p className="text-xs mt-1">Add your first trip using the form above</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header-row">
                    <TableHead className="table-head">Date</TableHead>
                    <TableHead className="table-head">Order ID</TableHead>
                    <TableHead className="table-head">From</TableHead>
                    <TableHead className="table-head">To</TableHead>
                    <TableHead className="table-head text-right">Extra Charge</TableHead>
                    <TableHead className="table-head">Remarks</TableHead>
                    <TableHead className="table-head text-right">Amount</TableHead>
                    <TableHead className="table-head text-right">Total</TableHead>
                    <TableHead className="table-head text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((trip, idx) => (
                    <TableRow
                      key={trip.id}
                      className={`table-row ${idx % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}
                    >
                      <TableCell className="table-cell font-medium whitespace-nowrap">
                        {formatDate(trip.date)}
                      </TableCell>
                      <TableCell className="table-cell">
                        <span className="order-id-badge">{trip.orderId}</span>
                      </TableCell>
                      <TableCell className="table-cell max-w-[120px] truncate">
                        {trip.from || '—'}
                      </TableCell>
                      <TableCell className="table-cell max-w-[120px] truncate">
                        {trip.to || '—'}
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        {formatINR(trip.extraCharge)}
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground max-w-[140px] truncate">
                        {trip.remarks || '—'}
                      </TableCell>
                      <TableCell className="table-cell text-right font-medium">
                        {formatINR(trip.amount)}
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        <span className="total-badge">{formatINR(trip.total)}</span>
                      </TableCell>
                      <TableCell className="table-cell text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(trip)}
                            className="action-btn-edit h-7 px-2 text-xs"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteTarget(trip)}
                            className="action-btn-delete h-7 px-2 text-xs"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the trip record for Order ID{' '}
              <strong>{deleteTarget?.orderId}</strong>
              {deleteTarget?.from && deleteTarget?.to
                ? ` (${deleteTarget.from} → ${deleteTarget.to})`
                : ''}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  onDelete(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
