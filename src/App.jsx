import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/layouts/Header";
import { Home } from "./components/Home";
import { Register } from "./components/user/Register";
import { Login } from "./components/user/Login";
import { Ask } from "./components/questions/Ask";
import { Question } from "./components/questions/Question";
import { EditAnswer } from "./components/answers/EditAnswer";
import { Profile } from "./components/user/Profile";

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
