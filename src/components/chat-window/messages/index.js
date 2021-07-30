import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
   const { chatId } = useParams();
   const [messages, setMessages] = useState(null);

   const isChatEmpty = messages && messages.length === 0;
   const canShowMessages = messages && messages.length > 0;

   useEffect(() => {
      const messagesRef = database.ref(`/messages`);
      messagesRef
         .orderByChild(`roomId`)
         .equalTo(chatId)
         .on('value', snap => {
            const data = transformToArrayWithId(snap.val());
            setMessages(data);
         });

      return () => {
         messagesRef.off('value');
      };
   }, [chatId]);

   const handleAdmin = useCallback(
      async uid => {
         const adminsRef = database.ref(`/rooms/${chatId}/admins`);
         let alertMsg;
         await adminsRef.transaction(admins => {
            if (admins) {
               if (admins[uid]) {
                  admins[uid] = null;
                  alertMsg = 'Admin privileges removed!';
               } else {
                  admins[uid] = true;
                  alertMsg = 'Admin privileges granted!';
               }
            }
            return admins;
         });
         Alert.info(alertMsg, 4000);
      },
      [chatId]
   );

   const handleLike = useCallback(async msgId => {
      const { uid } = auth.currentUser;
      const adminsRef = database.ref(`/messages/${msgId}`);
      let alertMsg;
      await adminsRef.transaction(msg => {
         if (msg) {
            if (msg.likes && msg.likes[uid]) {
               msg.likeCount -= 1;
               msg.likes[uid] = null;
               alertMsg = 'Removed from favorites!';
            } else {
               msg.likeCount += 1;
               if (!msg.likes) {
                  msg.likes = {};
               }
               msg.likes[uid] = true;
               alertMsg = 'Liked!';
            }
         }
         return msg;
      });
      Alert.info(alertMsg, 4000);
   }, []);

   const handleDelete = useCallback(
      async msgId => {
         if (!window.confirm('Delete this message?')) {
            return;
         }
         const isLast = messages[messages.length - 1].id === msgId;
         const updates = {};
         updates[`/messages/${msgId}`] = null;
         if (isLast && messages.length > 1) {
            updates[`/rooms/${chatId}/lastMessage`] = {
               ...messages[messages.length - 2],
               msgId: messages[messages.length - 2].id,
            };
         }

         if (isLast && messages.length === 1) {
            updates[`/rooms/${chatId}/lastMessage`] = null;
         }

         try {
            await database.ref().update(updates);
            Alert.info('Message has been deleted!', 4000);
         } catch (error) {
            Alert.error(error.message, 4000);
         }
      },
      [chatId, messages]
   );

   return (
      <ul className="msg-list custom-scroll">
         {isChatEmpty && <li>No messages yet...</li>}
         {canShowMessages &&
            messages.map(msg => (
               <li>
                  <MessageItem
                     key={msg.id}
                     message={msg}
                     handleAdmin={handleAdmin}
                     handleLike={handleLike}
                     handleDelete={handleDelete}
                  />
               </li>
            ))}
      </ul>
   );
};

export default Messages;
