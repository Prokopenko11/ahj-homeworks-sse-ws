import Message from './message';

export default class Chat {
  constructor(nickname, wsTransport) {
    this.nickname = nickname;
    this.wsTransport = wsTransport;

    this.chatMessages = document.querySelector('.chat-messages');
    this.chatInput = document.querySelector('.chat-messages-input');
    this.chatUsers = document.querySelector('.chat-users-content');

    this.sendMessage = this.sendMessage.bind(this);
    this.chatInput.addEventListener('keydown', this.sendMessage);

    this.handleMessage = this.handleMessage.bind(this);
    this.wsTransport.addMessageListener(this.handleMessage);

    this.handleWindowClose = this.handleWindowClose.bind(this);
    window.addEventListener('beforeunload', this.handleWindowClose);
  }

  sendMessage(e) {
    if (e.key === 'Enter' && this.chatInput.value) {
      const message = {
        type: 'send',
        user: this.nickname,
        message: this.chatInput.value,
        date: new Date().toISOString(),
      };

      this.wsTransport.send(message);
      this.chatInput.value = '';
    }
  }

  handleMessage(data) {
    if (Array.isArray(data)) {
      this.updateActiveUsers(data);
    }

    if (data.type === 'send') {
      const isCurrentUser = data.user === this.nickname;
      const message = new Message();

      const formattedDate = message.formatDate(new Date(data.date));
      const messageElem = message.createMessage(data.user, formattedDate, data.message, isCurrentUser);

      this.chatMessages.insertAdjacentHTML('beforeend', messageElem);
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
  }

  updateActiveUsers(users) {
    this.chatUsers.innerHTML = '';

    users.forEach((user) => {
      const userElement = document.createElement('div');
      userElement.classList.add('chat-user');

      const displayName = user.name === this.nickname ? 'You' : user.name;
      userElement.textContent = displayName;

      if (user.name === this.nickname) {
        userElement.classList.add('current-user');
      }

      this.chatUsers.appendChild(userElement);
    });
  }

  handleWindowClose() {
    const message = {
      type: 'exit',
      user: { name: this.nickname },
    };

    this.wsTransport.send(message);
  }
}
