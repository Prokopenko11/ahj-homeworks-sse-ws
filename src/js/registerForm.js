import Chat from './chat';

export default class RegisterForm {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.registerForm = document.querySelector('.registration-form');

    this.onSubmit = this.onSubmit.bind(this);

    this.registerForm.addEventListener('submit', this.onSubmit);
  }

  onSubmit(e) {
    e.preventDefault();

    const formInput = document.querySelector('.registration-form-input');

    const userNickname = formInput.value;

    this.add(userNickname);

    const chat = new Chat(userNickname);

    formInput.value = '';
  }

  async add(name) {
    const request = fetch(this.apiUrl + 'new-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const result = await request;

    const json = await result.json();

    const { status } = json;

    if (status === 'ok') {
      this.registerForm.style.display = 'none';

      const chat = document.querySelector('.chat');
      chat.style.display = 'block';
    } else {
      const formInput = document.querySelector('.registration-form-input');

      const errorMessage = document.createElement('p');
      errorMessage.classList.add('error-message');
      errorMessage.textContent = 'Пользователь с таким именем уже существует! Выберете другой псевдоним.';

      formInput.insertAdjacentElement('afterend', errorMessage);
    }
  }
}
