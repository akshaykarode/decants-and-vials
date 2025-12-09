import Home from '../pages/Home';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">The Fragrance Atelier</div>
          <div className="nav-tagline">Curated Luxury Scents</div>
        </div>
      </nav>

      <main className="main-content">
        <Home />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 The Fragrance Atelier. All rights reserved.</p>
          <p>Your trusted destination for authentic luxury fragrances.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
