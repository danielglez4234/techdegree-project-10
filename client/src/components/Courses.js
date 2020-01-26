import React, { Component  } from 'react';
import { Link } from 'react-router-dom';

import CourseItem from './CourseItem';


class Courses extends Component   {
  constructor() {
		super();
		this.state = {
			courses: [],
      loading: true
		};
	}

	componentDidMount() {
    // get the courses data
		fetch('http://localhost:5000/api/courses')
		.then(response => response.json())
		.then(response => {
			this.setState({
				courses: response.courses,
        loading: false
			});
		})
		.catch( () => {
      // if the request cannot be made the error page will be displayed
			const { history } = this.props;
			history.push('/error');
		});
	}


	render() {
		let courses;
    const requestData = this.state.courses;
      // shows all courses obtained with the request
  		courses = requestData.map( course => (
  			<CourseItem
  				id={course.id}
          key={course.id}
  				detailId={`/courses/${course.id}`}
  				title={course.title}
  			/>
  		));

    return(
      <div className="bounds">
        <div className="container_animation">
        {/*this condition is here so that the text "loading .." appears when the courses page loads*/}
          { (this.state.loading) ? <h3 className="loading">Loading....</h3> : courses }

          <div className="grid-33">
            <Link className="course--module course--add--module" to="courses/create">
              <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
              <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default Courses;
