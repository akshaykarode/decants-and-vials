# AKFraghead - React Product Listing

A modern, responsive product listing application built with React and Vite, designed to be deployed on GitHub Pages.

## Features

- **Product Listing**: Browse through a curated collection of products
- **Search Functionality**: Find products by name or description
- **Category Filtering**: Filter products by category
- **Product Details**: View detailed information about each product
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Static Hosting**: Fully static site, no backend required

## Tech Stack

- **React 18** - UI library
- **Vite 6** - Build tool and dev server
- **React Router 6** - Client-side routing with HashRouter for GitHub Pages
- **CSS3** - Responsive styling with modern features

## Project Structure

```
AKFraghead/
├── public/
│   └── data/
│       └── products.json          # Product data
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx        # Product card component
│   │   ├── ProductList.jsx        # Product listing with search/filter
│   │   └── ProductDetail.jsx      # Product detail page
│   ├── pages/
│   │   ├── Home.jsx               # Home page
│   │   └── About.jsx              # About page
│   ├── app/
│   │   └── App.jsx                # Main app layout with navigation
│   ├── router/
│   │   └── Router.jsx             # HashRouter configuration
│   ├── styles/
│   │   └── global.css             # Global styles
│   └── main.jsx                   # App entry point
├── package.json
├── vite.config.js                 # Vite configuration
└── index.html
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd AKFraghead
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages

## Deployment to GitHub Pages

### Initial Setup

1. **Create a GitHub repository** named `AKFraghead`

2. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/AKFraghead/"
   ```

3. **Update the base path** in `vite.config.js` (already configured):
   ```javascript
   base: '/AKFraghead/'
   ```

### Deploy

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Add remote repository**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/AKFraghead.git
git branch -M main
git push -u origin main
```

3. **Deploy to GitHub Pages**:
```bash
npm run deploy
```

This command will:
- Build the project
- Create/update the `gh-pages` branch
- Push the built files to GitHub Pages

4. **Configure GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to "Pages" section
   - Source should be set to `gh-pages` branch
   - Your site will be published at: `https://YOUR_USERNAME.github.io/AKFraghead/`

### Subsequent Deployments

After making changes, simply run:
```bash
npm run deploy
```

## Managing Product Data

Products are stored in `/public/data/products.json`. To add, edit, or remove products:

1. Open `public/data/products.json`
2. Edit the JSON array following this structure:

```json
{
  "id": 1,
  "name": "Product Name",
  "price": 99,
  "category": "Category Name",
  "image": "https://example.com/image.jpg",
  "description": "Product description..."
}
```

3. Save the file
4. Rebuild and deploy:
```bash
npm run deploy
```

### Product Image Guidelines

- Use high-quality images (recommended: 400x400px or larger)
- You can use:
  - External URLs (Unsplash, Imgur, etc.)
  - Local images in `/public/images/` folder
- Ensure images are optimized for web

### Adding New Categories

Categories are automatically extracted from the product data. Simply add products with new category names, and they'll appear in the filter dropdown.

## Customization

### Changing Colors

Edit CSS variables in `src/styles/global.css`:

```css
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  /* ... other variables */
}
```

### Modifying Layout

- Edit component files in `src/components/`
- Adjust grid columns in `.product-grid` class for different layouts
- Modify responsive breakpoints in media queries

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/router/Router.jsx`
3. Add navigation link in `src/app/App.jsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### 404 Error on Refresh

This is expected with GitHub Pages. We use `HashRouter` to avoid this issue. URLs will have a `#` in them (e.g., `/#/product/1`).

### Images Not Loading

- Ensure image URLs are accessible
- For local images, place them in `/public/images/`
- Reference as `/images/filename.jpg` in products.json

### Build Fails

- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Ensure Node.js version is 16 or higher

## License

MIT License - Feel free to use this project for your own purposes.

## Contributing

This is a static site template. Feel free to fork and customize for your needs!

---

**Built with ❤️ using React + Vite**
