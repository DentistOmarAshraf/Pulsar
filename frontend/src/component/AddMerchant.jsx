import "./AddMerchant.css";
import { useState } from "react";

function AddMerchant() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    isActive: true,
    categories: [],
  });
  const [errors, setErrors] = useState({});

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleIsActive = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value === "true" });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      const categories = prevFormData.categories;
      if (checked) {
        return { ...prevFormData, categories: [...categories, value] };
      } else {
        return {
          ...prevFormData,
          categories: categories.filter((category) => category !== value),
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.length) {
      newErrors.name = "Name is invalid";
    }
    if (!formData.address.length) {
      newErrors.address = "Address is Invalid";
    }
    if (formData.categories.length === 0) {
      newErrors.categories = "At least one category must be selected";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className="add__merchant">
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleOnChange}
      />
      <p className={errors.name ? "errors_visable" : "errors"}>
        * Name Is Invalid
      </p>
      <label>Address</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleOnChange}
      />
      <p className={errors.address ? "errors_visable" : "errors"}>
        * Address Is Invalid
      </p>
      <label>Active</label>
      <div className="options__merchant">
        <div>
          <input
            type="radio"
            name="isActive"
            value="true"
            checked={formData.isActive === true}
            onChange={handleIsActive}
          />
          Yes
        </div>
        <div>
          <input
            type="radio"
            name="isActive"
            value="false"
            checked={formData.isActive === false}
            onChange={handleIsActive}
          />
          No
        </div>
      </div>
      <label>Categories</label>
      <div className="options__merchant">
        <div>
          <input
            type="checkbox"
            name="categories"
            value="1" // here will be Category ID
            checked={formData.categories.includes("1")} // should change this as will
            onChange={handleCheckboxChange}
          />
          Category 1
        </div>
        <div>
          <input
            type="checkbox"
            name="categories"
            value="2"
            checked={formData.categories.includes("2")}
            onChange={handleCheckboxChange}
          />
          Category 2
        </div>
        <div>
          <input
            type="checkbox"
            name="categories"
            value="3"
            checked={formData.categories.includes("3")}
            onChange={handleCheckboxChange}
          />
          Category 3
        </div>
      </div>
      <p className={errors.categories ? "errors_visable" : "errors"}>
        * At least one category must be selected
      </p>
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddMerchant;
