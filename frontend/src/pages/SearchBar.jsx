import React from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ searchQuery, setSearchQuery, placeholder }) => {
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <span className={styles.icon}>Search:</span>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder={placeholder || "Search..."}
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar;
