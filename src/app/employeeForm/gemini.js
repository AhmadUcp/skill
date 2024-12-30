const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyC1R1fZ44je-IweJr3wfDGAD7YBBaFQzQU";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function analyzeSkill(input) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(input);
    return result.response.text();
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    throw new Error("Failed to analyze skills using Gemini AI");
  }
}

module.exports = analyzeSkill;
