import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'rsuite';
import { auth, database } from '../misc/firebase';

const ProfileContext = createContext();
const ProfileProvider = ({ children }) => {
   const [profile, setProfile] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      let userRef;
      const authUnsub = auth.onAuthStateChanged(authObj => {
         if (authObj) {
            userRef = database.ref(`/profiles/${authObj.uid}`);
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
         } else {
            if (userRef) {
               userRef.off();
            }
            setProfile(null);
            setIsLoading(false);
         }
      });

      return () => {
         authUnsub();
         if (userRef) {
            userRef.off();
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
