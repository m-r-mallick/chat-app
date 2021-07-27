import React, { useEffect, useState } from 'react';
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import AvatarUploadBtn from './AvatarUploadBtn';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOut }) => {
   const { profile } = useProfile();
   const [avatarUrl, setAvatarUrl] = useState(null);

   const onSave = async newData => {
      const userNicknameRef = database
         .ref(`/profiles/${profile.uid}`)
         .child(`name`);
      try {
         await userNicknameRef.set(newData);
         Alert.success('Nickname has been updated', 4000);
      } catch (error) {
         Alert.error(error.message, 4000);
      }
   };

   useEffect(() => {
      // const getAvatar = () => {
      const userAvatarRef = database
         .ref(`/profiles/${profile.uid}`)
         .child(`avatar`);
      userAvatarRef.on('value', snap => {
         try {
            setAvatarUrl(snap.val());
         } catch (err) {
            userAvatarRef.off();
            Alert.error(err.message, 4000);
         }
      });

      return () => {
         if (userAvatarRef) {
            userAvatarRef.off();
         }
      };
   }, []);

   return (
      <>
         <Drawer.Header>
            <Drawer.Title>Dashboard</Drawer.Title>
         </Drawer.Header>

         <Drawer.Body>
            {avatarUrl && (
               <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ borderRadius: '10%' }}
               />
            )}
            <h1>Hey, {profile.name}</h1>
            <ProviderBlock />
            <Divider />
            <EditableInput
               name="nickname"
               initialValue={profile.name}
               onSave={onSave}
               label={<h6 className="mb-2">Nickname</h6>}
            />
            <AvatarUploadBtn />
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
