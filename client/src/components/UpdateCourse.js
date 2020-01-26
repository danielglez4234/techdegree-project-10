import React, { PureComponent } from 'react';
import Form from './Form';

// import UnhandledError from './UnhandledError';
// import NotFound from './NotFound';
import Forbidden from './Forbidden';

class UpdateCourse extends PureComponent  {
  constructor() {
    super();
    this.state = {
      course: {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: ''
      },
      user: {},
      loading: true,
      errors: []
    };
  }

  componentDidMount() {
    // get the course data with the id sent from "/courses"
    fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        course: response.courses, // course data
        user: response.courses.Owner, // Owner of the course data
        loading: false
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
  const { errors } = this.state;
  const {
    title,
    description,
    estimatedTime,
    materialsNeeded,
    userId
  } = this.state.course;
  let { firstName, lastName } = this.state.user;

  return (
  <div>
    {
    // this option is set here to avoid flickering when loading the page
    (this.state.loading) ? '' :
    // if the user id does not match the id of the course owner, it will be redirected to the Forbidden component
    (userId === authenticatedUser.id)
      ?
    <div className="bounds course--detail">
      <h1>Update Course</h1>
      <div>
        {/*the inputs are shown using the FORM component which displays both errors and submit and cancel buttons*/}
        <Form
        cancel={this.cancel}
        errors={errors}
        submit={this.submit}
        submitButtonText="Update Course"
        elements={() => (
        <React.Fragment>
        <div className="grid-66">
          <div className="course--header">
            <h4 className="course--label course--label--datials">Course</h4>
            <div>
              <input
              id="title"
              name="title"
              type="text"
              className="input-title course--title--input"
              onChange={this.change}
              value={title}
              placeholder="Course title..." />
            </div>
            <p className="userName">By {firstName} {lastName}</p>
          </div>
          <div className="course--description">
            <div><textarea
            id="description"
            name="description"
            className=""
            onChange={this.change}
            value={description}
            placeholder="Course description..."></textarea></div>
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                <h4>Estimated Time</h4>
                <div>
                  <input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="text"
                  className="course--time--input"
                  onChange={this.change}
                  value={estimatedTime}
                  placeholder="Hours" />
                </div>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                <div><textarea
                id="materialsNeeded"
                name="materialsNeeded"
                className=""
                onChange={this.change}
                value={materialsNeeded}
                placeholder="List materials..."></textarea></div>
              </li>
            </ul>
          </div>
        </div>
        </React.Fragment>
        )} />
      </div>
    </div>
    :
    <Forbidden />
    }
  </div>
  );
}

  // add the values that are written in the inputs to the course state
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      course: {
        ...this.state.course,
        [name]: value
      }
    })
  };

  // handle the course update
  submit = () => {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const emailAddress = authenticatedUser.emailAddress;
    const password = context.password;
    // update the course by calling the function found in "Data.js" by sending the user, the password, the course data and the id of the course
    context.data.updateCourse(emailAddress, password, this.state.course, this.state.course.id)
    .then( errors => { // if there is any error it is saved in the errors state and then displayed by the form
      if (errors.length) {
        this.setState({ errors });
      } else { // if there are no errors, it sends you to the CourseDetail of that course
         this.props.history.push(`/courses/${this.state.course.id}`);
      }
    })
    .catch( err => { // handle rejected promises
      console.log(err);
      this.props.history.push('/error'); // push to history stack
    })
  }

  // sends you to the CourseDetail page when you press the cancel button
  cancel = () => {
    this.props.history.push(`/courses/${this.state.course.id}`);
  }
}
export default UpdateCourse;
