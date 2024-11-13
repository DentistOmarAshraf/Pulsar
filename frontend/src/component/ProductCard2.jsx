import "./ProductCard.css";

function ProductCard2({ item, onDelete }) {
  console.log(item.product._id);
  const handleDelete = () => {
    console.log(item.product);
    onDelete(item.product._id, item.quantity);
  };
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
      <button className="delete__product" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}

export default ProductCard2;
