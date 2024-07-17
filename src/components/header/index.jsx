import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import "./index.scss";
function Header() {
  return (
    <div className="container-fluid">
      <header className="header">
        <div className="header_social_left">
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-youtube"></i>
          <i className="fa-brands fa-square-instagram"></i>
          <i className="fa-brands fa-tiktok"></i>
        </div>
        <div className="header_logo">
          {" "}
          <img
            src="https://tiemcuapet.com/wp-content/uploads/2023/11/Tiem-cua-pet-20.png"
            width={200}
            alt=""
          />
        </div>
        <div className="header_social_right">
          <i className="fa-solid fa-user"></i>
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
      </header>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlined className="icon" />
        </div>
      </nav>
    </div>
  );
}

export default Header;
