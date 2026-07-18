import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Gemini client lazily to handle missing API keys gracefully
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables. AI chat features will fall back to smart simulated tutoring.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const client = getAiClient();
    if (!client) {
      // Simulate tutor response if no API key is provided
      const userMsg = messages[messages.length - 1]?.parts?.[0]?.text || "";
      let simulatedReply = "I am ready to help you ignite your learning journey! Please make sure your GEMINI_API_KEY is configured in the Secrets panel to get live AI responses.";
      
      const lowercaseMsg = userMsg.toLowerCase();
      if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi")) {
        simulatedReply = "Hello there, scholar! 🔥 Welcome to FireStudy. I'm your FireStudy Coach. Ask me any study question or ask for help with Physics Wallah, Next Toppers, Mission Jeet, or BookVerse, and let's spark some knowledge today!";
      } else if (lowercaseMsg.includes("physics") || lowercaseMsg.includes("pw")) {
        simulatedReply = "Physics is the study of matter, energy, and the universe! 🌌 On FireStudy, our Physics Wallah course can help you master mechanics, thermodynamics, and quantum topics. What specific physics concept are you trying to understand right now?";
      } else if (lowercaseMsg.includes("note") || lowercaseMsg.includes("study")) {
        simulatedReply = "Creating study summaries is a fire-tested way to retain info! 📝 Use the 'Notes' tab inside any course to write down your learnings. Writing helps crystallize concepts in your mind!";
      } else if (lowercaseMsg.includes("quiz") || lowercaseMsg.includes("test")) {
        simulatedReply = "Quizzes are perfect for retrieval practice! ⚡ Head over to our interactive FireStudy Quiz Section to test your knowledge, earn XP, and unlock fire achievement badges!";
      } else {
        simulatedReply = `That is an excellent question! "Let's explore '${userMsg}' together." When we study, breaking down concepts into bite-sized, structured insights is key. What are you preparing for (e.g. Class 9-12, boards, or engineering/medical exams)? Let me guide your research!`;
      }
      return res.json({ reply: simulatedReply, isSimulated: true });
    }

    // Call the server-side Gemini API
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: m.parts || [{ text: m.content || "" }]
      })),
      config: {
        systemInstruction: "You are the FireStudy AI Assistant, a warm, energetic, and highly knowledgeable study coach inspired by fire. Your tagline is 'Ignite Your Learning Journey'. Use fire and spark metaphors naturally but sparingly (e.g., 'fuel your curiosity', 'ignite your knowledge', 'spark of understanding'). Help the student understand high school physics, competitive exams, book reading, and learning strategies. Keep replies concise, structured, and motivational. Format formulas beautifully or use neat markdown bullet points."
      }
    });

    res.json({ reply: response.text || "I couldn't generate a response right now.", isSimulated: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI Study Assistant." });
  }
});

// Serve frontend with Vite in dev, static files in production
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FireStudy Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
