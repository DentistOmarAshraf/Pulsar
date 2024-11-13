import "./ProductCard.css";

function ProductCard2({ item }) {
  return (
    <div className="product__container">
      <div className="product__photocontainer">
        <img src={`http://localhost:5001/photo/${item.product.photos[0]}`} />
      </div>
      <div className="product__infocontainer">
        <p>{item.product.name}</p>
        <p>{item.product.description}</p>
        <p>$ {item.product.price}</p>
        <p>Quantity: {item.quantity}</p>
      </div>
    </div>
  );
}

export default ProductCard2;
