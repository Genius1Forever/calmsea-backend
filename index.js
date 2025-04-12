require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/generate", async (req, res) => {
    const { notes } = req.body;

    const prompt = `Ты — профессиональный психолог. Проанализируй следующие записи дневника и предложи 2-3 краткие рекомендации для улучшения эмоционального состояния:\n\n${notes.join("\n")}`;

    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "mistralai/mistral-7b-instruct", // Можно заменить на другую модель
            messages: [
                { role: "system", content: "Ты — эмпатичный психолог." },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7
        }, {
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "Referer": "https://calmsea-backend.onrender.com",
                "X-Title": "CalmSea Recommender"
            }
        });

        const answer = response.data.choices[0].message.content;
        res.json({ recommendation: answer });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Ошибка генерации рекомендации" });
    }
});

app.get('/', (req, res) => {
    res.send('Сервер CalmSea работает успешно');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

