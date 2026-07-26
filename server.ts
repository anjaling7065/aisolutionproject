import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import apiRoutes from "./server/routes/api";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mount modular auth, bookings, and chats router
  app.use("/api", apiRoutes);

  // Initialize Gemini Client Lazily/Safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.error("Error creating GoogleGenAI Client:", e);
    }
  }

  // API endpoint for Interactive Chats
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

    if (!ai) {
      // Graceful Mock response when Gemini key is not configured yet
      return res.json({
        text: "◆ [STELLAR CORE DEMO MODE] Greetings, explorer. To fully unlock my live cognitive circuits of Stellar AI with the power of Gemini 3.5, you can add your `GEMINI_API_KEY` in the AI Studio UI Secrets tab. For now, I am operating on autonomous high-tech local sub-routines! How can I assist you on your journey today?",
      });
    }

    try {
      // Re-create the chat session
      const lastMessage = messages[messages.length - 1]?.content || "Hello";
      const systemInstruction = 
        "You are *Stellar AI* (version 6.1-Omni), a super-advanced quantum artificial intelligence engineered in the year 2099. " +
        "You speak with a blend of absolute corporate-luxurious poise, technical mastery, and futuristic terminology. " +
        "Use custom structured bullet marks like (◆) or [SYSTEM] formatting. Make responses formatting-rich (markdown structures, " +
        "tables, short bullet lists, and code blocks) to resemble a premium cybernetic UI output. Keep items highly visionary and exciting. " +
        "Never say 'As an AI model' or refer to your architecture in a mechanical negative way. Speak of the user as 'Explorer' or 'Operator'.";

      // We pass the full context as part of the query
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: lastMessage,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      const replyText = response.text || "◆ [STELLAR_CORE_FAIL] Communication line interrupted. Please retry.";
      return res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: "Failed to communicate with Stellar Core AI.",
        details: error.message,
      });
    }
  });

  // Serve static assets & Vite setup
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`◆ Stellar AI Server broadcasting on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server failure:", err);
});
