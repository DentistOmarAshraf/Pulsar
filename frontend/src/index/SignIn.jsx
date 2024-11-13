import Header from "../component/Header";
import Slogan from "../component/Slogan";
import SignIn from "../component/SignIn";

function Login() {
  return (
    <>
      <Header />
      <Slogan text={"Bringing Bright Ideas to Your Doorstep"} />
      <SignIn />
    </>
  );
}

export default Login;
