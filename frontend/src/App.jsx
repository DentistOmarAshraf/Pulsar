import Header from "./component/Header";
import Slogan from "./component/Slogan";
import ProductCard from "./component/ProductCard";
import ProductInfo from "./component/ProductInfo";
import CategoryCard from "./component/CategoryCard";
import AddMerchant from "./component/AddMerchant";
import SignIn from "./component/SignIn";

function App() {
  return (
    <>
      <Header />
      <Slogan text="Your Marketplace, Anytime, Anywhere" />
      {/* <ProductCard /> */}
      <ProductInfo />
      {/* <CategoryCard /> */}
      {/* <AddMerchant /> */}
      {/* <SignIn /> */}
    </>
  );
}

export default App;
