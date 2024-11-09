import Header from "./component/Header";
import Slogan from "./component/Slogan";
import SignIn from "./component/SignIn";

function App() {
  return (
    <>
      <Header />
      <Slogan text="Your Marketplace, Anytime, Anywhere" />
      <SignIn />
    </>
  );
}

export default App;
