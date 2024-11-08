import pulsarLogo from "../assets/logo.png";
import "./Header.css";

function Header() {
  return (
    <nav className="nav">
      <img src={pulsarLogo}></img>
      <ul className="nav__item">
        <li>Home</li>
        <li>Orders</li>
        <li>About</li>
        <li>Test</li>
      </ul>
      <ul className="login__item">
        <li>Sign Up</li>
        <li>Sign In</li>
      </ul>
    </nav>
  );
}

export default Header;
