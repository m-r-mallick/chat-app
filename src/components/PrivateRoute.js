import React, { useState } from 'react';
import { Redirect, Route } from 'react-router';

const PrivateRoute = ({ children, ...routeProps }) => {
   const [profile, setProfile] = useState(true);

   if (!profile) {
      return <Redirect to="/signin" />;
   }

   return (
      <div>
         <Route {...routeProps}>{children}</Route>
      </div>
   );
};

export default PrivateRoute;
