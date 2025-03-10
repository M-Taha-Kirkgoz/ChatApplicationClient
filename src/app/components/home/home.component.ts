import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { ChatModel } from '../../models/chat.model';
import { HttpClient } from '@angular/common/http';

import * as signalR from '@microsoft/signalr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  users: UserModel[] = [];
  chats: ChatModel[] = [];
  selectedUserId: string = "";
  selectedUser: UserModel = new UserModel();

  user = new UserModel();

  hub: signalR.HubConnection | undefined;

  message: string = "";

  constructor(
    private http: HttpClient
  ){
    this.user = JSON.parse(localStorage.getItem("accessToken") ?? ""); // Kendi kullanıcı bilgilerim.
    this.getUsers();

    this.hub = new signalR.HubConnectionBuilder().withUrl("https://localhost:7211/chat-hub").build();

    this.hub.start().then(() => {
      console.log("Connection is started !");

      this.hub?.invoke("Connect", this.user.id); // Server tarafındaki "ChatHub" sınıfının içerisindeki "Connect" methodunun çalışmasını tetikler.

      this.hub?.on("Users", ( res: UserModel ) => {
        
        this.users.find(p => p.id == res.id)!.status = res.status;
        
      }); // Server tarafındaki "ChatHub" sınıfının içerisindeki "Connect" methodundan dönen cevabı "Users" ile dinlemeye başlar. (22. satır == Clients.All.SendAsync("Users", user);)

      this.hub?.on("Messages", (res:ChatModel) => {
        if ( this.selectedUserId == res.userId){
          this.chats.push(res);
        }
      });
    });
  }

  getUsers(){
    this.http.get<UserModel[]>("https://localhost:7211/api/Chats/GetUsers").subscribe(res => {
      this.users = res.filter(p => p.id != this.user.id); // Kendi kullanıcım haricindeki kullanıcıları görmek için filtreleme yapılır.
    });
  }


  changeUser(user: UserModel){
    this.selectedUserId = user.id;
    this.selectedUser = user;

    this.http
    .get(`https://localhost:7211/api/Chats/GetChats?userId=${this.user.id}&toUserId=${this.selectedUserId}`)
    .subscribe((res:any) => {
      this.chats = res;
    });
  }

  sendMessage(){

    const data = {
      "userId": this.user.id,
      "toUserId": this.selectedUserId,
      "message": this.message
    }

    this.http.post<ChatModel>("https://localhost:7211/api/Chats/SendMessage", data).subscribe( res => {
      this.chats.push(res);
      this.message = "";
    });
  }

  logout(){
    localStorage.clear();
    document.location.reload();
  }

}
