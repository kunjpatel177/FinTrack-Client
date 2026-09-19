import React from 'react';
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
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-3 shadow-sm" style={{ fontSize: '0.85rem' }}>
        <p className="fw-bold mb-2 text-dark">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="d-flex align-items-center justify-content-between gap-3 mb-1">
            <span style={{ color: entry.color, fontWeight: 500 }}>{entry.name}:</span>
            <span className="fw-semibold text-dark">{formatCurrency(entry.value, currency)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const IncomeExpenseChart = ({ data = [], height = 300 }) => {
  const { currency } = useAuth();

  if (!data || data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center text-muted" style={{ height }}>
        No trend data available for this timeframe
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          barGap={6}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value;
            }}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '0.85rem' }}
          />
          <Bar
            dataKey="income"
            name="Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseChart;
