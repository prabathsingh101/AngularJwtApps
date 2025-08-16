import { Component } from '@angular/core';
import { ChatService } from '../Auth/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-pages',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat-pages.html',
  styleUrl: './chat-pages.scss',
})
export class ChatPages {
  messages: { role: string; text: string }[] = [];
  userInput: string = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = { role: 'user', text: this.userInput };
    this.messages.push(userMsg);
    this.loading = true;

    this.chatService.ask(this.userInput).subscribe({
      next: (res: any) => {
        this.messages.push({ role: 'assistant', text: res.answer });
        this.loading = false;
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          text: '⚠️ Error contacting chatbot',
        });
        this.loading = false;
      },
    });

    this.userInput = '';
  }
}
