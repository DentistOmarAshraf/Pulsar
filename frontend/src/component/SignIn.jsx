import { useEffect, useState } from "react";
import { useAuth } from "../AuthComponent/AuthProvider";
import "./SignIn.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api_error: "",
  });
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "", api_error: "" });
  }

  function validateEmail(email) {
    return /\S+@\S+.\S+/.test(email);
  }

  function validateForm() {
    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid Email";
    }
    if (formData.password.length < 4) {
      newErrors.password = "Invalid Password";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      axios
        .post("http://localhost:5001/signin", {
          email: formData.email,
          password: formData.password,
        })
        .then((response) => {
          setUser({ token: response.data.token });
          navigate(from, { replace: true });
        })
        .catch((error) => setErrors({ api_error: error.response.data.error }));
    }
  }
  return (
    <form onSubmit={handleSubmit} className="signin__container">
      {errors.api_error && <p className="errors_visable">{errors.api_error}</p>}
      <label>Email</label>
      <input
        type="text"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <p className={errors.email ? "errors_visable" : "errors"}>
        * Invalid E-mail
      </p>
      <label>password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <p className={errors.password ? "errors_visable" : "errors"}>
        * Invalid Password
      </p>
      <button type="submit">Sign In</button>
      <p className="new_account">
        don't have Account <a href="http://google.com">Sign Up</a>
      </p>
    </form>
  );
}

export default SignIn;
