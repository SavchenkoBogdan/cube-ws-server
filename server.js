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

    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.warn("Invalid JSON");
        return;
    }

     if (data.event === "start_fall") {
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event: "start_fall" }));
            }
        }
    }
  });




  ws.on('close', () => {
    console.log("Client disconnected:", id);
    clients.delete(ws);
  });
});



const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


