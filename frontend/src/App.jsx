import Header from "./component/Header";
import Slogan from "./component/Slogan";
import AddMerchant from "./component/AddMerchant";

function App() {
  return (
    <>
      <Header />
      <Slogan text="Your Marketplace, Anytime, Anywhere" />
      <AddMerchant />
    </>
  );
}

export default App;
