import { Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { Chats } from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

// Lazy-initialize Gemini client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" },
      },
    });
  } catch (e) {
    console.error("Error creating GoogleGenAI Client in Chat Controller:", e);
  }
}

export async function getMyChats(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const allChats = await Chats.find();
    const userChats = allChats.filter(chat => chat.userId === req.user!.id);
    res.json(userChats);
  } catch (error: any) {
    console.error("Fetch Chats Error:", error);
    res.status(500).json({ error: "Internal Server Error fetching chat history" });
  }
}

export async function submitChatMessage(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Save User message
    const userMsg = await Chats.insertOne({
      userId: req.user.id!,
      sender: "user",
      content,
    });

    let botResponseText = "";

    if (!ai) {
      // Demo fallback response
      botResponseText = `◆ [DEMO_COGNITIVE_CORE] Greetings, ${req.user.fullName}. To fully unlock live Gemini inference, please add the \`GEMINI_API_KEY\` secret key in AI Studio. 

Currently operating on high-efficiency fallback heuristics:
• Recognized prompt related to your workspace settings.
• Operational ledger indices look stable.
• I can assist with simulated automation design and drafting outreach sequences.

How else can I support your strategy call bookings or team flows today?`;
    } else {
      try {
        const systemInstruction = 
          "You are *Stellar AI* (version 6.5-Max), a premium cognitive intelligence agent guiding automation clients. " +
          "Your tone is corporate-elegant, high-tech, precise, and supportive. " +
          "Structure responses cleanly with markdown bold accents, bullet points (◆), and occasional technical code blocks. " +
          "Help the user design custom CRM webhooks, parse document schemas, automate Slack messaging, or debug ledger connections. " +
          `The client is ${req.user.fullName} representing ${req.user.company || "Stellar Customer"}.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: content,
          config: {
            systemInstruction,
            temperature: 0.75,
          },
        });

        botResponseText = response.text || "◆ [INF_TIMEOUT] Processing node didn't return output. Please retry.";
      } catch (geminiErr: any) {
        console.error("Gemini API error inside Controller:", geminiErr);
        botResponseText = `◆ [API_ERROR] Stellar Core reported a temporary transmission fault: "${geminiErr.message}". Reverting to backup protocols.`;
      }
    }

    // Save bot response
    const botMsg = await Chats.insertOne({
      userId: req.user.id!,
      sender: "ai",
      content: botResponseText,
    });

    res.json({
      userMessage: userMsg,
      aiMessage: botMsg,
    });
  } catch (error: any) {
    console.error("Chat Submission Error:", error);
    res.status(500).json({ error: "Internal Server Error processing message" });
  }
}

export async function clearMyChats(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const allChats = await Chats.find();
    for (const chat of allChats) {
      if (chat.userId === req.user.id) {
        await Chats.deleteOne({ id: chat.id });
      }
    }

    res.json({ success: true, message: "Chat logs purged successfully." });
  } catch (error: any) {
    console.error("Clear Chats Error:", error);
    res.status(500).json({ error: "Internal Server Error purging logs" });
  }
}
