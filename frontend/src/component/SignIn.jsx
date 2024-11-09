import { useState } from "react";
import "./SignIn.css";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function validateEmail(email) {
    return /\S+@\S+.\S+/.test(email);
  }

  function validateForm() {
    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid Email";
    }
    if (formData.password.length < 7) {
      newErrors.password = "Invalid Password";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="signin__container">
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
