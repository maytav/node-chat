import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as io from 'socket.io-client';
import {Chat} from './chat';
import {ChatService} from './chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {


    chats: Chat[] = [];
    joinned = false;
    newUser = {nickname: '', room: ''};
    msgData = {room: '', nickname: '', message: ''};
    socket = io('http://localhost:4000');

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user !== null) {
            this.getChatByRoom(user.room);
            this.msgData = {room: user.room, nickname: user.nickname, message: ''};
            this.joinned = true;
            this.scrollToBottom();
        }

        this.socket.on('new-message', (data) => {
            const user2 = JSON.parse(localStorage.getItem('user'));
            if (data.message.room === (user2 && user2.room)) {
                this.chats.push(data.message);
                this.msgData = {room: user2.room, nickname: user2.nickname, message: ''};
                this.scrollToBottom();

            }
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

    getChatByRoom(room) {
        this.chatService.getChatByRoom(room).then((res) => {
            console.log(res);
            this.chats = res;
        }, (err) => {
            console.log(err);
        });
    }

    joinRoom() {
        localStorage.setItem('user', JSON.stringify(this.newUser));
        this.getChatByRoom(this.newUser.room);
        this.msgData = {room: this.newUser.room, nickname: this.newUser.nickname, message: ''};
        this.joinned = true;
        this.socket.emit('save-message', {
            room: this.newUser.room, nickname: this.newUser.nickname,
            message: 'Join this room', updated_at: new Date()
        });


    }

    sendMessage() {
        this.chatService.saveChat(this.msgData).then((result) => {
            this.socket.emit('save-message', result);
        }, (err) => {
            console.log(err);
        });
    }

    logout() {
        const date = new Date();
        const user = JSON.parse(localStorage.getItem('user'));
        this.socket.emit('save-message', {room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date});
        localStorage.removeItem('user');
        this.joinned = false;
    }
}
