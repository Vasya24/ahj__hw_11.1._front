/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { ajax } from 'rxjs/ajax';
import { catchError, switchMap } from 'rxjs/operators';
import { interval, of } from 'rxjs';

export default class Messages {
  constructor() {
    this.container = document.getElementById('messages_list');
  }

  getMessages() {
    interval(5000).pipe(
      switchMap(
        () => ajax.getJSON('https://ahj-rxjs-1.herokuapp.com/messages/unread/')
          .pipe(
            catchError(() => of({ messages: [] })),
          ),
      ),
    ).subscribe(
      (result) => {
        this.drawMessages(result.messages);
      },
      (error) => console.error(error),
    );
  }

  drawMessages(data) {
    data.forEach((el) => {
      const { from, subject, received } = el;
      const message = document.createElement('div');
      message.className = 'message';
      message.innerHTML = `
          <span class="message_sender">${from}</span>
          <span class="message_text">${subject.length <= 15 ? subject : `${subject.substring(0, 15)}...`}</span>
          <span class="message_date">${this.formatDate(received)}</span>
        `;
      this.container.insertAdjacentElement('afterbegin', message);
    });
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear().toString().slice(2);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} ${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
  }
}