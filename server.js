const express = require("express");
const https = require("https");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = "ba3334c9bde5406d8f2195804230312";

app.post("/getWeather", async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res
        .status(400)
        .json({ error: "Invalid input. Please provide an array of cities." });
    }

    const weatherData = {};

    for (const city of cities) {
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

        const weatherResponse = await makeRequest(url);

        const temperature = weatherResponse.current.temp_c;
        const windSpeed = weatherResponse.current.wind_kph;
        const humidity = weatherResponse.current.humidity;
        let origIcon = weatherResponse.current.condition.icon;
        const icon = origIcon.replace("64x64", "128x128");
        const text = weatherResponse.current.condition.text;

        weatherData[city] = {
          temperature: `${temperature}`,
          windSpeed: `${windSpeed}`,
          humidity: `${humidity}`,
          image: `${icon}`,
          text: `${text}`,
          found: true,
        };
      } catch (error) {
        weatherData[city] = { found: false };
        console.error(`Error fetching weather for ${city}:`, error.message);
      }
    }

    res.json({ weather: weatherData });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.error("Server error:", error.message);
  }
});

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const parsedData = JSON.parse(data);
          if (parsedData.cod && parsedData.cod !== 200) {
            reject(new Error(parsedData.message || "Failed to fetch"));
          } else {
            resolve(parsedData);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

const PORT = process.env.PORT || 5501;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
