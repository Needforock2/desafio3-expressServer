
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import { NavBar } from './components/Navbar/Navbar';
import Cart from './components/Cart/Cart';
import ProductDetail from './components/ProductDetail/ProductDetail';
import NewProduct from './components/NewProduct/NewProduct';






function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/detail/:pid" element={<ProductDetail />} />
        <Route path="/new_product" element={<NewProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
