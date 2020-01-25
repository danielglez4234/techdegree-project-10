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
    fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        course: response.courses,
        user: response.courses.Owner
      });
    })
    .catch( () => {
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
              (authenticatedUser === null) ? '' :
                (userId === authenticatedUser.id) ?
                <div className="div_update_delete">
                  <Link className="button button--update" to={updateUrl} >Update Course</Link>
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
              <p>By {firstName} {lastName}</p>
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

    context.data.deleteCourse(emailAddress, password, this.state.course.id)
    .then( errors => {
      if (errors.length) {
         this.props.history.push('/error');
      } else {
         this.props.history.push('/courses');
      }
    })
    .catch( err => {
      console.log(err);
      this.props.history.push('/error');
    })
  }
}
export default CourseDetail;
