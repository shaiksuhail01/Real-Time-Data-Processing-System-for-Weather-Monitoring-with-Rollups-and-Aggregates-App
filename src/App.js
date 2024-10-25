import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Button, 
  TextField, 
  Typography,
  Box
} from '@mui/material';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import WeatherVisualizations from './components/WeatherVisualizations';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('metric'); // Default unit is metric (Celsius)
  const [intervalTime, setIntervalTime] = useState(5 * 60 * 1000); // Default interval set to 5 minutes
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const fetchWeather = useCallback(async () => {
    if (!searchCity) return;

    const apiKey = '8d0977dfd0a3f1d1217cc6472f8d4690';
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=${unit}&appid=${apiKey}`
      );
      setWeatherData(response.data);
    } catch (error) {
      alert('Error fetching data for the city. Please check the city name and try again.');
      console.error(error); // Log error details for debugging
    }
  }, [searchCity, unit]); // Fetch weather data based on city and unit

  useEffect(() => {
    if (searchCity) {
      fetchWeather(); // Initial fetch
      const interval = setInterval(fetchWeather, intervalTime); // Set up interval for updates
      return () => clearInterval(interval); // Cleanup interval on unmount or city change
    }
  }, [fetchWeather, intervalTime, searchCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchCity(city); // Set the city for searching
    setCity(''); // Clear the input field after submitting
  };

  return (
    <Container maxWidth="lg" sx={{ background: 'linear-gradient(to right, #74ebd5, #acb6e5)', padding: 4, borderRadius: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h4" sx={{ mb: 2, color: '#fff' }}>Weather App</Typography>

          {/* Unit Selection Dropdown */}
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120, background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }} fullWidth>
            <InputLabel id="unit-select-label">Unit</InputLabel>
            <Select
              labelId="unit-select-label"
              id="unit-select"
              value={unit}
              onChange={(e) => setUnit(e.target.value)} // Update unit selection
              label="Unit"
            >
              <MenuItem value="metric">°C</MenuItem>
              <MenuItem value="imperial">°F</MenuItem>
              <MenuItem value="standard">K</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Update Interval (minutes)"
            type="number"
            InputProps={{ inputProps: { min: 1 } }} // Minimum value for interval
            value={intervalTime / (60 * 1000)} // Convert milliseconds to minutes
            onChange={(e) => setIntervalTime(e.target.value * 60 * 1000)} // Update interval time
            sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }}
          />

          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              margin="normal"
              label="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)} // Update city input
              sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }}
            />
            <Button variant="contained" color="primary" type="submit">Search</Button>
          </form>
        </Grid>

        <Grid item xs={12} md={8}>
          {weatherData ? (
            <>
              <Box sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1, padding: 2, boxShadow: 3 }}>
                <WeatherCard weatherData={weatherData} unit={unit} />
              </Box>
              <Box sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1, padding: 2, boxShadow: 3, mt: 2 }}>
                <Forecast forecastData={weatherData.list} unit={unit} />
              </Box>
              <Box sx={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: 1, padding: 2, boxShadow: 3, mt: 2 }}>
                <WeatherVisualizations forecastData={weatherData.list} unit={unit} />
              </Box>
            </>
          ) : (
            <Typography>No data available. Please search for a city.</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
