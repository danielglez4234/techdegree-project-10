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
    fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        course: response.courses,
        user: response.courses.Owner,
        loading: false
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
    (this.state.loading) ? '' :
    (userId === authenticatedUser.id)
      ?
    <div className="bounds course--detail">
      <h1>Update Course</h1>
      <div>
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
            <p>By {firstName} {lastName}</p>
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

    context.data.updateCourse(emailAddress, password, this.state.course, this.state.course.id)
    .then( errors => {
      if (errors.length) {
        this.setState({ errors });
      } else {
         this.props.history.push(`/courses/${this.state.course.id}`);
      }
    })
    .catch( err => {
      console.log(err);
      this.props.history.push('/error');
    })
  }

  cancel = () => {
    this.props.history.push(`/courses/${this.state.course.id}`);
  }
}
export default UpdateCourse;
