import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './components/context';

export default ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      { context => (
        <Route
          {...rest}
          render={props => context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Redirect to={{ // send the user to the previous location
                pathname: '/signin',
                state: { from: props.location }
              }} />
            )
          }
        />
      )}
    </Consumer>
  );
};
