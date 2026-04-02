import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Home from "./Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import CarList from "../features/cars/CarList";
import CarDetails from "../features/cars/CarDetails/CarDetails";
import CarEdit from "../features/cars/CarEdit/CarEdit";
import MyCars from "../features/cars/MyCars";
import Navbar from "../shared/Navbar/Navbar";
import AuthRestore from "../features/auth/authComponents/AuthRestore"; 
import Profile from "../features/user/Profile";
import { Toaster } from "react-hot-toast";
import NotFound from "../features/cars/CarComponents/NotFound";
import CarCreate from "../features/cars/CarCreate/CarCreate";



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
