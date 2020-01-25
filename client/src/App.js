import React, { Component } from 'react';
// import axios from 'axios';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import CourseDetail from './components/CourseDetail';

import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';

import UnhandledError from './components/UnhandledError';
import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';

import withContext from './components/context';
import PrivateRoute from './PrivateRoute';
// Connect the Header component to context
const HeaderWithContext = withContext(Header);
// Connect UserSign to context
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
// Connect courses to context
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CourseDetailWithContext = withContext(CourseDetail);


class App extends Component {

  render(){
    return (
      <BrowserRouter>{/*managing routes*/}
      <HeaderWithContext />
        <Switch>
          <Route exact path="/" render={() => <Redirect to='/courses' /> } />
          <Route exact path="/courses" component={Courses} />
          <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
          <PrivateRoute exact path="/courses/:id/update" component={UpdateCourseWithContext} />
          <Route exact path="/courses/:id" component={CourseDetailWithContext} />

          <Route exact path="/signin" component={UserSignInWithContext} />
          <Route exact path="/signup" component={UserSignUpWithContext} />
          <Route exact path="/signout" component={UserSignOutWithContext} />

          <Route exact path="/error" component={UnhandledError} />
          <Route exact path="/forbidden" component={Forbidden} />
          <Route exact path="/notfound" component={NotFound} />

          <Route component={NotFound} /> {/*only appears when no route matches*/}
        </Switch>
        {/* console.log(this.state.courses) */}
      </BrowserRouter>

    );
  }
}

export default App;
