import { useEffect, useState } from "react";
import Header from "../component/Header";
import Slogan from "../component/Slogan";
import ProductCard2 from "../component/ProductCard2";
import axios from "axios";
import "./style/UserCart.css";

function UserCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState([]);

  useEffect(() => {
    function getUserCart() {
      axios
        .get("http://localhost:5001/user/cart")
        .then((response) => {
          setItems(response.data.items);
          setTotal(response.data.total);
        })
        .catch((error) => console.log(error));
    }
    getUserCart();
  }, []);
  return (
    <>
      <Header />
      <Slogan text={"One Step to get Happiness"} />
      {!items.length && <p className="no__item">No Item to Show</p>}
      {items.length && <p className="total__price">Your Cart</p>}
      {items.map((item) => (
        <ProductCard2 key={item._id} item={item} />
      ))}
      {items.length && <p className="total__price">Total: {total}</p>}
    </>
  );
}

export default UserCart;
