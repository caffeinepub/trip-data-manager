export type TripStatus = 'Complete' | 'Cancel' | 'Pending';

export interface TripRecord {
  id: string;
  date: string;        // ISO date string YYYY-MM-DD
  orderId: string;
  vehicleNumber: string; // vehicle registration number
  from: string;        // origin location
  to: string;          // destination location
  extraCharge: number;
  remarks: string;
  amount: number;
  total: number;       // amount + extraCharge
  createdAt: number;   // timestamp for sorting
  status: TripStatus;  // trip status
}

export interface TripFormValues {
  date: string;
  orderId: string;
  vehicleNumber: string;
  from: string;
  to: string;
  extraCharge: string;
  remarks: string;
  amount: string;
}

export interface TripFormErrors {
  date?: string;
  orderId?: string;
  vehicleNumber?: string;
  from?: string;
  to?: string;
  extraCharge?: string;
  amount?: string;
}

export interface DashboardStats {
  totalTrips: number;
  totalAmount: number;
  totalExtraCharges: number;
  grandTotal: number;
}
