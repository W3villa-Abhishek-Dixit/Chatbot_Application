import React, { useState, useEffect } from "react";

const App = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        socket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: event.data }]);
        };

        socket.onclose = () => {
            console.log("Disconnected from WebSocket server");
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() !== "" && ws) {
            setMessages([...messages, { sender: "user", text: input }]);
            ws.send(input);
            setInput("");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Chatbot</h2>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    minHeight: "300px",
                    overflowY: "auto",
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            textAlign: msg.sender === "user" ? "right" : "left",
                            marginBottom: "10px",
                        }}
                    >
                        <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flex: "1", padding: "10px" }}
                />
                <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "5px" }}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default App;
