import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "../views/LoginView";
import RegisterView from "../views/RegisterView";
import StartView from "../views/StartView";
import ProfileView from "../views/ProfileView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/reviews" element={<StartView />} />
        <Route path="/profile" element={<ProfileView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
