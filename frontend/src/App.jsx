import Header from "./component/Header";
import CategoryCard from "./component/Card";
import mobilePhoto from "./assets/mobile_phone.jpg";

function App() {
  return (
    <>
      <Header />
      <CategoryCard imgurl={mobilePhoto} name="Mobiles" />
    </>
  );
}

export default App;
