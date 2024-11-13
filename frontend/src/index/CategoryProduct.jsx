import { useParams } from "react-router-dom";
import Header from "../component/Header";
import Slogan from "../component/Slogan";
import ProductCard from "../component/ProductCard";
import "./style/CategoryProduct.css";
import { useEffect, useState } from "react";
import axios from "axios";

function CategoryProduct() {
  const { id } = useParams();
  const [pageNo, setPage] = useState(1);
  const [lastPage, setLast] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    function getProduct() {
      axios
        .get(`http://localhost:5001/categories/${id}/products`, {
          params: {
            page: pageNo,
            size: 10,
          },
        })
        .then((response) => {
          setProducts(response.data.products);
          setLast(response.data.totalPages);
        })
        .catch((error) => console.log(error));
    }
    getProduct();
  }, [pageNo]);

  function handleNext() {
    if (pageNo < lastPage) {
      setPage(pageNo + 1);
    }
  }

  function handlePrev() {
    if (pageNo !== 1) {
      setPage(pageNo - 1);
    }
  }
  return (
    <>
      <Header />
      <Slogan text={"Choises is Mandotry"} />
      {products.length === 0 && <p className="no__item">No Items Found</p>}
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
      {lastPage > 1 && (
        <div className="pages__scroll">
          <button onClick={handlePrev}>Prev</button>
          <h1>{pageNo}</h1>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </>
  );
}

export default CategoryProduct;
