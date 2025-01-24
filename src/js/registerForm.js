export default class RegisterForm {
  constructor(httpTransport, callback) {
    this.httpTransport = httpTransport;
    this.registerCallback = callback;

    this.registerForm = document.querySelector('.registration-form');

    this.onSubmit = this.onSubmit.bind(this);
    this.registerForm.addEventListener('submit', this.onSubmit);
  }

  async onSubmit(e) {
    e.preventDefault();
    const formInput = document.querySelector('.registration-form-input');
    const nickname = formInput.value;

    await this.registerCallback(nickname);
  }

  showError(message) {
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;

    const formInput = document.querySelector('.registration-form-input');
    formInput.insertAdjacentElement('afterend', errorMessage);
  }
}
