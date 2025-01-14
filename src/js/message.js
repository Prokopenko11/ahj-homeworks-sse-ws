export default class Message {
  createMessage(nickname, date, messageText, isCurrentUser) {
    const messageClass = isCurrentUser ? 'message-right' : 'message-left';

    const displayName = isCurrentUser ? 'You' : nickname;

    const message = `
      <div class="message ${messageClass}">
        <span class="message-span">${displayName}, ${date}</span>
        <p class="message-text">${messageText}</p>
      </div>
    `;

    return message;
  }

  formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const timeString = `${hours}:${minutes} ${day}.${month}.${year}`;

    return timeString;
  }
}
