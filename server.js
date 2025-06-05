const WebSocket = require('ws');
const http = require('http');

// HTTP server required for Render
const server = http.createServer((req, res) => {
  res.end("WebSocket Server is running");
});

const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log("Client connected");

  ws.on('message', (msg) => {
    const text = msg.toString();

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


console.log("Type 'start' and press Enter to trigger falling.");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'start') {
        const message = JSON.stringify({ event: "start_fall" });
        console.log("Sending: " + message);

        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }