import { useState, useEffect, useCallback } from 'react';
import type { TripRecord, TripFormValues, TripFormErrors } from '../types/trip';

const defaultValues: TripFormValues = {
  date: new Date().toISOString().split('T')[0],
  orderId: '',
  from: '',
  to: '',
  extraCharge: '0',
  remarks: '',
  amount: '',
};

function generateId(): string {
  return `trip_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useTripForm(
  trips: TripRecord[],
  editingTrip: TripRecord | null,
  onSubmit: (trip: TripRecord) => void,
  onCancel: () => void
) {
  const [values, setValues] = useState<TripFormValues>(defaultValues);
  const [errors, setErrors] = useState<TripFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate form when editing
  useEffect(() => {
    if (editingTrip) {
      setValues({
        date: editingTrip.date,
        orderId: editingTrip.orderId,
        from: editingTrip.from ?? '',
        to: editingTrip.to ?? '',
        extraCharge: String(editingTrip.extraCharge),
        remarks: editingTrip.remarks,
        amount: String(editingTrip.amount),
      });
      setErrors({});
      setTouched({});
    } else {
      setValues(defaultValues);
      setErrors({});
      setTouched({});
    }
  }, [editingTrip]);

  // Auto-calculate total
  const amount = parseFloat(values.amount) || 0;
  const extraCharge = parseFloat(values.extraCharge) || 0;
  const total = amount + extraCharge;

  const validate = useCallback((): TripFormErrors => {
    const errs: TripFormErrors = {};

    if (!values.date) {
      errs.date = 'Date is required';
    }

    if (!values.orderId.trim()) {
      errs.orderId = 'Order ID is required';
    } else {
      // Check uniqueness
      const duplicate = trips.find(
        (t) =>
          t.orderId.toLowerCase() === values.orderId.trim().toLowerCase() &&
          t.id !== editingTrip?.id
      );
      if (duplicate) {
        errs.orderId = `Order ID "${values.orderId.trim()}" already exists`;
      }
    }

    if (!values.from.trim()) {
      errs.from = 'Origin location is required';
    }

    if (!values.to.trim()) {
      errs.to = 'Destination location is required';
    }

    if (values.extraCharge !== '' && isNaN(parseFloat(values.extraCharge))) {
      errs.extraCharge = 'Extra Charge must be a number';
    }

    if (!values.amount.trim()) {
      errs.amount = 'Amount is required';
    } else if (isNaN(parseFloat(values.amount)) || parseFloat(values.amount) < 0) {
      errs.amount = 'Amount must be a valid positive number';
    }

    return errs;
  }, [values, trips, editingTrip]);

  const handleChange = useCallback(
    (field: keyof TripFormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      // Clear error on change
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleBlur = useCallback(
    (field: keyof TripFormValues) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const errs = validate();
      setErrors((prev) => ({ ...prev, [field]: errs[field as keyof TripFormErrors] }));
    },
    [validate]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      setErrors(errs);
      setTouched({ date: true, orderId: true, from: true, to: true, extraCharge: true, amount: true });

      if (Object.keys(errs).length > 0) return;

      const trip: TripRecord = {
        id: editingTrip?.id ?? generateId(),
        date: values.date,
        orderId: values.orderId.trim(),
        from: values.from.trim(),
        to: values.to.trim(),
        extraCharge: parseFloat(values.extraCharge) || 0,
        remarks: values.remarks.trim(),
        amount: parseFloat(values.amount),
        total,
        createdAt: editingTrip?.createdAt ?? Date.now(),
      };

      onSubmit(trip);
      setValues(defaultValues);
      setErrors({});
      setTouched({});
    },
    [validate, values, total, editingTrip, onSubmit]
  );

  const handleCancel = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
    setTouched({});
    onCancel();
  }, [onCancel]);

  return {
    values,
    errors,
    touched,
    total,
    handleChange,
    handleBlur,
    handleSubmit,
    handleCancel,
  };
}
