import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from 'rsuite';
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
               const { name, createdAt } = snap.val();
               console.log(name, createdAt);
               const data = {
                  name,
                  createdAt,
                  uid: authObj.uid,
                  email: authObj.email,
               };
               setProfile(data);
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
         <Button
            onClick={() => {
               setProfile(null);
               setTimeout(() => setIsLoading(false), 3000);
            }}
         >
            Sign Out
         </Button>
         {children}
      </ProfileContext.Provider>
   );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileProvider;
