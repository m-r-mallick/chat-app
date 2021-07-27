import React from 'react';
import { Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/home/index';

import 'rsuite/dist/styles/rsuite-default.css';
import SignIn from './pages/SignIn';
import ProfileProvider from './context/profile.context';
import './styles/main.scss';

function App() {
   return (
      <ProfileProvider>
         <Switch>
            <PublicRoute path="/signin">
               <SignIn />
            </PublicRoute>
            <PrivateRoute path="/">
               <Home />
            </PrivateRoute>
         </Switch>
      </ProfileProvider>
   );
}

export default App;
