import { useState } from "react";
import "./SignUp.css";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateEmail = (email) => {
    return /\S+@\S+.\S+/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.length) {
      newErrors.firstName = "Invalid First Name";
    }
    if (!formData.lastName.length) {
      newErrors.lastName = "Invalid Last Name";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid Mail";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password Must be 6 characters";
    }
    if (formData.password !== formData.confirm) {
      newErrors.confirm = "Password Not Match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup__container">
      <label>First Name</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      ></input>
      <p className={errors.firstName ? "errors_visable" : "errors"}>
        * Invalid First Name
      </p>

      <label>Last Name</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      ></input>
      <p className={errors.lastName ? "errors_visable" : "errors"}>
        * Invalid Last Name
      </p>

      <label>E-mail</label>
      <input
        type="text"
        name="email"
        value={formData.email}
        onChange={handleChange}
      ></input>
      <p className={errors.email ? "errors_visable" : "errors"}>
        * Invalid E-mail
      </p>

      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      ></input>
      <p className={errors.password ? "errors_visable" : "errors"}>
        * Password Must be 6 characters
      </p>

      <label>Confirm Password</label>
      <input
        type="password"
        name="confirm"
        value={formData.confirm}
        onChange={handleChange}
      ></input>
      <p className={errors.confirm ? "errors_visable" : "errors"}>
        * Password Not Match
      </p>

      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
