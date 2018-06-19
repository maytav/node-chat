import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Chat} from './chat';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {
    }

    getChatByRoom(room): Promise<Chat[]> {

        return new Promise((resolve, reject) => {
            this.http.get<Chat[]>(`${this.baseUrl}/chat/` + room)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });

    }

    saveChat(data) {

        return new Promise((resolve, reject) => {
            this.http.post(`${this.baseUrl}/chat`, data)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                   this.handleError(err);
                });
        });

    }

    updateChat(id, data) {
        return new Promise((resolve, reject) => {
            this.http.put(`${this.baseUrl}/chat/${id}`, data)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });
    }

    deleteChat(id) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${this.baseUrl}/chat/${id}`)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
        });
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
