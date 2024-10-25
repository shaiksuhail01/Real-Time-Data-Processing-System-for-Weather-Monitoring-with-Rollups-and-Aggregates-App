import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const Forecast = ({ forecastData, unit }) => {
  // Function to convert temperature to the specified unit
  const convertTemp = (temp, unit) => {
    if (unit === 'imperial') return (temp * 9 / 5 + 32).toFixed(2); // Convert to Fahrenheit
    if (unit === 'standard') return (temp + 273.15).toFixed(2); // Convert to Kelvin
    return temp.toFixed(2); // Assume metric (Celsius)
  };

  // Function to get the correct unit symbol based on the unit type
  const getUnitSymbol = (unit) => {
    switch (unit) {
      case 'metric':
        return '°C';
      case 'imperial':
        return '°F';
      case 'standard':
        return 'K';
      default:
        return '';
    }
  };

  const unitSymbol = getUnitSymbol(unit); // Get the appropriate unit symbol

  // Aggregate daily data
  const dailyAggregates = forecastData.reduce((acc, curr) => {
    const date = curr.dt_txt.split(' ')[0];

    if (!acc[date]) {
      acc[date] = {
        temps: [],
        maxTemp: -Infinity,
        minTemp: Infinity,
        weatherConditions: []
      };
    }

    acc[date].temps.push(curr.main.temp);
    acc[date].maxTemp = Math.max(acc[date].maxTemp, curr.main.temp);
    acc[date].minTemp = Math.min(acc[date].minTemp, curr.main.temp);
    acc[date].weatherConditions.push(curr.weather[0].main); // Capture the main weather condition

    return acc;
  }, {});

  // Calculate dominant weather condition for each day
  const dominantConditions = Object.keys(dailyAggregates).map(date => {
    const conditions = dailyAggregates[date].weatherConditions;
    const conditionCount = conditions.reduce((acc, condition) => {
      acc[condition] = (acc[condition] || 0) + 1; // Count occurrences
      return acc;
    }, {});

    // Get the dominant condition (most frequent)
    return Object.keys(conditionCount).reduce((a, b) => 
      conditionCount[a] > conditionCount[b] ? a : b
    );
  });

  return (
    <div>
      <Typography variant="h5">5-Day Forecast</Typography>
      <Grid container spacing={2}>
        {Object.keys(dailyAggregates).slice(0, 5).map((date, index) => {
          const { temps, maxTemp, minTemp } = dailyAggregates[date];
          const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

          return (
            <Grid item xs={12} sm={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{date}</Typography>
                  <Typography>Avg Temp: {convertTemp(avgTemp, unit)} {unitSymbol}</Typography>
                  <Typography>Max Temp: {convertTemp(maxTemp, unit)} {unitSymbol}</Typography>
                  <Typography>Min Temp: {convertTemp(minTemp, unit)} {unitSymbol}</Typography>
                  <Typography>Dominant Weather: {dominantConditions[index]}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Forecast;
