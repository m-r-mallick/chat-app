import React, { useEffect, useRef, useState } from 'react';
import { Divider } from 'rsuite';
import ChatRoomList from './ChatRoomList';
import CreateRoomBtnModal from './CreateRoomBtnModal';
import DashboardToggle from './dashboard/DashboardToggle';

const Sidebar = () => {
   const topSideBarRef = useRef();
   const [height, setHeight] = useState(0);

   useEffect(() => {
      if (topSideBarRef.current) {
         setHeight(topSideBarRef.current.scrollHeight);
      }
   }, [topSideBarRef]);

   return (
      <div className="h-100 pt-2">
         <div ref={topSideBarRef}>
            <DashboardToggle />
            <CreateRoomBtnModal />
            <Divider>Join Conversation</Divider>
         </div>
         <ChatRoomList elHeight={height} />
      </div>
   );
};

export default Sidebar;
