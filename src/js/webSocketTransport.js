export default class WebSocketTransport {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.listeners = [];

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      this.listeners.forEach((listener) => listener(data));
    });
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }

  addMessageListener(callback) {
    this.listeners.push(callback);
  }

  close() {
    this.ws.close();
  }
}
