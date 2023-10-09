import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { NavBar } from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import NewProduct from "./components/NewProduct/NewProduct";
import Profile from "./components/Profile/Profile";
import { CartContextProvider } from "./store/contextProvider";

function App() {
  return (
    <BrowserRouter>
      <CartContextProvider>
        <NavBar />
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/detail/:pid" element={<ProductDetail />} />
          <Route path="/new_product" element={<NewProduct />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </CartContextProvider>
    </BrowserRouter>
  );
}

export default App;
