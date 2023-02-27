import "./ImageGallery.css";
import React, { useState, useRef, useCallback } from "react";
import axios from "axios";

function ImageGallery() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const observer = useRef(null);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  function handleSearchSubmit(event) {
    event.preventDefault();
    setCurrentPage(1);
    axios
      .get(
        `https://api.unsplash.com/search/photos?query=${searchTerm}&page=1`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.REACT_APP_UnSplash_Api_Key}`
          }
        }
      )
      .then((response) => {
        setImages(response.data.results);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleSearchInputChange(event) {
    setSearchTerm(event.target.value);
  }

  const loadMoreImages = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        axios
          .get(
            `https://api.unsplash.com/search/photos?query=${searchTerm}&page=${
              currentPage + 1
            }`,
            {
              headers: {
                Authorization: `Client-ID ${process.env.REACT_APP_UnSplash_Api_Key}`
              }
            }
          )
          .then((response) => {
            setImages([...images, ...response.data.results]);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    [currentPage, totalPages, images, searchTerm]
  );

  const imageRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(loadMoreImages);
      if (node) observer.current.observe(node);
    },
    [loadMoreImages]
  );

  return (
    <div className="App">
      <h2 className="HeaderTxt"> UnSplash Image Gallery App </h2>
      <div className={`navbar ${darkMode ? "dark" : ""}`}>
        <h1>FrolicDesigns</h1>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button type="submit">Search</button>
        </form>
        <button onClick={handleDarkModeToggle}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="ImageList">
        {images.map((image, index) => (
          <img
            key={image.id}
            src={image.urls.regular}
            alt={image.description}
            ref={images.length === index + 1 ? imageRef : null}
          />
        ))}
      </div>

      {images.length > 0 && (
        <div className={`footer ${darkMode ? "dark" : ""}`}>
          <p>
            2023 Copyright ©{" "}
            <a
              href="https://github.com/FrolicBrat"
              target="_blank"
              rel="noreferrer"
            >
              FrolicDesigns
            </a>{" "}
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
