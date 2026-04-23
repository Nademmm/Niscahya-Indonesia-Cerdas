export default [
  { path: "/", file: "./pages/Home.jsx" },
  { path: "/products", file: "./pages/Products.jsx" },
  { path: "/products/:slug", file: "./pages/ProductDetail.jsx" },
  { path: "/blog", file: "./pages/Blog.jsx" },
  { path: "/blog/:slug", file: "./pages/BlogDetail.jsx" },
  { path: "/about", file: "./pages/About.jsx", loader: () => ({}) },
  { path: "/projects", file: "./pages/Projects.jsx", loader: () => ({}) },
  { path: "/contact", file: "./pages/Contact.jsx", loader: () => ({}) },
  { path: "/nsc-admin-panel-x9k2", file: "./pages/Admin.jsx" },
  { path: "*", file: "./pages/NotFound.jsx" },
];