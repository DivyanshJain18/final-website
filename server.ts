import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cookieParser from 'cookie-parser';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Serve uploaded files from persistent storage
  const DATA_DIR = process.env.DATA_DIR || process.cwd();
  const uploadDir = path.join(DATA_DIR, 'uploads');
  app.use('/uploads', express.static(uploadDir));

  // Chatbot API Route
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, context } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemPrompt = `You are a helpful, professional, and knowledgeable customer support assistant for Mechafy Global. 
Your primary goal is to answer questions using ONLY the information provided in the context below.

Rules:
1. Do not invent information, prices, specifications, or stock availability.
2. If the answer is clearly available in the context, answer the customer directly and naturally.
3. If the customer asks for information that is NOT available in the context, respond: "I couldn't find that information on our website. Please contact the Mechafy Global team for the latest details." Then provide the contact options.
4. For stock or quotation queries not clearly verified, instruct them to contact sales.
5. If price is available, provide it. If not, ask them to contact sales.
6. Make responses conversational and human-like. Keep them concise unless details are requested.
7. Use plain text formatting with clear line breaks. Do not use asterisks or markdown syntax like **bold** because the chat UI does not support markdown rendering.
8. If the question is completely unrelated to Mechafy Global (e.g., general knowledge), respond: "I'm here to help with Mechafy Global's products, services, orders, and enquiries. What would you like to know?"
9. You must respond in valid JSON format ONLY with the following schema:
   {
     "text": "Your natural language response here",
     "options": ["Option 1", "Option 2"] // Array of 2-3 quick reply button suggestions for the user (e.g., "Talk to Sales", "Shop 3D Printers"), or empty array if none.
   }

Contact Info to use when needed:
Mechafy Global
Phone: +91-9817056538
Email: info@mechafyglobal.com
Website: https://www.mechafyglobal.com

Context Data (Products, Services, etc.):
${context}`;

      const history = messages.slice(0, -1).map((m: any) => ({
        role: m.role, // 'user' or 'model'
        parts: [{ text: m.text }]
      }));
      
      const lastMessage = messages[messages.length - 1].text;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
            ...history,
            { role: 'user', parts: [{ text: lastMessage }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json({ text: data.text || "I'm sorry, I couldn't process that.", options: data.options || [] });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      let errorMessage = 'Failed to generate response';
      if (error.status === 400 && error.message?.includes('API key not valid')) {
        errorMessage = 'Invalid Gemini API Key. Please update it in settings.';
      } else if (error.message) {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.error && parsed.error.message) {
            errorMessage = parsed.error.message;
          }
        } catch (e) {
          errorMessage = error.message;
        }
      }
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
