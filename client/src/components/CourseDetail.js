import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from "react-markdown";


class CourseDetail extends Component  {
  constructor() {
    super();
    this.state = {
      course: [],
      user: {},
    };
  }

  componentDidMount() {
    // get the course data with the id sent from "/courses"
    fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        course: response.courses, // course data
        user: response.courses.Owner // Owner of the course data
      });
    })
    .catch( () => {
      // if the requested id is not in the database the notFound page will be displayed
      const { history } = this.props;
      history.push('/notFound');
    });
  }

  render(){
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    let {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId
    } = this.state.course;

    const { firstName, lastName } = this.state.user;

    // if estimatedTime or materialsNeeded are empty the word "None" will be shown in the inputs
    if (estimatedTime === null || estimatedTime === '') {
      estimatedTime = 'None';
    }
    if (materialsNeeded === null || materialsNeeded === '') {
      materialsNeeded = 'None';
    }
    const updateUrl = `/courses/${id}/update`;
    return (
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
            <span>
              {
              // if there is no authenticated user the update and delete buttons will not be displayed
              (authenticatedUser === null) ? '' :
                // Only the user who is the author of the deployed course can see the uppdate and delete buttons
                (userId === authenticatedUser.id) ?
                <div className="div_update_delete">
                  <Link className="button button--update" to={updateUrl} >Update Course</Link>
                  {/* delete the course when clicked */}
                  <button className="button button--delete" onClick={this.handleDelete}>Delete Course</button>
                </div>
              : ''
              }
            </span>
            <Link className="button button-secondary" to="/courses">Return to List</Link></div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label course--label--datials">Course</h4>
              <h3 className="course--title">{title}</h3>
              <p className="capitalize">By {firstName} {lastName}</p>
            </div>
            <div className="course--description">
              <ReactMarkdown source={description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    <ReactMarkdown source={materialsNeeded} />
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }


  handleDelete = () => {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const emailAddress = authenticatedUser.emailAddress;
    const password = context.password;
    // delete the course by calling the function found in "Data.js" by sending the user, the password and the id of the course
    context.data.deleteCourse(emailAddress, password, this.state.course.id)
    .then( errors => { // if there is any error the "/error" page will be displayed
      if (errors.length) {
         this.props.history.push('/error');
      } else {
         this.props.history.push('/courses');
      }
    })
    .catch( err => { // handle rejected promises
      console.log(err);
      this.props.history.push('/error'); // push to history stack
    })
  }
}
export default CourseDetail;
