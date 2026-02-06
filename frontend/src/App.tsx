import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
  useLocation,
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
import { useEffect } from "react";
import { getCurrentUser } from "./services/AuthService";
import { useDispatch } from "react-redux";
import { logout, setCredentials } from "./stores/authSlice";



function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchToken = async () => {
      try{
        const token = localStorage.getItem("token");
        if(token){
          const user = await getCurrentUser();
          dispatch(setCredentials({ user: JSON.stringify(user), token: token }));
        }
      }catch(error){
        console.error("Error fetching current user:", error);
        localStorage.removeItem("token");
        dispatch(logout());
      }
    }
    fetchToken();
  },[])

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/cars/new" element={<CarCreate />} />
        <Route path="/cars/:id/edit" element={<CarEdit />} />
        <Route path="/cars/my" element={<MyCars />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
