import React, { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../../actions/productAction";
import "./Search.css";
import MetaData from "../layout/MetaData";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProduct(""));
  }, [dispatch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.trim().length > 0 && products) {
      const userInputLower = value.toLowerCase();
      const filteredMatches = products.filter((product) =>
        product.name.toLowerCase().includes(userInputLower)
      );
      setSuggestions(filteredMatches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (e, productName) => {
    e.preventDefault();
    setKeyword(productName);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearSearch = () => {
    setKeyword("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search Dynamic Catalog -- ECOMMERCE" />
      
      <div className="interactiveSearchWrapper">
        <form className="interactiveSearchBox" onSubmit={searchSubmitHandler}>
          <div className="searchIconLeft">
            <SearchIcon />
          </div>
          
          <div className="searchFieldContainer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to find laptops, footwear, apparel..."
              value={keyword}
              onChange={handleInputChange}
              onFocus={() => keyword && suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
            />

            {keyword && (
              <button type="button" className="clearSearchBtn" onClick={clearSearch}>
                <CloseIcon style={{ fontSize: "1.2vmax" }} />
              </button>
            )}
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestionGrid">
                <div className="suggestionHeader">Matching Store Results</div>
                <div className="suggestionGridScroll">
                  {suggestions.map((product) => (
                    <div 
                      key={product._id} 
                      className="suggestionCard"
                      onMouseDown={(e) => handleSuggestionClick(e, product.name)}
                    >
                      <img src={product.images[0]?.url} alt="" />
                      <div className="suggestionInfo">
                        <p className="suggestName">{product.name}</p>
                        <p className="suggestPrice">₹{product.price}</p>
                        <span className="suggestCategory">{product.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="interactiveSearchBtn">Search</button>
        </form>
      </div>
    </Fragment>
  );
};

export default Search;