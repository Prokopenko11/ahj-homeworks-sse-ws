import RegisterForm from './registerForm';
import HTTPTransport from './HTTPTransport';
import Chat from './chat';
import WebSocketTransport from './webSocketTransport';

export default class App {
  constructor(apiUrl, wsUrl) {
    this.apiUrl = apiUrl;
    this.wsUrl = wsUrl;

    this.httpTransport = new HTTPTransport(this.apiUrl);

    this.handleRegistration = this.handleRegistration.bind(this);
    this.registerForm = new RegisterForm(this.httpTransport, this.handleRegistration);
    this.chat = null;
  }

  async handleRegistration(nickname) {
    const result = await this.httpTransport.addUser(nickname);

    if (result.status === 'ok') {
      document.querySelector('.registration-form').style.display = 'none';
      document.querySelector('.chat').style.display = 'block';

      this.ws = new WebSocketTransport(this.wsUrl);

      this.chat = new Chat(nickname, this.ws);
    } else {
      this.registerForm.showError('Пользователь с таким именем уже существует! Выберете другой псевдоним.');
    }
  }
}

const app = new App('https://sse-ws-server-dqss.onrender.com/', 'wss://sse-ws-server-dqss.onrender.com/ws');
