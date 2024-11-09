import Header from "./component/Header";
import CategoryCard from "./component/CategoryCard";
import mobilePhoto from "./assets/mobile_phone.jpg";
import Slogan from "./component/Slogan";
import ProductCard from "./component/ProductCard";

function App() {
  return (
    <>
      <Header />
      <Slogan text="Your Marketplace, Anytime, Anywhere" />
      <ProductCard />
      {/* <CategoryCard imgurl={mobilePhoto} name="Mobiles" /> */}
    </>
  );
}

export default App;
