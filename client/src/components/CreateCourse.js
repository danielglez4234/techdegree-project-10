import React, { PureComponent } from 'react';
import Form from './Form';

// import UnhandledError from './UnhandledError';

class CreateCourse extends PureComponent  {
  state = {
    course: {
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: ''
    },
    errors: []
  }

render(){
  const { context } = this.props;
  const authUser = context.authenticatedUser;
  const { errors } = this.state;
  const {
    title,
    description,
    estimatedTime,
    materialsNeeded,
  } = this.state.course;
  return (
    <div className="bounds course--detail">
      <h1>Create Course</h1>
      <div>
        <Form
        cancel={this.cancel}
        errors={errors}
        submit={this.submit}
        submitButtonText="Create Course"
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
            <p>By {authUser.firstName} {authUser.lastName}</p>
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
  );
}
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

  submit = () => {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    const emailAddress = authenticatedUser.emailAddress;
    const password = context.password;

    context.data.createCourse(emailAddress, password, this.state.course)
    .then( errors => {
      if (errors.length) {
        this.setState({ errors });
      } else {
         this.props.history.push('/courses');
      }
    })
    .catch( err => {
      console.log(err);
      this.props.history.push('/error');
    })
  }

  cancel = () => {
    this.props.history.push('/');
  }
}
export default CreateCourse;
