import React, { createContext, useContext, useEffect, useState } from 'react';
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
            Alert.success(`Rooms fetched!`, 4000);

            setRooms(data);
         } catch (error) {
            Alert.error(error.message, 4000);
         }
      });

      return () => {
         roomListRef.off();
      };
   }, []);
   return (
      <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
   );
};

export default RoomsProvider;

export const useRooms = () => {
   return useContext(RoomsContext);
};
