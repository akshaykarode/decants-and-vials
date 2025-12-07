import { useState, useEffect, useRef } from 'react';

function Home() {
  const [allFragrances, setAllFragrances] = useState([]);
  const [filteredFragrances, setFilteredFragrances] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [visibleColumns, setVisibleColumns] = useState({
    ml_30: true,
    ml_20: true,
    ml_10: true,
    ml_5: true
  });
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch and merge both datasets
    Promise.all([
      fetch('/data/my-collection.json').then(res => res.json()),
      fetch('/data/resale-samples.json').then(res => res.json())
    ])
      .then(([collection, resale]) => {
        const collectionItems = collection.map(item => ({
          ...item,
          type: 'collection'
        }));

        const resaleItems = resale.map(item => ({
          ...item,
          type: 'official',
          isOfficialVial: true
        }));

        const combined = [...collectionItems, ...resaleItems];
        setAllFragrances(combined);
        setFilteredFragrances(combined);
      })
      .catch(error => console.error('Error loading fragrance data:', error));
  }, []);

  useEffect(() => {
    let filtered = [...allFragrances];

    if (filterBy === 'official') {
      filtered = filtered.filter(f => f.type === 'official');
    }

    // Apply sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.ml_5 || 0) - (b.ml_5 || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.ml_30 || 0) - (a.ml_30 || 0));
    }

    setFilteredFragrances(filtered);
  }, [sortBy, filterBy, allFragrances]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsColumnDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const addToCart = (fragrance, size, price) => {
    if (!price) return;

    // Check if this exact item already exists in cart
    const existingIndex = cart.findIndex(
      item => item.id === fragrance.id && item.size === size
    );

    if (existingIndex >= 0) {
      // Increment quantity
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      // Add new item
      setCart([...cart, {
        id: fragrance.id,
        name: fragrance.name,
        size,
        price,
        quantity: 1,
        isOfficialVial: fragrance.isOfficialVial
      }]);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }

    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const itemsList = cart.map((item, index) =>
      `${index + 1}. ${item.name}${item.isOfficialVial ? ' (Official Vial)' : ''}\n   Size: ${item.size}\n   Price: ₹${item.price}\n   Quantity: ${item.quantity}\n   Subtotal: ₹${item.price * item.quantity}`
    ).join('\n\n');

    const total = calculateTotal();

    const whatsappMessage = encodeURIComponent(
      `Hi, I would like to order these fragrances:\n\n${itemsList}\n\n*Total: ₹${total}*\n\nPlease confirm availability and shipping details.`
    );

    window.open(`https://wa.me/918767578885?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">AKFraghead</h1>
          <p className="hero-subtitle">Premium Fragrance Decants & Samples</p>
          <p className="hero-description">
            Discover luxury fragrances without the commitment.
            Try before you buy with our premium decants.
          </p>
        </div>
      </div>

      {/* Cart Button */}
      <button
        className="cart-fab"
        onClick={() => setIsCartOpen(true)}
        aria-label="Open cart"
      >
        <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cart.length > 0 && (
          <span className="cart-badge">{cart.length}</span>
        )}
      </button>

      {/* Cart Panel */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button
                className="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            <div className="cart-content">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <svg className="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item, index) => (
                      <div key={index} className="cart-item">
                        <div className="cart-item-details">
                          <div className="cart-item-header">
                            <div className="cart-item-name">{item.name}</div>
                            <button
                              className="remove-item-btn"
                              onClick={() => removeFromCart(index)}
                              aria-label="Remove item"
                            >
                              ×
                            </button>
                          </div>

                          <div className="cart-item-meta">
                            {item.isOfficialVial && (
                              <span className="cart-official-badge">Official Vial</span>
                            )}
                            <span className="cart-size-badge">{item.size}</span>
                          </div>

                          <div className="cart-item-pricing">
                            <div className="cart-price-row">
                              <span className="cart-price-label">Price:</span>
                              <span className="cart-price-value">₹{item.price}</span>
                            </div>

                            <div className="cart-quantity-row">
                              <span className="cart-price-label">Quantity:</span>
                              <div className="quantity-controls">
                                <button
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(index, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="quantity-value">{item.quantity}</span>
                                <button
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(index, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="cart-subtotal-row">
                              <span className="cart-subtotal-label">Subtotal:</span>
                              <span className="cart-subtotal-value">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-total">
                    <span className="cart-total-label">Total:</span>
                    <span className="cart-total-value">₹{calculateTotal()}</span>
                  </div>

                  <div className="cart-actions">
                    <button className="clear-cart-btn" onClick={clearCart}>
                      Clear Cart
                    </button>
                    <button className="checkout-btn" onClick={handleCheckout}>
                      <svg className="checkout-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Checkout via WhatsApp
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Controls and Fragrances Table */}
      <div className="table-section">
        <div className="table-header">
          <div className="table-title">
            <h2>Available Fragrances</h2>
            <span className="fragrance-count">{filteredFragrances.length} fragrances</span>
          </div>

          <div className="table-controls">
            <div className="control-group">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                className="control-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="filter">Filter:</label>
              <select
                id="filter"
                className="control-select"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All Fragrances</option>
                <option value="official">Official Vials Only</option>
              </select>
            </div>

            <div className="control-group" ref={dropdownRef}>
              <button
                className="column-dropdown-btn"
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              >
                Show Columns
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isColumnDropdownOpen && (
                <div className="column-dropdown-menu">
                  <label className="column-checkbox-item">
                    <input
                      type="checkbox"
                      checked={visibleColumns.ml_30}
                      onChange={() => toggleColumn('ml_30')}
                    />
                    <span>30ml</span>
                  </label>
                  <label className="column-checkbox-item">
                    <input
                      type="checkbox"
                      checked={visibleColumns.ml_20}
                      onChange={() => toggleColumn('ml_20')}
                    />
                    <span>20ml</span>
                  </label>
                  <label className="column-checkbox-item">
                    <input
                      type="checkbox"
                      checked={visibleColumns.ml_10}
                      onChange={() => toggleColumn('ml_10')}
                    />
                    <span>10ml</span>
                  </label>
                  <label className="column-checkbox-item">
                    <input
                      type="checkbox"
                      checked={visibleColumns.ml_5}
                      onChange={() => toggleColumn('ml_5')}
                    />
                    <span>5ml</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table className="fragrance-table">
              <thead>
                <tr>
                  <th className="name-col">Fragrance Name</th>
                  {visibleColumns.ml_30 && <th className="price-col">30ml</th>}
                  {visibleColumns.ml_20 && <th className="price-col">20ml</th>}
                  {visibleColumns.ml_10 && <th className="price-col">10ml</th>}
                  {visibleColumns.ml_5 && <th className="price-col">5ml</th>}
                </tr>
              </thead>
              <tbody>
                {filteredFragrances.map((fragrance) => (
                  <tr key={fragrance.id} className="fragrance-row">
                    <td className="name-cell">
                      {fragrance.name}
                      {fragrance.isOfficialVial && (
                        <span className="official-badge">Official Vial</span>
                      )}
                    </td>
                    {visibleColumns.ml_30 && (
                      <td className="price-cell">
                        {fragrance.ml_30 ? (
                          <div className="price-with-cart">
                            <span className="price-text">₹{fragrance.ml_30}</span>
                            <button
                              className="size-cart-btn"
                              onClick={() => addToCart(fragrance, '30ml', fragrance.ml_30)}
                              title="Add 30ml to cart"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </button>
                          </div>
                        ) : '-'}
                      </td>
                    )}
                    {visibleColumns.ml_20 && (
                      <td className="price-cell">
                        {fragrance.ml_20 ? (
                          <div className="price-with-cart">
                            <span className="price-text">₹{fragrance.ml_20}</span>
                            <button
                              className="size-cart-btn"
                              onClick={() => addToCart(fragrance, '20ml', fragrance.ml_20)}
                              title="Add 20ml to cart"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </button>
                          </div>
                        ) : '-'}
                      </td>
                    )}
                    {visibleColumns.ml_10 && (
                      <td className="price-cell">
                        {fragrance.ml_10 ? (
                          <div className="price-with-cart">
                            <span className="price-text">₹{fragrance.ml_10}</span>
                            <button
                              className="size-cart-btn"
                              onClick={() => addToCart(fragrance, '10ml', fragrance.ml_10)}
                              title="Add 10ml to cart"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </button>
                          </div>
                        ) : '-'}
                      </td>
                    )}
                    {visibleColumns.ml_5 && (
                      <td className="price-cell">
                        {fragrance.ml_5 ? (
                          <div className="price-with-cart">
                            <span className="price-text">₹{fragrance.ml_5}</span>
                            <button
                              className="size-cart-btn"
                              onClick={() => addToCart(fragrance, '5ml', fragrance.ml_5)}
                              title="Add 5ml to cart"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </button>
                          </div>
                        ) : '-'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="info-section">
        <div className="info-card shipping-card">
          <h3 className="info-title">Shipping Information</h3>
          <div className="shipping-details">
            <div className="shipping-item">
              <span className="shipping-label">Non-Remote Areas:</span>
              <span className="shipping-price">₹100/-</span>
            </div>
            <div className="shipping-item">
              <span className="shipping-label">Remote Areas:</span>
              <span className="shipping-price">₹150/-</span>
            </div>
            <div className="shipping-note">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Allow 2 Days to Ship (Shiprocket)
            </div>
          </div>
        </div>

        <div className="info-card contact-card">
          <h3 className="info-title">Get in Touch</h3>
          <a
            href="https://wa.me/918767578885"
            className="whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="whatsapp-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp: +91 8767578885
          </a>
        </div>
      </div>

      {/* Additional Info */}
      <div className="additional-info">
        <div className="info-block">
          <h4>Why Choose Our Decants?</h4>
          <ul>
            <li>Premium pressurized atomizers for perfect spray</li>
            <li>Authentic fragrances from verified sources</li>
            <li>Affordable way to try luxury perfumes</li>
            <li>Fast and secure shipping across India</li>
          </ul>
        </div>
        <div className="info-block">
          <h4>How to Order</h4>
          <ol>
            <li>Browse our collection above</li>
            <li>Click the cart icon next to your desired size</li>
            <li>Adjust quantities in your cart</li>
            <li>Click "Checkout via WhatsApp" to complete your order</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Home;
