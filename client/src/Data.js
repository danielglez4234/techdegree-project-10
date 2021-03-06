import config from './config';

export default class Data {
  // make the request to the api with the parameters that were sent
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) { // if there is a body it converts it to string
      options.body = JSON.stringify(body);
    }
    // Check if auth is required
    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }


// ------------------ Users ----------------------------------------

  async getUser(emailAddress, password) { // add new parameters
    const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  async createUser(user) { // create a new user
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }


// ------------------ Courses ----------------------------------------

  async createCourse(emailAddress, password, course){ // create a new course
    const response = await this.api('/courses', 'POST', course, true, {emailAddress, password});
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else if (response.status === 500) {
      this.props.history.push('/error');
    }
    else {
      throw new Error();
    }
  }

  async updateCourse(emailAddress, password, course, id){ // update a course
    const response = await this.api(`/courses/${id}`, 'PUT', course, true, {emailAddress, password});
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else if (response.status === 401) {
      this.props.history.push('/forbidden');
    }
    else if (response.status === 500) {
      this.props.history.push('/error');
    }
    else {
      throw new Error();
    }
  }

  async deleteCourse(emailAddress, password, id){ // deletre a course
    const response = await this.api(`/courses/${id}`, 'DELETE', null, true, {emailAddress, password});
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else if (response.status === 500) {
      this.props.history.push('/error');
    }
    else {
      throw new Error();
    }
  }

}
