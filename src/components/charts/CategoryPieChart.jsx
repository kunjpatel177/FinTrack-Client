import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_COLORS = [
  '#f97316',
  '#06b6d4',
  '#ec4899',
  '#eab308',
  '#8b5cf6',
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#6366f1',
  '#64748b',
];

const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-3 shadow-sm" style={{ fontSize: '0.85rem' }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <span
            className="rounded-circle d-inline-block"
            style={{ width: '10px', height: '10px', backgroundColor: data.color || '#3b82f6' }}
          />
          <span className="fw-semibold text-dark">{data.name}</span>
        </div>
        <div className="fw-bold text-dark fs-6">{formatCurrency(data.amount, currency)}</div>
        {data.count && (
          <div className="text-muted small">{data.count} transaction{data.count > 1 ? 's' : ''}</div>
        )}
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({ data = [], height = 300 }) => {
  const { currency } = useAuth();

  if (!data || data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center text-muted" style={{ height }}>
        No category expenses recorded for this period
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="row align-items-center" style={{ minHeight: height }}>
      <div className="col-sm-7" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="amount"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Legends List */}
      <div className="col-sm-5 ps-sm-0 pe-3">
        <div className="overflow-y-auto pe-1" style={{ maxHeight: '240px' }}>
          {data.map((item, idx) => {
            const pct = total > 0 ? Math.round((item.amount / total) * 100) : 0;
            return (
              <div
                key={`legend-${idx}`}
                className="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom border-light"
                style={{ fontSize: '0.825rem' }}
              >
                <div className="d-flex align-items-center gap-2 text-truncate me-2">
                  <span
                    className="rounded-circle flex-shrink-0"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
                    }}
                  />
                  <span className="text-truncate text-muted">{item.name}</span>
                </div>
                <div className="text-end flex-shrink-0">
                  <span className="fw-semibold text-dark">{formatCurrency(item.amount, currency)}</span>
                  <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
