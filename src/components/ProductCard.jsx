import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-price">${product.price}</p>
          <p className="product-description-excerpt">
            {product.description.substring(0, 60)}...
          </p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
