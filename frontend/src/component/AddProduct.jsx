import { useEffect, useState } from "react";
import "./AddProduct.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    number: "",
    merchant: "",
    category: "",
    inStock: false,
    files: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMerchantchoise = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    axios
      .get(`http://localhost:5001/user/merchant/${value}/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => console.log(err));
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: Array.from(e.target.files).slice(0, 5),
    });
  };

  const handleInStock = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value === "true" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.length) {
      newErrors.name = "Invalid Name";
    }
    if (!formData.description.length) {
      newErrors.description = "Invalid Description";
    }
    if (!formData.price.length) {
      newErrors.price = "Invalid Price";
    }
    if (!formData.category.length) {
      newErrors.category = "Invalid Option";
    }
    if (!formData.merchant.length) {
      newErrors.merchant = "Invalid Option";
    }
    if (!formData.number.length) {
      newErrors.number = "Invalid Number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("description", formData.description);
      formPayload.append("price", formData.price);
      formPayload.append("merchant", formData.merchant);
      formPayload.append("number", formData.number);
      formPayload.append("category", formData.category);
      formPayload.append("inStock", formData.inStock);
      formData.files.forEach((file) => formPayload.append("photos", file));
      axios
        .post("http://localhost:5001/product", formPayload)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    async function getUserMerchants() {
      axios
        .get("http://localhost:5001/user/merchant")
        .then((response) => {
          setMerchants(response.data.merchants);
        })
        .catch((err) => console.log(err));
    }

    getUserMerchants();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="add__product"
    >
      <label>Product Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <p className={errors.name ? "errors_visable" : "errors"}>
        * Name Is Invalid
      </p>
      <label>Description</label>
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      <p className={errors.description ? "errors_visable" : "errors"}>
        * Description Is Invalid
      </p>
      <label>Price</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        min="0"
        step="0.01"
      />
      <p className={errors.price ? "errors_visable" : "errors"}>
        * Price Is Invalid
      </p>
      <label>Number</label>
      <input
        type="number"
        name="number"
        value={formData.number}
        onChange={handleChange}
        min="1"
        required
      />
      <p className={errors.number ? "errors_visable" : "errors"}>
        * Number Is Invalid
      </p>
      <label>Merchant</label>
      <select
        name="merchant"
        value={formData.merchant}
        onChange={handleMerchantchoise}
      >
        <option value="">Select a Merchant</option>
        {merchants.map((merchant) => (
          <option key={merchant._id} value={merchant._id}>
            {merchant.name}
          </option>
        ))}
      </select>
      <p className={errors.merchant ? "errors_visable" : "errors"}>
        * Merchant Is Invalid
      </p>
      <label>Category</label>
      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="">Select a Merchant</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <p className={errors.category ? "errors_visable" : "errors"}>
        * Category Is Invalid
      </p>
      <label>In Stock</label>
      <div className="options__product">
        <div>
          <input
            type="radio"
            name="inStock"
            value="true"
            checked={formData.inStock === true}
            onChange={handleInStock}
          />
          Yes
        </div>
        <div>
          <input
            type="radio"
            name="inStock"
            value="false"
            checked={formData.inStock === false}
            onChange={handleInStock}
          />
          No
        </div>
      </div>
      <label>Photos</label>
      <div className="options__product">
        <input
          type="file"
          name="photos"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          required
        />
      </div>
      <button type="submit">Upload Product</button>
    </form>
  );
}

export default AddProduct;
