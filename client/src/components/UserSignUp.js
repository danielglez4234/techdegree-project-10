import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: [],
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin signin-animation">
          <h1>Sign Up</h1>
          {/*the inputs are shown using the FORM component which displays both errors and submit and cancel buttons*/}
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={this.change}
                  placeholder="firstName" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={this.change}
                    placeholder="lastName" />
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  onChange={this.change}
                  placeholder="Email Address" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.change}
                  placeholder="Password" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={this.change}
                  placeholder="Confirm Password" />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link className="clickHere" to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    const { context } = this.props;

    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;
    // New user payload
    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    // if the password and confirmPassword variables are different, it will send an error, otherwise it will continue
    if ( password !== confirmPassword) {
      this.setState({ errors: ['The passwords don\'t match, please try again'] });

    } else {
      // signUp the user by calling the function found in "Data.js" by sending the user data
      // and then call the signIn function found in the context to log the user
      context.data.createUser(user)
      .then( errors => { // if there is any error it is saved in the errors state and then displayed by the form
        if (errors.length) {
          this.setState({ errors });
        } else {
          // signIn the user by sending the emailAddress and the password
          context.actions.signIn(emailAddress, password)
            .then(() => {
              this.props.history.push('/courses');
            });
        }
      })
      .catch( err => { // handle rejected promises
        console.log(err);
        this.props.history.push('/error'); // push to history stack
      });
    }
  }

  // sends you to the home page when you press the cancel button
  cancel = () => {
    this.props.history.push('/courses');
  }
}
