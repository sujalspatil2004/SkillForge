const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const GOOGLE_GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

router.post("/generate", async (req, res) => {
  const { technology } = req.body;

  try {
    console.log("Received technology:", technology);
    const prompt = `Generate a short and concise learning pathway for mastering ${technology}. Each stage should have a title, a brief description (1-2 sentences), and 1-2 key resources or topics.`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };
    console.log("Payload:", payload);
    const response = await axios.post(
      `${GOOGLE_GEMINI_API_URL}?key=${API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API Response:", response.data);

    const generatedPathway = response.data.candidates[0].content.parts[0].text;

    // Parse the response into steps
    const pathwayArray = generatedPathway
      .split("\n")
      .map((step) => step.trim())
      .filter((step) => step !== "");

    const pathwayData = {
      name: "Learning Pathway",
      children: pathwayArray.map((step) => {
        const [title, ...details] = step.split("-");
        return {
          name: title.trim(),
          children: details.map((detail) => ({ name: detail.trim() })),
        };
      }),
    };

    // Include technology in the response for backend purposes
    res.json({ technology, pathway: pathwayData });
  } catch (error) {
    console.error("Error generating pathway:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate pathway" });
  }
});

module.exports = router;