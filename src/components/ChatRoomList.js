import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert, Loader, Nav } from 'rsuite';
import { useRooms } from '../context/rooms.context';
import RoomItem from './RoomItem';

const ChatRoomList = ({ elHeight }) => {
   const rooms = useRooms();
   const location = useLocation();
   if (rooms && rooms.length > 0) {
      Alert.success(`Rooms fetched!`, 4000);
   }
   return (
      <Nav
         appearance="subtle"
         vertical
         reversed
         className="overflow y-scroll custom-scroll"
         style={{ height: `calc(100% - ${elHeight}px)` }}
         activeKey={location.pathname}
      >
         {!rooms && (
            <Loader center vertical content="Loading" speed="slow" size="md" />
         )}
         {rooms &&
            rooms.length > 0 &&
            rooms.map(room => {
               return (
                  <Nav.Item
                     componentClass={Link}
                     to={`/chat/${room.id}`}
                     key={room.id}
                     eventKey={`/chat/${room.id}`}
                  >
                     <RoomItem room={room} />
                  </Nav.Item>
               );
            })}
      </Nav>
   );
};

export default ChatRoomList;
