import "./App.css";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import Home from "./components/Home";
import { NavBar } from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import NewProduct from "./components/NewProduct/NewProduct";
import Profile from "./components/Profile/Profile";
import { CartContextProvider } from "./store/contextProvider";
import PassReset from "./components/Pass_Reset/PassReset";
import { PassResetReq } from "./components/Pass_Reset/PassResetReq";
import ProductContainer from "./components/ProductContainer/ProductContainer";



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
          <Route path="/user_products" element={<ProductContainer edit={true} />} />
          <Route path='/edit_product/:pid' element={<NewProduct />}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/pass_reset/:token" element={<PassReset />} />
          <Route path="/pass_reset" element={<PassResetReq flag={true} />} />
        </Routes>
      </CartContextProvider>
    </BrowserRouter>
  );
}

export default App;
