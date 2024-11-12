import pulsarLogo from "../assets/logo.png";
import { useAuth } from "../AuthComponent/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const isAuthenticated = !!user?.token;

  function handleLogout() {
    setUser({});
  }

  function handleNav(route) {
    navigate(route);
  }

  return (
    <nav className="nav">
      <img src={pulsarLogo}></img>
      <ul className="nav__item">
        <li onClick={() => handleNav("/")}>Home</li>
        <li onClick={() => handleNav("/orders")}>Orders</li>
        <li onClick={() => handleNav("/addmerchant")}>Add Merchant</li>
        <li onClick={() => handleNav("/addproduct")}>Sell</li>
        <li onClick={() => handleNav("/about")}>About</li>
      </ul>
      <ul className="login__item">
        {!isAuthenticated && (
          <li onClick={() => handleNav("/signup")}>Sign Up</li>
        )}
        {!isAuthenticated && (
          <li onClick={() => handleNav("/signin")}>Sign In</li>
        )}
        {isAuthenticated && <li onClick={() => handleNav("/cart")}>Cart</li>}
        {isAuthenticated && <li onClick={handleLogout}>logOut</li>}
      </ul>
    </nav>
  );
}

export default Header;
