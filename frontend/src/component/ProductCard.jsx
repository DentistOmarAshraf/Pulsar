import "./ProductCard.css";

function ProductCard() {
  return (
    <div className="product__container">
      <div className="product__photocontainer">
        <img />
      </div>
      <div className="product__infocontainer">
        <p>name Of product</p>
        <p>To be discoverd</p>
        <p>$ price</p>
        <button>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;
