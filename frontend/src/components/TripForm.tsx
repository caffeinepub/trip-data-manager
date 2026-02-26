import { useTripForm } from '../hooks/useTripForm';
import { useVehicleList } from '../hooks/useVehicleList';
import type { TripRecord } from '../types/trip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatINR } from '../utils/formatCurrency';
import { AlertCircle } from 'lucide-react';

interface TripFormProps {
  trips: TripRecord[];
  editingTrip: TripRecord | null;
  onSubmit: (trip: TripRecord) => void;
  onCancel: () => void;
}

export default function TripForm({ trips, editingTrip, onSubmit, onCancel }: TripFormProps) {
  const {
    values,
    errors,
    touched,
    total,
    handleChange,
    handleBlur,
    handleSubmit,
    handleCancel,
  } = useTripForm(trips, editingTrip, onSubmit, onCancel);

  const { vehicles } = useVehicleList();

  return (
    <Card className="form-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          {editingTrip ? 'Edit Trip Record' : 'New Trip Entry'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Date */}
            <div className="form-field">
              <Label htmlFor="date" className="form-label">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={values.date}
                onChange={(e) => handleChange('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                className={`form-input ${touched.date && errors.date ? 'border-destructive' : ''}`}
              />
              {touched.date && errors.date && (
                <p className="form-error">{errors.date}</p>
              )}
            </div>

            {/* Order ID */}
            <div className="form-field">
              <Label htmlFor="orderId" className="form-label">
                Order ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="orderId"
                type="text"
                placeholder="e.g. ORD-001"
                value={values.orderId}
                onChange={(e) => handleChange('orderId', e.target.value)}
                onBlur={() => handleBlur('orderId')}
                className={`form-input ${touched.orderId && errors.orderId ? 'border-destructive' : ''}`}
              />
              {touched.orderId && errors.orderId && (
                <p className="form-error">{errors.orderId}</p>
              )}
            </div>

            {/* Vehicle Number - Dropdown */}
            <div className="form-field">
              <Label htmlFor="vehicleNumber" className="form-label">
                Vehicle Number <span className="text-destructive">*</span>
              </Label>
              {vehicles.length === 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4 shrink-0 text-warning" />
                    <span>
                      No vehicles added.{' '}
                      <span className="text-primary underline underline-offset-2 cursor-pointer hover:text-primary/80">
                        Go to Vehicles tab
                      </span>{' '}
                      to add one.
                    </span>
                  </div>
                  {touched.vehicleNumber && errors.vehicleNumber && (
                    <p className="form-error">{errors.vehicleNumber}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <Select
                    value={values.vehicleNumber}
                    onValueChange={(val) => {
                      handleChange('vehicleNumber', val);
                    }}
                  >
                    <SelectTrigger
                      id="vehicleNumber"
                      className={`form-input w-full ${
                        touched.vehicleNumber && errors.vehicleNumber ? 'border-destructive' : ''
                      }`}
                      onBlur={() => handleBlur('vehicleNumber')}
                    >
                      <SelectValue placeholder="Select Vehicle Number" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.vehicleNumber && errors.vehicleNumber && (
                    <p className="form-error">{errors.vehicleNumber}</p>
                  )}
                </div>
              )}
            </div>

            {/* From */}
            <div className="form-field">
              <Label htmlFor="from" className="form-label">
                From <span className="text-destructive">*</span>
              </Label>
              <Input
                id="from"
                type="text"
                placeholder="Origin location"
                value={values.from}
                onChange={(e) => handleChange('from', e.target.value)}
                onBlur={() => handleBlur('from')}
                className={`form-input ${touched.from && errors.from ? 'border-destructive' : ''}`}
              />
              {touched.from && errors.from && (
                <p className="form-error">{errors.from}</p>
              )}
            </div>

            {/* To */}
            <div className="form-field">
              <Label htmlFor="to" className="form-label">
                To <span className="text-destructive">*</span>
              </Label>
              <Input
                id="to"
                type="text"
                placeholder="Destination location"
                value={values.to}
                onChange={(e) => handleChange('to', e.target.value)}
                onBlur={() => handleBlur('to')}
                className={`form-input ${touched.to && errors.to ? 'border-destructive' : ''}`}
              />
              {touched.to && errors.to && (
                <p className="form-error">{errors.to}</p>
              )}
            </div>

            {/* Amount */}
            <div className="form-field">
              <Label htmlFor="amount" className="form-label">
                Amount (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                onBlur={() => handleBlur('amount')}
                className={`form-input ${touched.amount && errors.amount ? 'border-destructive' : ''}`}
              />
              {touched.amount && errors.amount && (
                <p className="form-error">{errors.amount}</p>
              )}
            </div>

            {/* Extra Charge */}
            <div className="form-field">
              <Label htmlFor="extraCharge" className="form-label">
                Extra Charge (₹)
              </Label>
              <Input
                id="extraCharge"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.extraCharge}
                onChange={(e) => handleChange('extraCharge', e.target.value)}
                onBlur={() => handleBlur('extraCharge')}
                className={`form-input ${touched.extraCharge && errors.extraCharge ? 'border-destructive' : ''}`}
              />
              {touched.extraCharge && errors.extraCharge && (
                <p className="form-error">{errors.extraCharge}</p>
              )}
            </div>

            {/* Total (read-only) */}
            <div className="form-field">
              <Label htmlFor="total" className="form-label">
                Total (Auto-calculated)
              </Label>
              <div className="total-display">
                <span className="total-value">{formatINR(total)}</span>
                <span className="total-hint">Amount + Extra Charge</span>
              </div>
            </div>

            {/* Remarks */}
            <div className="form-field md:col-span-2 lg:col-span-3">
              <Label htmlFor="remarks" className="form-label">
                Remarks
              </Label>
              <Textarea
                id="remarks"
                placeholder="Optional notes..."
                value={values.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                className="form-input resize-none h-[42px] min-h-[42px]"
                rows={1}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
            <Button type="submit" className="btn-primary">
              {editingTrip ? '💾 Update Trip' : '➕ Add Trip'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="btn-cancel"
            >
              {editingTrip ? 'Cancel' : '← Back to Dashboard'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
