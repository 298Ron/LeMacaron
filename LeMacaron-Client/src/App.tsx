import { createContext, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PageNotFound from './components/pageNotFound';
import { ToastContainer } from "react-toastify"
import Footer from './components/Footer';
import Cart from './components/Cart';
import Profile from './components/Profile';
import About from './components/About';
import NewProduct from './components/NewProduct';
import UpdateProduct from './components/UpdateProduct';
import ProductInfo from './components/ProductInfo';
import Products from './components/Products';
import Checkout from './components/Checkout';
import Payment from './components/payment';
import ThankYouPage from './components/ThankYouPage';
import AdminPanel from './components/AdminPanel';
import Orders from './components/Orders';
import ChangePassword from './components/ChangePassword';

export let ThemeContext: any = createContext(null);
function App() {

  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  }
  let [userInfo, setUserInfo] = useState(
    JSON.parse(sessionStorage.getItem("userInfo") as string) == null
      ? { email: false, isAdmin: false }
      : JSON.parse(sessionStorage.getItem("userInfo") as string))

  let [dataUpdated, setDataUpdated] = useState<boolean>(false);
  let render = () => setDataUpdated(!dataUpdated);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ToastContainer theme={theme === "dark" ? ("dark") : ("light")} />
      <div className="App" id={theme}>

        <Router>
          <Navbar userInfo={userInfo} setUserInfo={setUserInfo} theme={theme} toggleTheme={toggleTheme} render={render} dataUpdated={dataUpdated} />
          <Routes>
            <Route path="/" element={<Home render={render} dataUpdated={dataUpdated} />} />
            <Route path="/profile/:id" element={<Profile setUserInfo={setUserInfo} userInfo={userInfo} />} />
            <Route path="/changepassword/:id" element={<ChangePassword setUserInfo={setUserInfo} userInfo={userInfo} />} />
            <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
            <Route path="/register" element={<Register setUserInfo={setUserInfo} />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products userInfo={userInfo} render={render} dataUpdated={dataUpdated} />} />
            <Route path="/products/info/:id" element={<ProductInfo userInfo={userInfo} render={render} dataUpdated={dataUpdated} />} />
            <Route path="/cart" element={<Cart userInfo={userInfo} render={render} dataUpdated={dataUpdated} />} />
            <Route path="/orders" element={<Orders userInfo={userInfo} />} />
            <Route path="/checkout" element={<Checkout userInfo={userInfo} />} />
            <Route path="/payment" element={<Payment userInfo={userInfo} render={render} dataUpdated={dataUpdated} />} />
            <Route path="/thanks" element={<ThankYouPage userInfo={userInfo} />} />
            <Route path="/adminPanel" element={<AdminPanel setUserInfo={setUserInfo} userInfo={userInfo} />} />
            <Route path="/products/add" element={<NewProduct userInfo={userInfo} />} />
            <Route path="/products/edit/:id" element={<UpdateProduct userInfo={userInfo} />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Router>

      </div>
    </ThemeContext.Provider>
  );
}

export default App;
