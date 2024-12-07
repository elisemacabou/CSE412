import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Filters from './components/Filters';
import PropertyGrid from './components/PropertyGrid';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';

function App() {
  const [sortOption, setSortOption] = useState('low-to-high'); // State for sorting
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [user, setUser] = useState(null); // Store user info after login
  const [properties, setProperties] = useState([]); // State for properties
  const [showFavorites, setShowFavorites] = useState(false); // State for toggling favorites view
  const [cities, setCities] = useState([]);
  // Handle sorting change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const addCity = (city) => {
    if (!cities.includes(city)) {
      setCities([...cities, city]); // Add city to the list if it doesn't already exist
      console.log('City added:', city); // Debug log
      console.log('Updated cities list:', [...cities, city]); // Debug log
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false); // Set login state to false
    setUser(null); // Clear user info
    localStorage.removeItem('user'); // Clear stored user data
  };

  // Handle login
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData); // Save logged-in user info
  };

  // Handle property search
  const handleSearch = async (city) => {
    try {
      const response = await fetch(`http://localhost:8000/search?location=${city}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties);
        addCity(city); // Add city to the list dynamically
      } else {
        console.error('Error fetching properties:', response.statusText);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (filters) => {
    try {
      const response = await fetch('http://localhost:8000/properties/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters), // Use the filters passed from the Filters component
      });
  
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties);
        setShowFavorites(false); // Reset favorites view
      } else {
        console.error('Error fetching filtered properties:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch properties:', error);
    }
  };
  
  

  // Fetch and show user's favorite properties
  const fetchFavorites = async () => {
    try {
      if (showFavorites) {
        const defaultFilters = {
          price: 2500000, // Default price filter
          squareFeet: 3000, // Default square feet filter
          bedrooms: null, // Default bedrooms filter (null for "Any")
        };
        handleFilterChange(defaultFilters); // Reset properties to filtered view when untoggled
      } else {
        const response = await fetch(`http://localhost:8000/favorites/1`, { // Replace `1` with user ID
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProperties(data.favorites); // Update properties with favorite properties
          setShowFavorites(true); // Mark as showing favorites
        } else {
          console.error('Error fetching favorites:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error during fetch favorites:', error);
    }
  };

  // Sort properties based on the selected sorting option
  const sortedProperties = [...properties].sort((a, b) => {
    if (sortOption === 'low-to-high') {
      return a.price - b.price; // Sort by price ascending
    } else if (sortOption === 'high-to-low') {
      return b.price - a.price; // Sort by price descending
    }
    return 0; // Default no sorting
  });

  return (
    <Router>
      <div className="App">
        <Header
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          onSearch={handleSearch} // Pass handleSearch to Header
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Filters
                  onSortChange={handleSortChange}
                  onFilterChange={handleFilterChange} // Pass filter handler
                  onFavoritesChange={fetchFavorites} // Pass favorites handler
                  showFavorites={showFavorites} // State for toggling
                  cities={cities}
                />
                <PropertyGrid
                  properties={sortedProperties} // Pass sorted properties
                />
              </>
            }
          />
          <Route path="/login" element={<Login setIsLoggedIn={handleLogin} />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
