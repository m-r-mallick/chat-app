import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'rsuite';
import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';

const ProfileContext = createContext();

export const isOfflineForDatabase = {
   state: 'offline',
   last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
   state: 'online',
   last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileProvider = ({ children }) => {
   const [profile, setProfile] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      let userRef;
      let userStatusRef;
      const authUnsub = auth.onAuthStateChanged(authObj => {
         if (authObj) {
            userRef = database.ref(`/profiles/${authObj.uid}`);
            userStatusRef = database.ref(`/status/${authObj.uid}`);
            userRef.on('value', snap => {
               try {
                  const { name, createdAt, avatar } = snap.val();
                  console.log('Current Login - ', { name });
                  const data = {
                     name,
                     createdAt,
                     avatar,
                     uid: authObj.uid,
                     email: authObj.email,
                  };
                  setProfile(data);
               } catch (error) {
                  Alert.error(`Error - ${error.message}`, 4000);
                  if (userRef) {
                     userRef.off();
                  }
                  setProfile(null);
                  setIsLoading(false);
               }
            });

            database.ref('.info/connected').on('value', snapshot => {
               if (!!snapshot.val() === false) {
                  return;
               }
               userStatusRef
                  .onDisconnect()
                  .set(isOfflineForDatabase)
                  .then(() => {
                     userStatusRef.set(isOnlineForDatabase);
                  });
            });
         } else {
            if (userRef) {
               userRef.off();
            }
            if (userStatusRef) {
               userStatusRef.off();
            }
            database.ref('.info/connected').off();
            setProfile(null);
            setIsLoading(false);
         }
      });

      return () => {
         authUnsub();
         database.ref('.info/connected').off();
         if (userRef) {
            userRef.off();
         }
         if (userStatusRef) {
            userStatusRef.off();
         }
      };
   }, []);
   return (
      <ProfileContext.Provider value={{ isLoading, profile }}>
         {children}
      </ProfileContext.Provider>
   );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileProvider;
