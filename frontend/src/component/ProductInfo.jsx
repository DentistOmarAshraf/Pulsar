import { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./ProductInfo.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductInfo({ product }) {
  if (!product || !product.name) {
    return <div>Loading...</div>;
  }
  const navigate = useNavigate();
  const images = Array.isArray(product.photos)
    ? product.photos.map((id) => ({
        original: `http://localhost:5001/photo/${id}`,
      }))
    : [];
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  function handleAddToCart() {
    axios
      .post("http://localhost:5001/user/cart", {
        productId: product._id,
        quantity,
      })
      .then((response) => {
        navigate("/cart");
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="product__info__container">
      <div className="product__images__container">
        <ImageGallery
          items={images}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
        />
      </div>
      <div className="info__flex__container">
        <div className="info__container">
          <p>{product.name}</p>
          <p>{product.description}</p>
          <p>{product.merchant.name}</p>
          <p>$ {product.price}</p>
        </div>
        <div className="quantity__control">
          <button onClick={handleDecrease}>-</button>
          <p>{quantity}</p>
          <button onClick={handleIncrease}>+</button>
        </div>
        <button className="addtocart" onClick={handleAddToCart}>
          Add To Cart
        </button>
      </div>
    </div>
  );
}

export default ProductInfo;
