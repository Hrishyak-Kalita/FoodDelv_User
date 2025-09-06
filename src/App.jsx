import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./components/checkout/Checkout"
import MyOrders from "./components/Myorder/MyOrder";
import DevSeed from "./pages/DevSeed";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Myorders" element={<MyOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          // in App.jsx Routes
          <Route path="/dev-seed" element={<DevSeed />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
