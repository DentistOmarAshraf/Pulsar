import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="product__container"
    >
      <div className="product__photocontainer">
        <img src={`http://localhost:5001/photo/${product.photos[0]}`} />
      </div>
      <div className="product__infocontainer">
        <p>{product.name}</p>
        <p>{product.description}</p>
        <p>$ {product.price}</p>
        <button onClick={() => navigate(`/product/${product._id}`)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
