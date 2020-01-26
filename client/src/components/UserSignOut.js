import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({ context }) => {
  // Call the sigOut function that resets the authenticatedUser and password states,
  // and then sends you the home page
  context.actions.signOut();
  return (
    <Redirect to="/courses" />
  );
}
