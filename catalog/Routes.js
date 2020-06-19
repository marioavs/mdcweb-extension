import React from 'react';
import {Route} from 'react-router-dom';

import ButtonCatalog from './ButtonCatalog';
import TreeviewCatalog from './TreeviewCatalog';

const routesList = [{
  urlPath: 'button',
  Component: ButtonCatalog,
}, {
  urlPath: 'treeview',
  Component: TreeviewCatalog,
}];

const Routes = () => {
  return (
    routesList.map((route) => {
      const {Component, urlPath} = route;
      return (
        <Route
          key={urlPath}
          path={`/component/${urlPath}`}
          render={(props) => <Component {...props}/>} />
      );
    })
  );
}

export default Routes;
