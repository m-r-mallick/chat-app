import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery } from '../../../misc/custom-hooks';
import RoomInfoBtnModal from './RoomInfoBtnModal';

const ChatTop = () => {
   const name = useCurrentRoom(val => val.name);
   const isMobile = useMediaQuery(`(max-width: 992px)`);
   return (
      <div>
         <div className="d-flex justify-content-between align-items-center">
            <h4 className="text-disappear d-flex align-items-center">
               <Icon
                  componentClass={Link}
                  to="/"
                  icon="arrow-circle-left"
                  size="2x"
                  className={
                     isMobile
                        ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                        : 'd-none'
                  }
               />
               <span>{name}</span>
            </h4>
            <ButtonToolbar className="ws-nowrap">todos</ButtonToolbar>
         </div>
         <div className="d-flex justify-content-between align-items-center">
            <span>todos</span>
            <RoomInfoBtnModal />
         </div>
      </div>
   );
};

export default memo(ChatTop);
