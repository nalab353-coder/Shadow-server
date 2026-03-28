const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

app.get("/", (req, res) => {
  res.send("ShadowAI Server Running 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (error) {
    console.log(error);
    res.status(500).json({ reply: "Server error 😔" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
