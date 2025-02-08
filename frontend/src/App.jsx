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
        <div style={{
            maxWidth: "600px",
            margin: "auto",
            padding: "20px",
            backgroundColor: "#f4f4f4",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
        }}>
            <h2 style={{ textAlign: "center", color: "#333" }}>Chatbot</h2>
            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    minHeight: "300px",
                    overflowY: "auto",
                    backgroundColor: "#fff",
                    borderRadius: "8px"
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            textAlign: msg.sender === "user" ? "right" : "left",
                            marginBottom: "10px",
                            padding: "10px",
                            borderRadius: "10px",
                            display: "inline-block",
                            maxWidth: "80%",
                            backgroundColor: msg.sender === "user" ? "#007bff" : "#ddd",
                            color: msg.sender === "user" ? "#fff" : "#000"
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
                    placeholder="Type a message..."
                    style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        outline: "none"
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: "10px 15px",
                        marginLeft: "5px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default App;
