import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '../utils/formatCurrency';

interface ChartDataPoint {
  date: string;
  amount: number;
  extraCharge: number;
  total: number;
}

interface TripCostChartProps {
  data: ChartDataPoint[];
}

function formatINRShort(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const formatINR = (val: number) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
      }).format(val);

    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-date">{formatDate(label || '')}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="chart-tooltip-row" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span className="font-semibold">{formatINR(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TripCostChart({ data }: TripCostChartProps) {
  if (data.length === 0) {
    return (
      <Card className="chart-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Trip Cost Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <div className="text-center">
              <p className="text-4xl mb-2">📊</p>
              <p className="text-sm">No data available for the selected period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: d.date,
  }));

  return (
    <Card className="chart-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Trip Cost Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis
              dataKey="dateLabel"
              tickFormatter={(val) => {
                const parts = val.split('-');
                return `${parts[2]}/${parts[1]}`;
              }}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              tickFormatter={formatINRShort}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            <Bar dataKey="amount" name="Amount" fill="#d97706" radius={[3, 3, 0, 0]} />
            <Bar dataKey="extraCharge" name="Extra Charge" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            <Bar dataKey="total" name="Total" fill="#92400e" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
