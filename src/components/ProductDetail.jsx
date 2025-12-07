import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/products.json')
      .then(response => response.json())
      .then(data => {
        const foundProduct = data.find(p => p.id === parseInt(id));
        setProduct(foundProduct);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading product:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/" className="btn">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="product-detail-content">
        <div className="product-detail-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">${product.price}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-actions">
            <button className="btn btn-primary">Add to Cart</button>
            <button className="btn btn-secondary">Add to Wishlist</button>
          </div>

          <div className="product-specs">
            <h3>Product Information</h3>
            <ul>
              <li><strong>Product ID:</strong> {product.id}</li>
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Price:</strong> ${product.price}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
