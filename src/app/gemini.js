import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;

  try {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(input);
    const extractedSkills = JSON.parse(result.response.text());

    const cvSkills = extractedSkills.cv_skills || [];
    const jobSkills = extractedSkills.job_description_skills || [];

    res.status(200).json({ cvSkills, jobSkills });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: "Failed to process input" });
  }
}
