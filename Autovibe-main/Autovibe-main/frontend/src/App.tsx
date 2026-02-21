import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarList from "./pages/CarList";
import CarDetails from "./pages/CarDetails";
import CarCreate from "./pages/CarCreate";
import CarEdit from "./pages/CarEdit";
import MyCars from "./pages/MyCars";
import Navbar from "./components/Navbar";
import AuthRestore from "./components/AuthRestore";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";



function App() {
  

  return (
    <BrowserRouter>
      <AuthRestore/>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/cars/new" element={<CarCreate />} />
        <Route path="/cars/:id/edit" element={<CarEdit />} />
        <Route path="/cars/my" element={<MyCars />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path = "*" element = {<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
