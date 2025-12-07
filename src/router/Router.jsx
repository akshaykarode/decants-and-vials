import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import ProductDetail from '../components/ProductDetail';
import App from '../app/App';

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Router;
