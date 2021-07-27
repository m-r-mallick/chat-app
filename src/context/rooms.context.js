import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'rsuite';
import { database } from '../misc/firebase';
import { transformToArrayWithId } from '../misc/helpers';

const RoomsContext = createContext();

const RoomsProvider = ({ children }) => {
   const [rooms, setRooms] = useState(null);
   useEffect(() => {
      const roomListRef = database.ref(`rooms`);
      roomListRef.on('value', snap => {
         try {
            const data = transformToArrayWithId(snap.val());
            setRooms(data);
            Alert.success(`Room ${rooms[0].name} fetched!`, 4000);
         } catch (error) {
            Alert.error(error.message, 4000);
         }
      });

      return () => {
         roomListRef.off();
      };
   }, []);
   return <RoomsContext.Provider value>{children}</RoomsContext.Provider>;
};

export default RoomsProvider;
