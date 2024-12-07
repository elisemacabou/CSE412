TO USE:
install all the dependencies that you need for the backend
navigate to the backend and run with: 
python -m uvicorn data:app

navigate to the frontend realestate folder and run with:
npm start

make sure that local database is up and running is is named "realestate" with user "postgres" -- or change this url in the backend to whatever your database is: DATABASE_URL = "postgresql://postgres:password@localhost:5432/realestate"




For data https://rapidapi.com/apimaker/api/zillow-com1/playground/apiendpoint_93602987-7c54-426d-94f3-1fce926b3ebb
Get /propertyExtentedSearch (city or zipcode as parameter)



CREATE TABLE users (
    id SERIAL PRIMARY KEY,                 -- Unique identifier for the user
    username VARCHAR(50) UNIQUE NOT NULL, -- User's username
    password TEXT NOT NULL                 -- Plain text password (not secure, for testing only)
    email VARCHAR(100) UNIQUE NOT NULL;
);




-- Create the properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,                -- Unique identifier for the property
    zillow_id VARCHAR(50) UNIQUE NOT NULL, -- Unique Zillow property ID
    price INT NOT NULL,                   -- Property price
    bedrooms INT NOT NULL,                -- Number of bedrooms
    bathrooms DECIMAL(3, 1) NOT NULL,     -- Number of bathrooms
    days_on_zillow INT NOT NULL,          -- Days listed on Zillow
    address TEXT NOT NULL,                -- Full address of the property
    img_src TEXT,                         -- URL of the property image
    property_type VARCHAR(50) NOT NULL,   -- Type of property (e.g., single family, condo)
    living_area INT,                      -- Living area in square feet
    lot_area_value INT,                   -- Lot area in square feet
    lot_area_unit VARCHAR(10),            -- Lot area unit (e.g., sqft, acres)
    listing_status VARCHAR(20),           -- Status (e.g., FOR_SALE, SOLD)
    currency VARCHAR(10) DEFAULT 'USD',   -- Currency for the price (default is USD)
    country VARCHAR(50) DEFAULT 'USA'     -- Country of the property (default is USA)
);


-- Table: favorites
CREATE TABLE favorites (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,    -- Foreign key to users table
    property_id INT REFERENCES properties(id) ON DELETE CASCADE, -- Foreign key to properties table
    PRIMARY KEY (user_id, property_id)                     -- Composite primary key
);


Insert a New User:
INSERT INTO users (username, password_hash)
VALUES ('john_doe', 'hashed_password_123');


Insert a New Property:

INSERT INTO properties (zillow_id, price, bedrooms, bathrooms, days_on_zillow, address, img_src, property_type)
VALUES ('Z123456', 499000, 3, 2.5, 10, '123 Main St, Tempe, AZ 85283', 'https://example.com/image.jp



Add a Property to Favorites:
INSERT INTO favorites (user_id, property_id)
VALUES (1, 1); -- User with ID 1 favorites property with ID 1


Query All Favorite Properties for a User:
SELECT p.* FROM properties p INNER JOIN favorites f ON p.id = f.property_id WHERE f.user_id = 1; -- Replace 1 with the user's ID


Delete a Favorite:
DELETE FROM favorites WHERE user_id = 1 AND property_id = 1; -- Remove property from favorites

CREATE TABLE agents (
    agent_id SERIAL PRIMARY KEY,       -- Unique identifier for the agent
    name VARCHAR(100) NOT NULL,        -- Agent's name
    email VARCHAR(150) NOT NULL,       -- Agent's email
    rating DECIMAL(3, 2) NOT NULL,     -- Agent's rating, e.g., 4.75
    property_id INT NOT NULL,          -- Foreign key referencing properties table
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);


