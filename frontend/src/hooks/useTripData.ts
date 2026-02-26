import { useState, useEffect, useCallback } from 'react';
import type { TripRecord } from '../types/trip';

const STORAGE_KEY = 'trip_records';

function loadFromStorage(): TripRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const records = JSON.parse(raw) as TripRecord[];
    // Backward compatibility: default missing fields to empty strings
    return records.map((r) => ({
      ...r,
      from: r.from ?? '',
      to: r.to ?? '',
      vehicleNumber: r.vehicleNumber ?? '',
    }));
  } catch {
    return [];
  }
}

function saveToStorage(trips: TripRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function useTripData() {
  const [trips, setTrips] = useState<TripRecord[]>(() => loadFromStorage());

  // Sync to localStorage whenever trips change
  useEffect(() => {
    saveToStorage(trips);
  }, [trips]);

  const addTrip = useCallback((trip: TripRecord) => {
    setTrips((prev) => {
      const updated = [...prev, trip];
      return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);

  const updateTrip = useCallback((updatedTrip: TripRecord) => {
    setTrips((prev) =>
      prev
        .map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { trips, addTrip, updateTrip, deleteTrip };
}
