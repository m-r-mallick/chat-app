import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messagesRef = database.ref(`/messages`);

function shouldScrollToBottom(node, threshold = 30) {
   const percentage =
      (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;
   return percentage > threshold;
}

const Messages = () => {
   const { chatId } = useParams();
   const [messages, setMessages] = useState(null);
   const [limit, setLimit] = useState(PAGE_SIZE);
   const selfRef = useRef();

   const isChatEmpty = messages && messages.length === 0;
   const canShowMessages = messages && messages.length > 0;

   const loadMessages = useCallback(
      limitToLast => {
         messagesRef.off();
         const node = selfRef.current;

         messagesRef
            .orderByChild(`roomId`)
            .equalTo(chatId)
            .limitToLast(limitToLast || PAGE_SIZE)
            .on('value', snap => {
               const data = transformToArrayWithId(snap.val());
               setMessages(data);
               if (shouldScrollToBottom(node)) {
                  node.scrollTop = node.scrollHeight;
               }
            });
         setLimit(prevState => prevState + PAGE_SIZE);
      },
      [chatId]
   );

   const onLoadMore = useCallback(() => {
      const node = selfRef.current;
      const oldHeight = node.scrollHeight;
      loadMessages(limit);
      setTimeout(() => {
         const newHeight = node.scrollHeight;

         node.scrollTop = oldHeight - newHeight;
      }, 1000);
   }, [loadMessages, limit]);

   useEffect(() => {
      const node = selfRef.current;

      loadMessages();

      setTimeout(() => {
         node.scrollTop = node.scrollHeight;
      }, 1000);

      return () => {
         messagesRef.off('value');
      };
   }, [loadMessages]);

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
      async (msgId, file) => {
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
            // eslint-disable-next-line
            return Alert.error(error.message, 4000);
         }

         if (file) {
            try {
               console.log('URL to be deleted', file.url);
               const fileRef = storage.refFromURL(file.url);
               console.log('Path in Storage', fileRef.fullPath);
               await fileRef.delete();
            } catch (error) {
               Alert.error(error.message, 4000);
            }
         }
      },
      [chatId, messages]
   );

   const renderMessages = () => {
      const groups = groupBy(messages, item =>
         new Date(item.createdAt).toDateString()
      );
      const items = [];
      Object.keys(groups).forEach(date => {
         items.push(<li className="text-center mb-1 padded">{date}</li>);
         const msgs = groups[date].map(msg => (
            <li>
               <MessageItem
                  key={msg.id}
                  message={msg}
                  handleAdmin={handleAdmin}
                  handleLike={handleLike}
                  handleDelete={handleDelete}
               />
            </li>
         ));
         items.push(...msgs);
      });
      return items;
   };

   return (
      <ul className="msg-list custom-scroll" ref={selfRef}>
         {messages && messages.length === PAGE_SIZE && (
            <li className="text-center mt-2 mb-1">
               <Button color="green" onClick={onLoadMore}>
                  Load More
               </Button>
            </li>
         )}
         {isChatEmpty && <li>No messages yet...</li>}
         {canShowMessages && renderMessages()}
      </ul>
   );
};

export default Messages;
