// Function to validate if a string is a valid email address
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

// Function to validate if a password is at least 8 characters long
const isPassword8 = (string) => {
  if (String(string).length < 8) return true;
  else return false;
};

// Function to check if a string is empty or consists only of whitespaces
const isEmpty = (string) => {
  if (!string) return true;
  if (String(string).trim() === '') return true;
  else return false;
};

// Function to validate if a phone number is in a specific format
const isMobile = (string) => {
  if (!string) return false;
  if (String(string).trim() === '') return false;
  if (String(string).trim().charAt(0) !== '9') return true;
  if (String(string).trim().length !== 10) return true;
  else return false;
};

// Function to validate signup data
const validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.firstName)) errors.firstName = 'First Name must not be empty';
  if (isEmpty(data.lastName)) errors.lastName = 'Last Name must not be empty';
  if (isEmpty(data.email)) errors.email = 'Email must not be empty';
  if (!isEmail(data.email)) errors.email = 'Email is not valid';
  if (isEmpty(data.password)) errors.password = 'Password must not be empty';
  if (isPassword8(data.password)) errors.password = 'Password must be 8 characters';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

// Function to validate create record data
const validateCreateRecord = (data) => {
  let errors = {};

  if (isEmpty(data.firstName)) errors.firstName = 'First Name must not be empty';
  if (isEmpty(data.lastName)) errors.lastName = 'Last Name must not be empty';
  if (isEmpty(data.email)) errors.email = 'Email must not be empty';
  if (!isEmail(data.email)) errors.email = 'Email is not valid';
  if (isEmpty(data.address)) errors.address = 'Address must not be empty';
  if (isEmpty(data.membershipFee)) errors.membershipFee = 'Membership Package is Required';
  if (isEmpty(data.phone)) errors.phone = 'Phone is Required';
  if (isMobile(data.phone)) errors.phone = 'Phone is Invalid';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

// Function to validate login data
const validateLoginData = (data) => {
  let errors = {};

  if (isEmail(data.email));
  if (isEmpty(data.password)) errors.password = 'Password must be empty';
  if (isPassword8(data.password)) errors.password = 'Password must be 8 characters';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

module.exports = {
  validateSignupData,
  validateCreateRecord,
  validateLoginData,
};
