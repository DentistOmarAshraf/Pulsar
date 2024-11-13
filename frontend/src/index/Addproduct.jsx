import Header from "../component/Header";
import Slogan from "../component/Slogan";
import AddProduct from "../component/AddProduct";

function AddnewProduct() {
  return (
    <>
      <Header />
      <Slogan text={"Bright Deals, Stellar Choices"} />
      <AddProduct />
    </>
  );
}

export default AddnewProduct;
