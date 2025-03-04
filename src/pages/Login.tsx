import React, { useState } from "react";
import "../css/Auth.css";

type LoginFormData = {
  username: string;
  password: string;
};

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "username" && value.length < 3) {
      error = "Username must be at least 3 characters long.";
    }

    if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters long.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate input field on change
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation before submission
    const newErrors: Partial<LoginFormData> = {};
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
      if (errors[key as keyof LoginFormData]) {
        newErrors[key as keyof LoginFormData] =
          errors[key as keyof LoginFormData];
      }
    });

    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors);
      return;
    }

    console.log("Login successful:", formData);
    alert("Login successful! (Simulated API Response)");
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={Object.values(errors).some((err) => err)}
        >
          Login
        </button>

        <div className="signup-link">
          <p>
            Not a member yet?{" "}
            <a href="/signup" className="redirect-link">
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
