import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from '../../Data';
const Context = React.createContext();

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    password: Cookies.getJSON('password') || null
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const { authenticatedUser } = this.state;
    const { password } = this.state;
    const value = {
      authenticatedUser,
      password,
      data: this.data,
      actions: { // Add the 'actions' property and object
        signIn: this.signIn,
        signOut: this.signOut
      }
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>
    );
  }

  // signIn: Verify the username and password by calling the getUser function
  // and change the authenticatedUser and password states with the user data
  signIn = async (username, password) => {
    const userPass = password;
    const user = await this.data.getUser(username, password);
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,
          password: userPass
        };
      });
      // Set cookie
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
      Cookies.set('password', JSON.stringify(userPass), { expires: 1 });
    }
    return user;
  }

  // signOut: resets the authenticatedUser and password states
  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
        password: null
      };
    });
    Cookies.remove('authenticatedUser');
    Cookies.remove('password');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
