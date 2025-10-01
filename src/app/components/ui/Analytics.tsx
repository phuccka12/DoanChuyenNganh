'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ value, duration = 1000, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className="font-bold">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

interface TrendIndicatorProps {
  trend: string;
  className?: string;
}

export function TrendIndicator({ trend, className = '' }: TrendIndicatorProps) {
  const isPositive = trend.startsWith('+');
  const isNegative = trend.startsWith('-');
  // const isNeutral = trend === '0%' || trend === '0';

  const getIcon = () => {
    if (isPositive) return <TrendingUp className="w-3 h-3" />;
    if (isNegative) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getColor = () => {
    if (isPositive) return 'text-green-600';
    if (isNegative) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${getColor()} ${className}`}>
      {getIcon()}
      {trend}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ 
  value, 
  max, 
  color = 'blue', 
  showPercentage = true,
  height = 'md' 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{value.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  suffix?: string;
  prefix?: string;
}

export function MetricCard({ 
  title, 
  value, 
  previousValue, 
  icon, 
  color, 
  suffix = '', 
  prefix = '' 
}: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  const calculateTrend = () => {
    if (!previousValue || previousValue === 0) return '0%';
    const change = ((value - previousValue) / previousValue) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
          </p>
          {previousValue !== undefined && (
            <TrendIndicator trend={calculateTrend()} />
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function LoadingSpinner({ size = 'md', color = 'blue' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    purple: 'border-purple-600',
    orange: 'border-orange-600'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`} />
  );
}