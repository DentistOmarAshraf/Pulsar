import Header from "./component/Header";
import Slogan from "./component/Slogan";
import CategoryCard from "./component/CategoryCard";
import CategoryContainer from "./component/CategoryContainer";
import someImage from "./assets/mobile_phone.jpg";
import ProductCard from "./component/ProductCard";
import ProductInfo from "./component/ProductInfo";
import ProductCard2 from "./component/ProductCard2";

function App() {
  const items = [
    "Mobiles",
    "Laptops",
    "Covers",
    "Playstations",
    "noenr",
    "omr",
  ];
  return (
    <>
      <Header />
      <Slogan text="Your Marketplace, Anytime, Anywhere" />
      <CategoryContainer>
        {items.map((item) => (
          <CategoryCard imgurl={someImage} name={item} />
        ))}
      </CategoryContainer>
      <ProductCard2 />
      <ProductCard />
    </>
  );
}

export default App;
