import Home from '../pages/Home';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">AKFraghead</div>
          <div className="nav-tagline">Premium Fragrance Decants</div>
        </div>
      </nav>

      <main className="main-content">
        <Home />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 AKFraghead. All rights reserved.</p>
          <p>Discover luxury fragrances, one decant at a time.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
