import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Header } from "./components/layouts/Header";
import { Ask } from "./components/questions/Ask";
import { Question } from "./components/questions/Question";
import { Login } from "./components/user/Login";
import { Profile } from "./components/user/Profile";
import { Register } from "./components/user/Register";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/question/:slug" element={<Question />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
