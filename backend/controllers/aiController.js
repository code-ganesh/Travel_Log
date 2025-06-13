const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


// 🧳 Travel Itinerary Generator
exports.getItinerary = async (req, res) => {
  try {
    const { destination, days, interests } = req.body;

    const prompt = `Plan a ${days}-day itinerary for ${destination}, focusing on ${interests.join(", ")}. Provide a day-wise plan.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const itinerary = response.text();

    res.json({ itinerary });
  } catch (error) {
    console.error("Itinerary Error:", error.message);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
};

// 🌤 Best Time to Visit Suggestion
exports.getBestTime = async (req, res) => {
  try {
    const { destination } = req.body;

    const prompt = `What is the best time of year to visit ${destination} considering weather, crowd, and local events?`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const bestTime = response.text();

    res.json({ bestTime });
  } catch (error) {
    console.error("Best Time Error:", error.message);
    res.status(500).json({ error: "Failed to suggest best time" });
  }
};

// 📍 Nearby Attractions Recommendation
exports.getNearby = async (req, res) => {
  try {
    const { destination } = req.body;

    const prompt = `List top tourist attractions and places to visit near ${destination}. Give short descriptions for each.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const attractions = response.text();

    res.json({ attractions });
  } catch (error) {
    console.error("Nearby Error:", error.message);
    res.status(500).json({ error: "Failed to get nearby places" });
  }
};