import React from 'react';
import '../css/Auth.css';

const Signup = () => {
  return (
  <div className="auth-container">
    <h1>Sign Up</h1>
    <form>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username"/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="text" id="password" name="password"/>
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input type="text" id="confirm-password" name="confirm-password"/>
      </div>
      <button type="submit" id="" className="submit-button">create account</button>
      <div className="login-link">
        <p>Already a member? <a href="/" className="redirect-link">Login</a></p>
      </div>
    </form>
  </div>
  );
};

export default Signup;
