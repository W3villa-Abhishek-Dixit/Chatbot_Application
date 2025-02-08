require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Load Groq API key from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
console.log("API Key:", GROQ_API_KEY);

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", async (message) => {
        console.log(`User: ${message}`);

        try {
            const response = await axios.post(
                GROQ_API_URL,
                {
                    model: "llama-3.3-70b-versatile", // Updated model
                    messages: [{ role: "user", content: message.toString() }],
                    max_tokens: 100 // Limit response size
                },
                {
                    headers: {
                        Authorization: `Bearer ${GROQ_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        
            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const botResponse = response.data.choices[0].message.content;
                console.log(`Bot: ${botResponse}`);
                ws.send(botResponse); // Send proper bot response
            } else {
                console.error("Invalid response from Groq API:", response.data);
                ws.send("Sorry, no valid response from AI.");
            }
        } catch (error) {
            console.error("Error calling Groq API:", error.response ? error.response.data : error.message);
            ws.send("Sorry, something went wrong.");
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

server.listen(8080, () => {
    console.log("WebSocket Server running on ws://localhost:8080");
});
