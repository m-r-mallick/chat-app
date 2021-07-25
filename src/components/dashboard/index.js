import React from 'react';
import { Button, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';

const Dashboard = ({ onSignOut }) => {
   const { profile } = useProfile();

   return (
      <>
         <Drawer.Header>
            <Drawer.Title>Dashboard</Drawer.Title>
         </Drawer.Header>

         <Drawer.Body>
            <h1>Hey, {profile.name}</h1>
         </Drawer.Body>

         <Drawer.Footer>
            <Button block color="red" onClick={onSignOut}>
               Sign Out
            </Button>
         </Drawer.Footer>
      </>
   );
};

export default Dashboard;
