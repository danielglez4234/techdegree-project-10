import React from 'react';

export default (props) => {
  // save the sent functions in the variables
  const {
    cancel,
    errors,
    submit,
    submitButtonText,
    elements,
  } = props;

  // when the submit button is pressed the submit() function is executed
  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  // when the cancel button is pressed the cancel() function is executed
  function handleCancel(event) {
    event.preventDefault();
    cancel();
  }

  return (
    <div>
      <ErrorsDisplay errors={errors} /> {/*the errors will be shown here*/}
      <form onSubmit={handleSubmit}>
        {/*elements() is the function that retains the inputs sent by the other components*/}
        {elements()}
        <div className="pad-bottom">
          <button className="button" type="submit">{submitButtonText}</button>
          <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function ErrorsDisplay({ errors }) {
  let errorsDisplay = null; // if there are no errors nothing is shown

  if (errors.length) { // will display the errors that were received
    errorsDisplay = (
      <div className="validation-errors-container">
        <h2 className="validation--errors--label">Validation errors</h2>
        <div className="validation-errors">
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  return errorsDisplay;
}
