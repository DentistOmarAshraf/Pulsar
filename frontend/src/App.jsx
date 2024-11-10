import Header from "./component/Header";
import Slogan from "./component/Slogan";
import ProductCard from "./component/ProductCard";
import ProductInfo from "./component/ProductInfo";

function App() {
  return (
    <>
      <Header />
      <Slogan text="Your Marketplace, Anytime, Anywhere" />
      <ProductCard />
      <ProductInfo />
    </>
  );
}

export default App;
