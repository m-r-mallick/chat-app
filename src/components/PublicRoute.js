import React, { useState } from 'react';
import { Redirect, Route } from 'react-router';

const PublicRoute = ({ children, ...routeProps }) => {
   const [profile, setProfile] = useState(false);

   if (profile) {
      return <Redirect to="/" />;
   }

   return (
      <div>
         <Route {...routeProps}>{children}</Route>
      </div>
   );
};

export default PublicRoute;
