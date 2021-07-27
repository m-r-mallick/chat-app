import React, { useState } from 'react';
import { Alert, Button, Icon, Tag } from 'rsuite';
import firebase from 'firebase/app';
import { auth } from '../../misc/firebase';

const ProviderBlock = () => {
   const [isConnected, setIsConnected] = useState({
      'google.com': auth.currentUser.providerData.some(
         data => data.providerId === 'google.com'
      ),
      'facebook.com': auth.currentUser.providerData.some(
         data => data.providerId === 'facebook.com'
      ),
   });
   const updateIsConnected = (providerId, value) => {
      setIsConnected(prevState => {
         return { ...prevState, [providerId]: value };
      });
   };
   const unlink = async providerId => {
      try {
         if (auth.currentUser.providerData.length === 1) {
            throw new Error(`You can not disconnect from ${providerId}`);
         }
         await auth.currentUser.unlink(providerId);
         updateIsConnected(providerId, false);
         Alert.info(`Disconnected from ${providerId}`, 4000);
      } catch (error) {
         Alert.error(error.message, 4000);
      }
   };
   const link = async provider => {
      try {
         await auth.currentUser.linkWithPopup(provider);
         updateIsConnected(provider.providerId, true);
         Alert.info(`Linked to ${provider.providerId}`, 4000);
      } catch (error) {
         Alert.error(error.message, 4000);
      }
   };
   const unlinkGoogle = () => {
      unlink('google.com');
   };
   const unlinkFacebook = () => {
      unlink('facebook.com');
   };
   const linkGoogle = () => {
      link(new firebase.auth.GoogleAuthProvider());
   };
   const linkFacebook = () => {
      link(new firebase.auth.FacebookAuthProvider());
   };

   return (
      <div>
         {isConnected['google.com'] && (
            <Tag closable color="green" onClose={unlinkGoogle}>
               <Icon icon="google" className="mr-1" /> Connected
            </Tag>
         )}
         {isConnected['facebook.com'] && (
            <Tag closable color="blue" onClose={unlinkFacebook}>
               <Icon icon="facebook" className="mr-1" /> Connected
            </Tag>
         )}
         <div className="mt-2">
            {!isConnected['google.com'] && (
               <Button block color="green" onClick={linkGoogle}>
                  <Icon icon="google" /> Link to Google
               </Button>
            )}
            {!isConnected['facebook.com'] && (
               <Button block color="blue" onClick={linkFacebook}>
                  <Icon icon="facebook" /> Link to Facebook
               </Button>
            )}
         </div>
      </div>
   );
};

export default ProviderBlock;