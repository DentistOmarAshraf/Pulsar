import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <div className="product__container">
      <div className="product__photocontainer">
        <img src={`http://localhost:5001/photo/${product.photos[0]}`} />
      </div>
      <div className="product__infocontainer">
        <p>{product.name}</p>
        <p>{product.description}</p>
        <p>$ {product.price}</p>
        <button>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;
