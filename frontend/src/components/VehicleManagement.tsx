import { useState } from 'react';
import { Truck, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useVehicleList } from '../hooks/useVehicleList';

export default function VehicleManagement() {
  const { vehicles, addVehicle, deleteVehicle } = useVehicleList();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim().toUpperCase();

    if (!trimmed) {
      setError('Vehicle number cannot be empty.');
      return;
    }

    if (vehicles.some((v) => v.toUpperCase() === trimmed)) {
      setError(`Vehicle "${trimmed}" already exists in the list.`);
      return;
    }

    addVehicle(trimmed);
    setInputValue('');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Card className="form-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          Vehicle Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Vehicle Form */}
        <div className="space-y-2">
          <Label htmlFor="vehicleInput" className="form-label">
            Add Vehicle Number
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                id="vehicleInput"
                type="text"
                placeholder="e.g. MH-01-AB-1234"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={`form-input ${error ? 'border-destructive' : ''}`}
              />
              {error && (
                <p className="form-error flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}
            </div>
            <Button
              type="button"
              onClick={handleAdd}
              className="btn-primary flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Saved Vehicles
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'})
              </span>
            </h3>
          </div>

          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-lg bg-muted/30">
              <Truck className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No vehicles added yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Add a vehicle number above to get started
              </p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      #
                    </th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Vehicle Number
                    </th>
                    <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, index) => (
                    <tr
                      key={vehicle}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground text-xs">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground tracking-wide">
                        {vehicle}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="ml-1 text-xs">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Vehicle?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{' '}
                                <span className="font-semibold text-foreground">{vehicle}</span>{' '}
                                from the vehicle list? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteVehicle(vehicle)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
