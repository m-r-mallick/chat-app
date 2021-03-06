import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import ChatBottom from '../../components/chat-window/bottom';
import Messages from '../../components/chat-window/messages';
import ChatTop from '../../components/chat-window/top';
import { CurrentRoomProvider } from '../../context/current-room.context';
import { useRooms } from '../../context/rooms.context';
import { auth } from '../../misc/firebase';
import { transformToArray } from '../../misc/helpers';

const Chat = () => {
   const { chatId } = useParams();
   const rooms = useRooms();
   if (!rooms) {
      return (
         <Loader center vertical size="md" content="Loading" speed="slow" />
      );
   }
   const currentChat = rooms.find(room => room.id === chatId);
   if (!currentChat) {
      return <h6 className="text-center mt-page">Chat room not found!</h6>;
   }
   const { name, description } = currentChat;
   const admins = transformToArray(currentChat.admins);
   const isAdmin = admins.includes(auth.currentUser.uid);
   const currentChatData = { name, description, admins, isAdmin };
   return (
      <CurrentRoomProvider data={currentChatData}>
         <div className="chat-top">
            <ChatTop />
         </div>
         <div className="chat-middle">
            <Messages />
         </div>
         <div className="chat-bottom">
            <ChatBottom />
         </div>
      </CurrentRoomProvider>
   );
};

export default Chat;
