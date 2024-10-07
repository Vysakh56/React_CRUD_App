import React, { useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const goIconRef = useRef(null);

  const handleFocus = () => {
    if (searchBoxRef.current) {
      searchBoxRef.current.classList.add('focused'); // Add class for focus
    }
  };

  const handleBlur = () => {
    if (searchInputRef.current && searchBoxRef.current) {
      if (searchInputRef.current.value === '') {
        searchBoxRef.current.classList.remove('focused'); // Remove class on blur
      }
    }
  };

  const handleKeyUp = () => {
    if (searchInputRef.current && goIconRef.current) {
      if (searchInputRef.current.value.length > 0) {
        goIconRef.current.classList.add('go-in');
      } else {
        goIconRef.current.classList.remove('go-in');
      }
    }
  };

  useEffect(() => {
    const currentInput = searchInputRef.current;

    if (currentInput) {
      currentInput.addEventListener('focus', handleFocus);
      currentInput.addEventListener('blur', handleBlur);
      currentInput.addEventListener('keyup', handleKeyUp);

      return () => {
        currentInput.removeEventListener('focus', handleFocus);
        currentInput.removeEventListener('blur', handleBlur);
        currentInput.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, []);

  return (
    <div className="search-box" ref={searchBoxRef}>
      <div className="search-icon">
        <i className="fa fa-search"></i>
      </div>
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search"
          id="search"
          autoComplete="off"
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleKeyUp();
          }}
        />
      </form>
      <div className="go-icon" ref={goIconRef}>
        <i className="fa fa-arrow-right"></i>
      </div>
    </div>
  );
};

export default SearchBar;
