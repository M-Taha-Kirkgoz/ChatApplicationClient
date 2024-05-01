export class ChatModel{
    userId: string = "";
    toUserId: string = "";
    date: string  ="";
    message: string = "";
  }

  
/* Örnek Chat Verileri

  export const Chats: ChatModel[] = [
    {
      userId: "0",
      toUserId: "1",
      date: new Date().toString(),
      message: "Hi Aiden, how are you? How is the project coming along?"
    },
    {
      userId: "1",
      toUserId: "0",
      date: new Date().toString(),
      message: "Are we meeting today?"
    },
    {
      userId: "1",
      toUserId: "0",
      date: new Date().toString(),
      message: "Project has been already finished and I have results to show you."
    }
  ]

*/