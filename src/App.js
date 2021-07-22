import React from 'react';
import { Route, Switch } from 'react-router-dom';

import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss';

function App() {
   return (
      <Switch>
         <Route exact path="/">
            Hello
         </Route>
      </Switch>
   );
}

export default App;
