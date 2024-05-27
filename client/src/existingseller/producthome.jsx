import React, { useState, useEffect } from "react";
import "./producthome.css";
import OldSellerSidebar from "./oldside";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faUser, faFileImport, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import storeIcon from "../assets/store-2.png";

const ProductHome = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const productsPerPage = 16;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const response = await fetch("https://mybanda-backend-88l2.onrender.com/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        const productsWithImages = data.map((product) => {
          const imageUrl = product.images.length > 0 ? product.images[0].image_url : "placeholder_url"; // Replace "placeholder_url" with the URL of your placeholder image
          return { ...product, image_url: imageUrl };
        });
        setProducts(productsWithImages);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterOption === "" || (filterOption === "low" && product.quantity_available < 5) || (filterOption === "high" && product.quantity_available >= 5))
  );
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination when performing a new search
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setCurrentPage(1); // Reset pagination when changing the filter option
  };

  const exportToCSV = () => {
    const csvHeaders = ["ID", "Name", "Category", "Price", "Quantity Available", "Image URL"];
    const csvRows = [
      csvHeaders.join(","), // headers row
      ...products.map(product =>
        [
          product.id,
          product.name,
          product.category,
          product.price,
          product.quantity_available,
          product.image_url
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  {/*if (loading) {
    return (
      <div className="loader">
        <img src="https://i.pinimg.com/originals/c1/bc/d8/c1bcd8a8c945b53da6b29f10a2a553c0.gif" alt="Loading" />
      </div>
    );
  } */}

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="product-home-container">
      <div className="productpageheader">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={storeIcon} alt="Store Icon" style={{ width: "20px", height: "auto" }} />
          <h1 style={{ fontSize: "24px", marginLeft: "10px", verticalAlign: "middle" }}>Products</h1>
        </div>
        <div className="header-icons">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faUser} />
          </div>
        </div>
      </div>
      <div className="pbsearch-export">
        <div className="pbsearch-box">
          <FontAwesomeIcon icon={faSearch} className="pbsearchicon" />
          <input type="text" placeholder="Search Products..." value={searchQuery} onChange={handleSearch} />
        </div>
        <div className="filter-dropdown">
          <select value={filterOption} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="low">Low Stock</option>
            <option value="high">High Stock</option>
          </select>
        </div>
        <button className="pdaction-btn" onClick={exportToCSV}>
          <FontAwesomeIcon icon={faFileImport} className="pdimport" />
          Export
        </button>
      </div>
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            {product.quantity_available < 5 && (
              <div className="quantity-tag running-low">
                {product.quantity_available === 0 ? "Out of Stock" : "Running Low"}
              </div>
            )}
            {product.quantity_available >= 5 && (
              <div className="quantity-tag available">Available</div>
            )}
            <div className="product-image">
              <img src={product.image_url} alt="Product" />
            </div>
            <div className="product-info">
              <h2>{product.name.charAt(0).toUpperCase() + product.name.slice(1)}</h2>
              <p>Quantity: {product.quantity_available}</p>
              <p>Category: {product.category}</p>
              <p>Price: {product.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredProducts.length === 0}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <OldSellerSidebar />
    </div>
  );
};

export default ProductHome;
