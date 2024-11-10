import { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./ProductInfo.css";

function ProductInfo() {
  const images = [
    {
      original:
        "https://e7.pngegg.com/pngimages/497/719/png-clipart-three-dimensional-football-field-three-dimensional-football-field-stereo-radio-light.png",
    },
    {
      original:
        "https://cdn1-m.zahratalkhaleej.ae/store/archive/image/2023/2/23/8cd8c897-85e5-44de-bf00-e044f5ceda6b.jpg?width=640",
    },
  ];
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

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
          <p>Name Of product</p>
          <p>description on the product</p>
          <p>merchant</p>
          <p>Price $</p>
        </div>
        <div className="quantity__control">
          <button onClick={handleDecrease}>-</button>
          <p>{quantity}</p>
          <button onClick={handleIncrease}>+</button>
        </div>
        <button className="addtocart">Add To Cart</button>
      </div>
    </div>
  );
}

export default ProductInfo;
