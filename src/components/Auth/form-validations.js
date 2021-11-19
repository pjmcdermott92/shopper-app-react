import { REGEX_PATTERNS } from "../../constants";

export const validateLogin = ({ email, password }) => {
    let errors = {};
    if (!REGEX_PATTERNS.EMAIL.test(email)) errors = { ...errors, email: 'Please enter a vaild Email Address' };
    if (password.length < 1) { errors = { ...errors, password: 'Please enter your Password' }; };
    return errors;
}

export const validateRegister = ({ firstname, lastname, email, password, password2 }) => {
    let errors = {};
    if (firstname.length < 2) errors = { ...errors, firstname: 'Please enter your First Name' };
    if (lastname.length < 2) errors = { ...errors, lastname: 'Please enter your Last Name' };
    if (!REGEX_PATTERNS.EMAIL.test(email)) errors = { ...errors, email: 'Please enter a valid Email Address' };
    if (!REGEX_PATTERNS.PASSWORD.test(password)) errors = { ...errors, password: 'Please enter a valid Password' };
    if (password !== password2) errors = { ...errors, password2: 'Passwords do not match' }
    return errors;
}
