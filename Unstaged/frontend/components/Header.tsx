import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  showSearch?: boolean;
}

const navLink = [{ name: "Profile", url: "/profile" }];

function Header({ searchText, setSearchText, showSearch = true }: HeaderProps) {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.removeItem("currentUser");
    navigate("/");
  }

  return (
    <header className="main_header">
      <div className="container">
        <div className="logo">
          <Link to="/reviews">Unstaged</Link>
        </div>

        <div className="search_container">
          {showSearch && (
            <input
              type="text"
              placeholder="Search artist, venue or city..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          )}
        </div>

        <div className="user_menu">
          <ul>
            {navLink.map((link) => (
              <li key={link.url}>
                <Link to={link.url}>{link.name}</Link>
              </li>
            ))}
          </ul>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
