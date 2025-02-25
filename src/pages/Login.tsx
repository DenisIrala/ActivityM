import { FC } from 'react';

const Login: FC = () => {
  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username"/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="text" id="password" name="password"/>
        </div>
        <button type="submit" id="" className="submit-button">login</button>
        <div className="signup-link">
          <p>Not a member yet? <a href="/signup" className="redirect-link">Sign Up</a></p>
        </div>
      </form>
    </div>
    );
  };
  
  export default Login;
