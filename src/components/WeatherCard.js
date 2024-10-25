import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const WeatherCard = ({ weatherData, unit }) => {
  const { name } = weatherData.city;
  const { temp, feels_like, humidity } = weatherData.list[0].main;
  const { speed } = weatherData.list[0].wind;
  const { description, icon } = weatherData.list[0].weather[0];

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

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Weather in {name}</Typography>
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h1">
            {convertTemp(temp, unit)} {unitSymbol}
          </Typography>
          <Typography variant="h6">
            Feels like: {convertTemp(feels_like, unit)} {unitSymbol}
          </Typography>
        </div>
        <Typography>Humidity: {humidity}%</Typography>
        <Typography>Wind speed: {speed} km/h</Typography>
        <img
          src={`https://openweathermap.org/img/wn/${icon}.png`}
          alt={description}
        />
        <Typography>{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
