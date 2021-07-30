import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';

function assembleMessage(profile, chatId) {
   return {
      roomId: chatId,
      author: {
         name: profile.name,
         uid: profile.uid,
         createdAt: profile.createdAt,
         ...(profile.avatar ? { avatar: profile.avatar } : {}),
      },
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      likeCount: 0,
   };
}
const ChatBottom = () => {
   const [input, setInput] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { profile } = useProfile();
   const { chatId } = useParams();
   const onInputChange = useCallback(value => {
      setInput(value);
   }, []);
   const onSend = async () => {
      if (input.trim() === ``) {
         return;
      }
      const msgData = assembleMessage(profile, chatId);
      msgData.text = input;

      const updates = {};

      const messageId = database.ref(`messages`).push().key;
      updates[`/messages/${messageId}`] = msgData;
      updates[`rooms/${chatId}/lastMessage`] = {
         ...msgData,
         msgId: messageId,
      };
      setIsLoading(true);
      try {
         await database.ref().update(updates);
         setInput(``);
         setIsLoading(false);
      } catch (error) {
         Alert.error(error.message, 4000);
         setIsLoading(false);
      }
   };

   const onKeyDown = event => {
      if (event.keyCode === 13) {
         event.preventDefault();
         onSend();
      }
   };

   const afterUpload = useCallback(async files => {
      setIsLoading(true);
      const updates = {};

      files.forEach(file => {
         const msgData = assembleMessage(profile, chatId);
         msgData.file = file;
         const messageId = database.ref(`messages`).push().key;
         updates[`/messages/${messageId}`] = msgData;
      });
      const lastMsgId = Object.keys(updates).pop();
      updates[`/rooms/${chatId}/lastMessage`] = {
         ...updates[lastMsgId],
         msgId: lastMsgId,
      };
      try {
         await database.ref().update(updates);
         setInput(``);
         setIsLoading(false);
      } catch (error) {
         Alert.error(error.message, 4000);
         setIsLoading(false);
      }
   }, []);

   return (
      <div>
         <InputGroup>
            <AttachmentBtnModal afterUpload={afterUpload} />

            <Input
               placeholder="Write a new message here..."
               value={input}
               onChange={onInputChange}
               onKeyDown={onKeyDown}
            />
            <InputGroup.Button
               color="blue"
               appearance="primary"
               onClick={onSend}
               disabled={isLoading}
            >
               <Icon icon="send" />
            </InputGroup.Button>
         </InputGroup>
      </div>
   );
};

export default ChatBottom;
