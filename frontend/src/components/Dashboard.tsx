import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '../hooks/useDashboardStats';
import TripCostChart from './TripCostChart';
import type { TripRecord } from '../types/trip';
import { formatINR, formatMonth } from '../utils/formatCurrency';

interface DashboardProps {
  trips: TripRecord[];
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function Dashboard({ trips }: DashboardProps) {
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'monthly'>('all');

  const effectiveDate = activeFilter === 'daily' ? filterDate : '';
  const effectiveMonth = activeFilter === 'monthly' ? filterMonth : '';

  const { stats, statusBreakdown, chartData } = useDashboardStats(trips, effectiveDate, effectiveMonth);

  const handleFilterAll = () => {
    setActiveFilter('all');
    setFilterDate('');
    setFilterMonth('');
  };

  const handleFilterDaily = () => {
    setActiveFilter('daily');
    if (!filterDate) setFilterDate(new Date().toISOString().split('T')[0]);
    setFilterMonth('');
  };

  const handleFilterMonthly = () => {
    setActiveFilter('monthly');
    if (!filterMonth) setFilterMonth(getCurrentMonth());
    setFilterDate('');
  };

  const filterLabel =
    activeFilter === 'daily' && filterDate
      ? `Daily: ${filterDate}`
      : activeFilter === 'monthly' && filterMonth
      ? `Monthly: ${formatMonth(filterMonth)}`
      : 'All Time';

  return (
    <div className="space-y-5">
      {/* Filter Controls */}
      <Card className="filter-card">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                onClick={handleFilterAll}
                className={activeFilter === 'all' ? 'btn-filter-active' : 'btn-filter'}
              >
                All Time
              </Button>
              <Button
                size="sm"
                variant={activeFilter === 'daily' ? 'default' : 'outline'}
                onClick={handleFilterDaily}
                className={activeFilter === 'daily' ? 'btn-filter-active' : 'btn-filter'}
              >
                Daily
              </Button>
              <Button
                size="sm"
                variant={activeFilter === 'monthly' ? 'default' : 'outline'}
                onClick={handleFilterMonthly}
                className={activeFilter === 'monthly' ? 'btn-filter-active' : 'btn-filter'}
              >
                Monthly
              </Button>
            </div>

            {activeFilter === 'daily' && (
              <div className="flex items-end gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Select Date</Label>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="h-8 text-sm w-40"
                  />
                </div>
              </div>
            )}

            {activeFilter === 'monthly' && (
              <div className="flex items-end gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Select Month</Label>
                  <Input
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="h-8 text-sm w-40"
                  />
                </div>
              </div>
            )}

            <div className="ml-auto">
              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {filterLabel}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="🚗"
          label="Total Trips"
          value={String(stats.totalTrips)}
          isCount
          color="amber"
        />
        <StatCard
          icon="💰"
          label="Total Amount"
          value={formatINR(stats.totalAmount)}
          color="green"
        />
        <StatCard
          icon="➕"
          label="Extra Charges"
          value={formatINR(stats.totalExtraCharges)}
          color="orange"
        />
        <StatCard
          icon="🏆"
          label="Grand Total"
          value={formatINR(stats.grandTotal)}
          color="red"
          highlight
        />
      </div>

      {/* Status Breakdown Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatusCard
          icon="⏳"
          label="Pending"
          value={statusBreakdown.pendingCount}
          color="amber"
        />
        <StatusCard
          icon="✅"
          label="Completed"
          value={statusBreakdown.completedCount}
          color="green"
        />
        <StatusCard
          icon="❌"
          label="Cancelled"
          value={statusBreakdown.cancelledCount}
          color="red"
        />
      </div>

      {/* Chart */}
      <TripCostChart data={chartData} />
    </div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  isCount?: boolean;
  color: 'amber' | 'green' | 'orange' | 'red';
  highlight?: boolean;
}

function StatCard({ icon, label, value, color, highlight }: StatCardProps) {
  const colorMap = {
    amber: 'stat-card-amber',
    green: 'stat-card-green',
    orange: 'stat-card-orange',
    red: 'stat-card-red',
  };

  return (
    <Card className={`stat-card ${colorMap[color]} ${highlight ? 'stat-card-highlight' : ''}`}>
      <CardHeader className="pb-1 pt-4 px-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl">{icon}</span>
          {highlight && (
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Grand
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </CardContent>
    </Card>
  );
}

interface StatusCardProps {
  icon: string;
  label: string;
  value: number;
  color: 'amber' | 'green' | 'red';
}

function StatusCard({ icon, label, value, color }: StatusCardProps) {
  const colorStyles = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  const valueStyles = {
    amber: 'text-amber-700',
    green: 'text-green-700',
    red: 'text-red-700',
  };

  return (
    <Card className={`border ${colorStyles[color]}`}>
      <CardContent className="px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide opacity-70`}>{label}</p>
          <p className={`text-2xl font-bold ${valueStyles[color]}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
