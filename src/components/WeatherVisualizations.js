import React, { useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, BarElement, Title } from 'chart.js';
import { Paper, Typography } from '@mui/material';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, Title);

const WeatherVisualization = ({ forecastData, unit }) => {
  const lineRef = useRef(null);
  const barRef = useRef(null);

  // Extract daily summaries from forecast data
  const dailySummaries = forecastData.reduce((acc, current) => {
    const date = current.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = { temp_min: [], temp_max: [], temp: [] };
    }
    acc[date].temp_min.push(current.main.temp_min);
    acc[date].temp_max.push(current.main.temp_max);
    acc[date].temp.push(current.main.temp);
    return acc;
  }, {});

  const dates = Object.keys(dailySummaries);
  const avgTemps = dates.map(date => 
    dailySummaries[date].temp.reduce((sum, t) => sum + t, 0) / dailySummaries[date].temp.length
  );
  const minTemps = dates.map(date => Math.min(...dailySummaries[date].temp_min));
  const maxTemps = dates.map(date => Math.max(...dailySummaries[date].temp_max));

  // Temperature data for charts with clearer and predominant colors
  const tempDataLine = {
    labels: dates,
    datasets: [
      {
        label: `Average Temperature (${unit})`,
        data: avgTemps,
        borderColor: 'rgba(0, 123, 255, 1)', // Bright blue
        backgroundColor: 'rgba(0, 123, 255, 0.2)', // Light blue for area fill
        fill: true,
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(0, 123, 255, 1)', // Same color as line
      },
      {
        label: `Min Temperature (${unit})`,
        data: minTemps,
        borderColor: 'rgba(40, 167, 69, 1)', // Bright green
        backgroundColor: 'rgba(40, 167, 69, 0.2)', // Light green for area fill
        fill: true,
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(40, 167, 69, 1)', // Same color as line
      },
      {
        label: `Max Temperature (${unit})`,
        data: maxTemps,
        borderColor: 'rgba(255, 7, 7, 1)', // Bright red
        backgroundColor: 'rgba(255, 7, 7, 0.2)', // Light red for area fill
        fill: true,
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(255, 7, 7, 1)', // Same color as line
      },
    ],
  };

  const tempDataBar = {
    labels: dates,
    datasets: [
      {
        label: `Min Temperature (${unit})`,
        data: minTemps,
        backgroundColor: 'rgba(40, 167, 69, 0.6)', // Semi-transparent green
        borderColor: 'rgba(40, 167, 69, 1)', // Bright green
        borderWidth: 1,
      },
      {
        label: `Max Temperature (${unit})`,
        data: maxTemps,
        backgroundColor: 'rgba(255, 7, 7, 0.6)', // Semi-transparent red
        borderColor: 'rgba(255, 7, 7, 1)', // Bright red
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average, Min, and Max Temperature',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Min and Max Temperatures',
      },
    },
  };

  return (
    <Paper style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h6">Daily Weather Summaries</Typography>
      
      {/* Color Description Section */}
      <Typography variant="body2" style={{ marginBottom: '16px' }}>
        <strong>Line Chart:</strong><br />
        <span style={{ color: 'rgba(0, 123, 255, 1)' }}>●</span> Average Temperature<br />
        <span style={{ color: 'rgba(40, 167, 69, 1)' }}>●</span> Min Temperature<br />
        <span style={{ color: 'rgba(255, 7, 7, 1)' }}>●</span> Max Temperature<br />
        <strong>Bar Chart:</strong><br />
        <span style={{ color: 'rgba(40, 167, 69, 0.6)' }}>●</span> Min Temperature<br />
        <span style={{ color: 'rgba(255, 7, 7, 0.6)' }}>●</span> Max Temperature
      </Typography>

      <div style={{ height: '400px', marginBottom: '20px' }}>
        <Line ref={lineRef} data={tempDataLine} options={lineOptions} />
      </div>
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <Bar ref={barRef} data={tempDataBar} options={barOptions} />
      </div>
    </Paper>
  );
};

export default WeatherVisualization;
