import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarList from "./pages/CarList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<CarList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
