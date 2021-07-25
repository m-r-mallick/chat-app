import React from 'react';
import { Button, Drawer, Icon } from 'rsuite';
import { useModelState } from '../../misc/custom-hooks';
import Dashboard from '.';

const DashboardToggle = () => {
   const { isOpen, open, close } = useModelState();
   return (
      <>
         <Button block color="blue">
            <Icon icon="dashboard" /> Dashboard
         </Button>
         <Drawer show={isOpen} onHide={close} placement="left">
            <Dashboard />
         </Drawer>
      </>
   );
};

export default DashboardToggle;