const WebSocket = require('ws');
const http = require('http');

// HTTP server required for Render
const server = http.createServer((req, res) => {
  res.end("WebSocket Server is running");
});

const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).substring(2);
  ws.id = id;
  clients.add(ws);
  console.log("Client connected:", id);

  ws.on('message', (msg) => {
    const text = msg.toString();
    console.log(`[${id}]`, text);

    // Broadcast to others
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    }
  });

  ws.on('close', () => {
    console.log("Client disconnected:", id);
    clients.delete(ws);
  });
});

// Start the server on the port Render gives us (via process.env.PORT)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});