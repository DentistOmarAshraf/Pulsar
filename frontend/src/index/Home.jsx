import axios from "axios";
import Header from "../component/Header";
import Slogan from "../component/Slogan";
import CategoryContainer from "../component/CategoryContainer";
import CategoryCard from "../component/CategoryCard";
import photo from "../assets/mobile_phone.jpg";
import { useEffect, useState } from "react";

function Home() {
  const [categories, setCategory] = useState([]);

  useEffect(() => {
    async function getCategories() {
      axios
        .get("http://localhost:5001/categories", {
          params: {
            page: 1,
            size: 20,
          },
        })
        .then((response) => {
          setCategory(response.data.categories);
        })
        .catch((error) => console.log(error));
    }
    getCategories();
  }, []);

  return (
    <>
      <Header />
      <Slogan text={"Your Marketplace, Anytime, Anywhere"} />
      <CategoryContainer>
        {categories.map((category) => (
          <CategoryCard
            name={category.name}
            imgurl={`http://localhost:5001/photo/${category.photo}`}
          />
        ))}
      </CategoryContainer>
    </>
  );
}

export default Home;
