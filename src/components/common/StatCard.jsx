import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = '#eff6ff',
  iconColor = '#2563eb',
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  action, // { text, icon: IconComponent, onClick, title }
}) => {
  return (
    <div className="stat-card">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-muted fw-medium text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div className="d-flex align-items-center gap-2">
          {action && (
            <button
              type="button"
              className="btn btn-sm btn-light border py-0 px-2 text-primary d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem', height: '24px' }}
              onClick={action.onClick}
              title={action.title || action.text}
            >
              {action.icon && <action.icon size={10} />}
              <span>{action.text}</span>
            </button>
          )}
          {Icon && (
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: iconBg, color: iconColor }}
            >
              <Icon />
            </div>
          )}
        </div>
      </div>

      <div className="stat-val mb-1">{value}</div>

      <div className="d-flex align-items-center justify-content-between mt-2">
        {subtitle && (
          <span className="text-muted" style={{ fontSize: '0.825rem' }}>
            {subtitle}
          </span>
        )}
        {trend && (
          <span
            className={`badge rounded-pill fw-medium ${
              trendType === 'positive'
                ? 'bg-success-subtle text-success border border-success-subtle'
                : trendType === 'negative'
                ? 'bg-danger-subtle text-danger border border-danger-subtle'
                : 'bg-light text-muted border'
            }`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
