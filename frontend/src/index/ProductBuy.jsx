import { useParams } from "react-router-dom";
import Header from "../component/Header";
import Slogan from "../component/Slogan";
import ProductInfo from "../component/ProductInfo";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductBuy() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    async function getProduct() {
      axios
        .get(`http://localhost:5001/product/${id}`)
        .then((response) => setProduct(response.data))
        .catch((err) => console.log(err));
    }
    getProduct();
  }, [id]);
  return (
    <>
      <Header />
      <Slogan text={"Here We GOOOOO!"} />
      <ProductInfo product={product} />
    </>
  );
}

export default ProductBuy;
