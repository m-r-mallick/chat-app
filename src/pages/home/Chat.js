import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import ChatBottom from '../../components/chat-window/bottom';
import Messages from '../../components/chat-window/messages';
import ChatTop from '../../components/chat-window/top';
import { useRooms } from '../../context/rooms.context';

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
   return (
      <>
         <div className="chat-top">
            <ChatTop roomName={currentChat.name} />
         </div>
         <div className="chat-middle">
            <Messages desc={currentChat.description} />
         </div>
         <div className="chat-bottom">
            <ChatBottom createdAt={currentChat.createdAt} />
         </div>
      </>
   );
};

export default Chat;
