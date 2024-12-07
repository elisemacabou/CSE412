from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
import psycopg2
import requests
from fastapi.middleware.cors import CORSMiddleware

# Initialize the app
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Database connection settings
DATABASE_URL = "postgresql://postgres:password@localhost:5432/realestate"
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# RapidAPI headers for Zillow API
RAPIDAPI_HOST = "zillow-com1.p.rapidapi.com"
RAPIDAPI_KEY = "hidden"

headers = {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key": RAPIDAPI_KEY,
}

# Models
class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class FavoriteRequest(BaseModel):
    user_id: int
    property_id: int


# Routes
@app.post("/register")
def register_user(user: UserRegister):
    try:
        cur.execute(
            """
            INSERT INTO users (username, email, password)
            VALUES (%s, %s, %s)
            """,
            (user.username, user.email, user.password),
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")
    return {"message": "User registered successfully"}


@app.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    # Log incoming username and password
    print(f"Login attempt: username={form_data.username}, password={form_data.password}")
    
    # Fetch user by email
    cur.execute(
        "SELECT id, password FROM users WHERE email = %s", (form_data.username,)
    )
    user = cur.fetchone()

    # Log user fetched from the database
    print(f"User fetched from database: {user}")

    # Check if user exists and password matches
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user[1] != form_data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "user_id": user[0]}


@app.post("/favorites/add")
def add_to_favorites(favorite: FavoriteRequest):
    try:
        cur.execute(
            """
            INSERT INTO favorites (user_id, property_id)
            VALUES (%s, %s)
            """,
            (favorite.user_id, favorite.property_id),
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding favorite: {str(e)}")
    return {"message": "Property added to favorites"}


@app.get("/favorites/{user_id}")
def get_favorites(user_id: int):
    try:
        # Debugging: Log the incoming user ID
        print(f"Fetching favorites for user ID: {user_id}")
        
        # Execute the query to fetch favorites
        cur.execute(
            """
            SELECT p.*
            FROM properties p
            INNER JOIN favorites f ON p.id = f.property_id
            WHERE f.user_id = %s
            """,
            (user_id,),
        )
        properties = cur.fetchall()

        # Debugging: Log the number of properties fetched from the database
        print(f"Number of favorite properties fetched for user {user_id}: {len(properties)}")

        if not properties:
            print(f"No favorites found for user ID: {user_id}")
            return {"message": "No favorites found"}

        # Transform the raw data into a structured list
        property_list = [
            {
                "id": row[0],
                "zillow_id": row[1],
                "price": row[2],
                "bedrooms": row[3],
                "bathrooms": row[4],
                "days_on_zillow": row[5],
                "address": row[6],
                "img_src": row[7],
                "property_type": row[8],
                "living_area": row[9],
                "lot_area_value": row[10],
                "lot_area_unit": row[11],
                "listing_status": row[12],
                "currency": row[13],
                "country": row[14],
            }
            for row in properties
        ]

        # Debugging: Log that properties are successfully processed
        print(f"Structured {len(property_list)} favorite properties for user {user_id}")

        return {"favorites": property_list}

    except Exception as e:
        # Debugging: Log any errors that occur
        print(f"Error fetching favorites for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching favorites: {str(e)}")



@app.delete("/favorites/remove")
def remove_favorite(favorite: FavoriteRequest):
    try:
        cur.execute(
            """
            DELETE FROM favorites
            WHERE user_id = %s AND property_id = %s
            """,
            (favorite.user_id, favorite.property_id),
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error removing favorite: {str(e)}")
    return {"message": "Property removed from favorites"}

@app.post("/properties/filter")
def filter_properties(filters: dict):
    try:
        # Build the base query
        query = """
            SELECT id, zillow_id, price, bedrooms, bathrooms, days_on_zillow, address, img_src, 
                   property_type, living_area, lot_area_value, lot_area_unit, listing_status, currency, country, city
            FROM properties
            WHERE price BETWEEN %s AND %s
            AND living_area BETWEEN %s AND %s
        """
        params = [
            filters.get("priceMin", 0),  # Default min price
            filters.get("priceMax", 10000000),  # Default max price
            filters.get("squareFeetMin", 0),  # Default min square feet
            filters.get("squareFeetMax", 50000),  # Default max square feet
        ]

        # Add optional filters for bedrooms and city
        if filters.get("bedrooms"):
            query += " AND bedrooms = %s"
            params.append(filters["bedrooms"])

        if filters.get("city"):
            query += " AND city = %s"
            params.append(filters["city"])

        # Execute the query with parameters
        cur.execute(query, params)
        properties = cur.fetchall()

        if not properties:
            return {"properties": [], "message": "No properties found matching the filters."}

        # Transform raw database rows into structured property objects
        property_list = [
            {
                "id": row[0],
                "zillow_id": row[1],
                "price": row[2],
                "bedrooms": row[3],
                "bathrooms": row[4],
                "days_on_zillow": row[5],
                "address": row[6],
                "img_src": row[7] or "https://via.placeholder.com/400",
                "property_type": row[8],
                "living_area": row[9],
                "lot_area_value": row[10],
                "lot_area_unit": row[11],
                "listing_status": row[12],
                "currency": row[13],
                "country": row[14],
                "city": row[15],
            }
            for row in properties
        ]

        return {"properties": property_list}

    except Exception as e:
        print(f"Error filtering properties: {e}")
        raise HTTPException(status_code=500, detail=f"Error filtering properties: {str(e)}")
@app.get("/search")
def search_properties(location: str, status_type: str = "ForSale"):
    url = f"https://{RAPIDAPI_HOST}/propertyExtendedSearch"
    params = {
        "location": location,
        "status_type": status_type,
        "home_type": "Houses",
        "daysOn": "7",
        "soldInLast": "1",
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch properties from Zillow API")
    
    properties = response.json().get("props", [])
    saved_properties = []

    # Insert properties into the database, including the city
    for prop in properties:
        property_data = {
            "zillow_id": prop["zpid"],
            "price": prop["price"],
            "bedrooms": prop["bedrooms"],
            "bathrooms": prop["bathrooms"],
            "days_on_zillow": prop["daysOnZillow"],
            "address": prop["address"],
            "img_src": prop["imgSrc"],
            "property_type": prop["propertyType"],
            "living_area": prop.get("livingArea", 0),
            "lot_area_value": prop.get("lotAreaValue", 0),
            "lot_area_unit": prop.get("lotAreaUnit", "sqft"),
            "listing_status": prop["listingStatus"],
            "currency": prop.get("currency", "USD"),
            "country": prop.get("country", "USA"),
            "city": location,  # Add the city from the search
        }
        try:
            cur.execute(
                """
                INSERT INTO properties (zillow_id, price, bedrooms, bathrooms, days_on_zillow, address, img_src, 
                property_type, living_area, lot_area_value, lot_area_unit, listing_status, currency, country, city)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (zillow_id) DO NOTHING
                """,
                (
                    property_data["zillow_id"],
                    property_data["price"],
                    property_data["bedrooms"],
                    property_data["bathrooms"],
                    property_data["days_on_zillow"],
                    property_data["address"],
                    property_data["img_src"],
                    property_data["property_type"],
                    property_data["living_area"],
                    property_data["lot_area_value"],
                    property_data["lot_area_unit"],
                    property_data["listing_status"],
                    property_data["currency"],
                    property_data["country"],
                    property_data["city"],  # Include city in the database
                ),
            )
            conn.commit()
            saved_properties.append(property_data)
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "properties": saved_properties,
        "city": location,
    }

 # START THE BACKEND: python -m uvicorn data:app
    
    return {"properties": saved_properties}

 # START THE BACKEND: python -m uvicorn data:app
