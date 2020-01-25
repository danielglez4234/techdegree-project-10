import React from 'react';
import { Link } from 'react-router-dom';

const CourseItem = ({ detailId, title }) => {
  return(
    <div className="grid-33"><Link className="course--module course--link" to={ detailId }>
        <h4 className="course--label">Course</h4>
        <h3 className="course--title">{ title }</h3>
    </Link></div>
  );
}

export default CourseItem;
