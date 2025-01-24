export default class HTTPTransport {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async addUser(name) {
    const response = await fetch(`${this.apiUrl}new-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    return response.json();
  }
}
