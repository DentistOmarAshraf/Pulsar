import Header from "../component/Header";
import Slogan from "../component/Slogan";
import SignUp from "../component/SignUp";

function AddUser() {
  return (
    <>
      <Header />
      <Slogan text={"Welcome To Pulsar"} />
      <SignUp />
    </>
  );
}

export default AddUser;
