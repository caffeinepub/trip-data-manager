import { useState, useCallback } from 'react';

const STORAGE_KEY = 'vehicleList';

function loadVehicles(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVehicles(vehicles: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

export function useVehicleList() {
  const [vehicles, setVehicles] = useState<string[]>(() => loadVehicles());

  const addVehicle = useCallback((vehicleNumber: string) => {
    const trimmed = vehicleNumber.trim().toUpperCase();
    if (!trimmed) return false;
    setVehicles((prev) => {
      if (prev.some((v) => v.toUpperCase() === trimmed)) return prev;
      const updated = [...prev, trimmed];
      saveVehicles(updated);
      return updated;
    });
    return true;
  }, []);

  const deleteVehicle = useCallback((vehicleNumber: string) => {
    setVehicles((prev) => {
      const updated = prev.filter((v) => v !== vehicleNumber);
      saveVehicles(updated);
      return updated;
    });
  }, []);

  return { vehicles, addVehicle, deleteVehicle };
}
