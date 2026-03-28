// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static HTML page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Charles & Shivaan Chatbot</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; }
        input, button { padding: 10px; font-size: 16px; }
        #chat { border: 1px solid #ccc; padding: 10px; height: 300px; overflow-y: scroll; margin-bottom: 10px; }
        .message { margin-bottom: 8px; }
        .user { color: blue; }
        .bot { color: green; }
      </style>
    </head>
    <body>
      <h1>Charles & Shivaan Chatbot</h1>
      <div id="chat"></div>
      <input type="text" id="inputMessage" placeholder="Type your message..." />
      <button onclick="sendMessage()">Send</button>

      <script>
        async function sendMessage() {
          const input = document.getElementById("inputMessage");
          const chatDiv = document.getElementById("chat");
          const message = input.value;
          if (!message) return;
          
          chatDiv.innerHTML += '<div class="message user">You: ' + message + '</div>';
          input.value = '';

          const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
          });

          const data = await response.json();
          chatDiv.innerHTML += '<div class="message bot">Bot: ' + (data.reply || data.error) + '</div>';
          chatDiv.scrollTop = chatDiv.scrollHeight;
        }
      </script>
    </body>
    </html>
  `);
});

// Chatbot API endpoint
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get response" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
