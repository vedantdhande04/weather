import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Homepage route
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

// Weather route
app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.render("index", {
      weather: null,
      error: "Please enter a city name.",
    });
  }

  try {
    const weatherData = await getWeatherData(city);
    res.render("index", { weather: weatherData, error: null });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.render("index", {
      weather: null,
      error: "Error fetching weather data. Please try again later.",
    });
  }
});

// Function to fetch weather data
async function getWeatherData(city) {
  const API_KEY = process.env.API_KEY;
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=76514837b620ec1e61544386f0be82d6`;

  try {
    const response = await fetch(weatherURL);
    if (!response.ok) {
      throw new Error(
        `Weather API request failed with status ${response.status}`
      );
    }
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Weather app is running on port ${PORT}`);
});
