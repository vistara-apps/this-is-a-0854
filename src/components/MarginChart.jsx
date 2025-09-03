import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MarginChart = ({ variant = 'realtime' }) => {
  // Mock data for demonstration
  const generateData = (points = 30) => {
    const data = [];
    const baseValue = 50000;
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setHours(date.getHours() - (points - i));
      
      data.push({
        time: date.getHours() + ':00',
        margin: baseValue + Math.random() * 10000 - 5000,
        yield: 1000 + Math.random() * 500,
        collateral: 67000 + Math.random() * 5000,
      });
    }
    return data;
  };

  const data = generateData(variant === 'realtime' ? 24 : 30);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect p-4 rounded-lg border border-dark-border">
          <p className="text-dark-text font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (variant === 'realtime') {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(240, 20%, 25%, 0.5)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(0 0% 70%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(0 0% 70%)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="margin" 
              stroke="hsl(170 70% 40%)" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(170 70% 40%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(170 70% 40%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsla(240, 20%, 25%, 0.5)" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(0 0% 70%)"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(0 0% 70%)"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="yield"
            stroke="hsl(170 70% 40%)"
            fillOpacity={1}
            fill="url(#yieldGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarginChart;