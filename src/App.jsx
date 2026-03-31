import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './pages/home';
import GalleryPage from './pages/gallery';
import ProductDetailPage from './pages/productDetail';
import CustomizePage from './pages/customize';
import RunwayPage from './pages/runway';
import CartPage from './pages/cart';
import HelpdeskPage from './pages/helpdesk';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/collection"     element={<GalleryPage />} />
        <Route path="/product/:id"    element={<ProductDetailPage />} />
        <Route path="/customize/:id"  element={<CustomizePage />} />
        <Route path="/runway"         element={<RunwayPage />} />
        <Route path="/cart"           element={<CartPage />} />
        <Route path="/helpdesk"       element={<HelpdeskPage />} />
      </Routes>
    </BrowserRouter>
  );
}