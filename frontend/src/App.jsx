import Header from "./component/Header";
import Slogan from "./component/Slogan";
import CategoryCard from "./component/CategoryCard";
import CategoryContainer from "./component/CategoryContainer";
import someImage from "./assets/mobile_phone.jpg";
import AddProduct from "./component/AddProduct";

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
      <AddProduct />
      <CategoryContainer>
        {items.map((item) => (
          <CategoryCard imgurl={someImage} name={item} />
        ))}
      </CategoryContainer>
    </>
  );
}

export default App;
