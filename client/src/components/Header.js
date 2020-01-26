import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.PureComponent {
  render(){
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser; // seeing if there is an authenticated user
    return(
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo"><Link to="/courses">Courses</Link></h1>
          <nav>
          {/* if there is an authenticated user the message "welcome *name_of_the_user*"
          will be displayed, if not the signup and signIn buttons will be displayed */}
          {authenticatedUser ?
            <React.Fragment>
              <span className="userName">Welcome, {authenticatedUser.firstName} {authenticatedUser.lastName}!</span>
              <Link className="signout" to="/signout">Sign Out</Link>
            </React.Fragment>
          :
            <React.Fragment>
              <Link className="signup" to="/signup">Sign Up</Link>
              <Link className="signin" to="/signin">Sign In</Link>
            </React.Fragment>
          }
          </nav>
        </div>
      </div>
    );
  }
}


export default Header;
