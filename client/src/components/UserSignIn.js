import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin signin-animation">
          <h1>Sign In</h1>
          {/*the inputs are shown using the FORM component which displays both errors and submit and cancel buttons*/}
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  onChange={this.change}
                  placeholder="User Name" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.change}
                  placeholder="Password" />
              </React.Fragment>
            )} />
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link className="clickHere" to="/signup">Click here</Link> to sign up!</p>
        </div>
      </div>
    );
  }

  // add the values that are written in the inputs to the states
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  // handle the user signIn
  submit = () => {
    const { context } = this.props;
    // Save in the variable the location placed in the PrivateRoute component in this case
    // the last one in which the user was, if there is no location the user will be sent to '/courses'
    const { from } = this.props.location.state || { from: { pathname: '/courses' } };
    const { emailAddress, password } = this.state;

    // signIn the user by calling the function found in "Data.js" by sending the emailAddress and the password
    context.actions.signIn(emailAddress, password)
    .then( user => { // if there is any error it is saved in the error state and then displayed by the form
      if (user === null) {
        this.setState(() => {
          return { errors: [ 'The username or password you entered is incorrect, please try again.' ] };
        });
      } else {
         this.props.history.push(from);
         console.log(`SUCCESS! ${emailAddress} is now signed in!`);
      }
    })
    .catch( err => { // handle rejected promises
      console.log(err);
      this.props.history.push('/error'); // push to history stack
    })
  }

  // sends you to the home page when you press the cancel button
  cancel = () => {
    this.props.history.push('/courses');
  }
}
