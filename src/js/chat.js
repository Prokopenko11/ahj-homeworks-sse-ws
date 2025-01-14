import Message from './message';

export default class Chat {
  constructor(nickname) {
    this.nickname = nickname;

    this.chatMessages = document.querySelector('.chat-messages');
    this.chatInput = document.querySelector('.chat-messages-input');
    this.chatUsers = document.querySelector('.chat-users-content');

    this.sendMessage = this.sendMessage.bind(this);
    this.chatInput.addEventListener('keydown', this.sendMessage);

    this.ws = new WebSocket('https://sse-ws-server-dqss.onrender.com/ws');

    this.wsOnMessage = this.wsOnMessage.bind(this);
    this.ws.addEventListener('message', this.wsOnMessage);

    window.addEventListener('beforeunload', this.handleWindowClose.bind(this));
  }

  sendMessage(e) {
    if (e.key === 'Enter' && this.chatInput.value) {
      const message = {
        type: 'send',
        user: this.nickname,
        message: this.chatInput.value,
        date: new Date().toISOString(),
      };

      this.ws.send(JSON.stringify(message));

      this.chatInput.value = '';
    }
  }

  wsOnMessage(e) {
    const data = JSON.parse(e.data);

    if (data.type === 'send') {
      const message = new Message();

      const isCurrentUser = data.user === this.nickname;

      const formattedDate = message.formatDate(new Date(data.date));

      const messageElem = message.createMessage(
        data.user,
        formattedDate,
        data.message,
        isCurrentUser,
      );

      this.chatMessages.insertAdjacentHTML('beforeend', messageElem);

      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    if (Array.isArray(data) && data.length > 0) {
      this.updateActiveUsers(data);
    }
  }

  updateActiveUsers(users) {
    this.chatUsers.innerHTML = '';

    users.forEach((user) => {
      const userElement = document.createElement('div');
      userElement.classList.add('chat-user');

      const displayName = user.name === this.nickname ? 'You' : user.name;

      if (user.name === this.nickname) {
        userElement.classList.add('current-user');
      }

      userElement.textContent = displayName;

      this.chatUsers.appendChild(userElement);
    });
  }

  handleWindowClose() {
    const message = {
      type: 'exit',
      user: { name: this.nickname },
    };

    this.ws.send(JSON.stringify(message));
  }
}
