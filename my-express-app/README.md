## Express.js Product API
This is a simple RESTful API built with Express.js for managing product data. It demonstrates core backend concepts including routing, middleware, error handling, filtering, pagination, searching, and basic statistics.

# Features
- RESTful CRUD Operations: Create, Read, Update, and Delete products.
- In-Memory Data Store: Products are stored in a JavaScript array (data is reset on server restart).
- Custom Logger Middleware: Logs request method, URL, and timestamp for every incoming request.
- JSON Body Parsing: Automatically parses JSON payloads from incoming requests.
- API Key Authentication: Protects POST, PUT, and DELETE routes using an x-api-key header.
- Input Validation Middleware: Ensures data integrity for product creation and updates.
- Global Error Handling: Catches and formats errors (e.g., NotFoundError, ValidationError, ServerError) with appropriate HTTP status codes.
- Asynchronous Error Handling: Uses an asyncHandler wrapper to gracefully manage errors in asynchronous routes.
- Filtering: Filter products by category using query parameters.
- Pagination: Retrieve products in chunks using page and limit query parameters.
- Product Search: Search products by name using a dedicated /api/products/search endpoint.
- Product Statistics: Get aggregate data like total product count, in-stock/out-of-stock counts, and category distribution.

# Prerequisites
Before you begin, ensure you have the following installed on your system:
Node.js: (LTS version recommended)
Download Node.js
npm: (Node Package Manager, comes with Node.js)

# Installation
Follow these steps to set up and run the project locally:

Clone the repository (if applicable) or navigate to your project folder:

'''  If you're starting from scratch in a new folder
mkdir my-express-app
cd my-express-app

  # If you have an existing repo, navigate to it
cd path/to/your/repo '''

Initialize a new Node.js project:
This creates the package.json file.

npm init -y

Install project dependencies:
This installs Express.js and dotenv (for environment variables).

npm install express dotenv

Environment Variables
This project uses environment variables for sensitive information like the API key.

Create a .env file:
In the root of your project directory, create a new file named .env.

Copy variables from .env.example:
Open the .env.example file (provided in the project) and copy its contents into your newly created .env file.

# .env.example (contents to copy)
API_KEY=mysecretapikey123

Set your API Key:
In your .env file, replace mysecretapikey123 with a strong, unique secret key of your choice. Do not share your .env file or commit it to version control.

# .env (example with your actual key)
API_KEY=your_very_secret_api_key_here

Running the Server
Once installed and configured, you can start the Express.js server:

Start the server:

node index.js

Verify:
You should see output in your terminal indicating that the server is listening on port 3000:

Express server listening at http://localhost:3000

--- API Endpoints Available ---
  GET    http://localhost:3000/api/products?category=<name>&page=<num>&limit=<num>
  GET    http://localhost:3000/api/products/search?q=<keyword>
  GET    http://localhost:3000/api/products/stats
  GET    http://localhost:3000/api/products/:id
  POST   http://localhost:3000/api/products       (requires API Key, validates body)
  PUT    http://localhost:3000/api/products/:id    (requires API Key, validates body)
  DELETE http://localhost:3000/api/products/:id    (requires API Key)

--- Test with API Key: mysecretapikey123 ---

The API will be accessible at http://localhost:3000.

API Endpoints Documentation
All API endpoints are prefixed with /api.

Method

Path

Description

Authentication Required

GET

/api/products

List all products with optional filtering by category and pagination.

No

GET

/api/products/:id

Retrieve a single product by its unique ID.

No

POST

/api/products

Create a new product.

Yes (x-api-key)

PUT

/api/products/:id

Update an existing product by its ID.

Yes (x-api-key)

DELETE

/api/products/:id

Delete a product by its ID.

Yes (x-api-key)

GET

/api/products/search

Search products by name using a query parameter q.

No

GET

/api/products/stats

Get various statistics about the products (e.g., counts by category).

No

API Key for Authenticated Endpoints:
For POST, PUT, and DELETE requests, you must include an x-api-key header with the value set in your .env file (e.g., mysecretapikey123).

Examples of Requests and Responses
You can use curl in your terminal or a tool like Postman/Insomnia to test these endpoints.

1. GET /api/products - List All Products (with Filtering & Pagination)
Request (All products, default pagination):

curl http://localhost:3000/api/products

Response Example:

{
  "products": [
    { "id": "1", "name": "Laptop", "description": "Powerful laptop for coding", "price": 1200, "category": "Electronics", "inStock": true },
    { "id": "2", "name": "Mouse", "description": "Wireless optical mouse", "price": 25, "category": "Electronics", "inStock": true },
    { "id": "3", "name": "Keyboard", "description": "Mechanical keyboard with RGB", "price": 90, "category": "Electronics", "inStock": false },
    { "id": "4", "name": "Monitor", "description": "27-inch 4K display", "price": 350, "category": "Electronics", "inStock": true },
    { "id": "5", "name": "Desk Chair", "description": "Ergonomic office chair", "price": 250, "category": "Furniture", "inStock": true }
  ],
  "meta": {
    "totalProducts": 25,
    "currentPage": 1,
    "limit": 5,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}

Request (Filter by category "Electronics", page 2, limit 2):

curl "http://localhost:3000/api/products?category=Electronics&page=2&limit=2"

Response Example:

{
  "products": [
    { "id": "6", "name": "Webcam", "description": "Full HD webcam for video calls", "price": 60, "category": "Electronics", "inStock": true },
    { "id": "11", "name": "Smartphone", "description": "Latest model with AI features", "price": 899, "category": "Electronics", "inStock": true }
  ],
  "meta": {
    "totalProducts": 6,
    "currentPage": 2,
    "limit": 2,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}

2. GET /api/products/:id - Get a Specific Product
Request:

curl http://localhost:3000/api/products/1

Response Example (Success):

{
  "id": "1",
  "name": "Laptop",
  "description": "Powerful laptop for coding",
  "price": 1200,
  "category": "Electronics",
  "inStock": true
}

Response Example (Not Found):

curl http://localhost:3000/api/products/999
```json
{
  "error": {
    "name": "NotFoundError",
    "message": "Product with ID 999 not found."
  }
}

3. POST /api/products - Create a New Product
Request:

curl -X POST \
-H "Content-Type: application/json" \
-H "x-api-key: mysecretapikey123" \
-d '{"name":"Smart TV", "description":"55-inch 4K Smart TV", "price":700, "category":"Electronics", "inStock":true}' \
http://localhost:3000/api/products

Response Example (Success):

{
  "id": "1700000000000", # (Dynamic ID based on timestamp)
  "name": "Smart TV",
  "description": "55-inch 4K Smart TV",
  "price": 700,
  "category": "Electronics",
  "inStock": true
}

Response Example (Validation Error - missing fields):

curl -X POST \
-H "Content-Type: application/json" \
-H "x-api-key: mysecretapikey123" \
-d '{"name":"Incomplete Product"}' \
http://localhost:3000/api/products
```json
{
  "error": {
    "name": "ValidationError",
    "message": "Product price is required and must be a positive number."
  }
}

Response Example (Authentication Error):

curl -X POST \
-H "Content-Type: application/json" \
-d '{"name":"Unauthorized Product", "price":10, "category":"Test"}' \
http://localhost:3000/api/products
```json
{
  "message": "Authentication failed: No API key provided. Please include x-api-key header."
}

4. PUT /api/products/:id - Update an Existing Product
Request:

curl -X PUT \
-H "Content-Type: application/json" \
-H "x-api-key: mysecretapikey123" \
-d '{"price":30, "inStock":false}' \
http://localhost:3000/api/products/2

Response Example (Success):

{
  "id": "2",
  "name": "Mouse",
  "description": "Wireless optical mouse",
  "price": 30,
  "category": "Electronics",
  "inStock": false
}

Response Example (Not Found):

curl -X PUT \
-H "Content-Type: application/json" \
-H "x-api-key: mysecretapikey123" \
-d '{"price":50}' \
http://localhost:3000/api/products/999
```json
{
  "error": {
    "name": "NotFoundError",
    "message": "Product with ID 999 not found for update."
  }
}

5. DELETE /api/products/:id - Delete a Product
Request:

curl -X DELETE \
-H "x-api-key: mysecretapikey123" \
http://localhost:3000/api/products/3

Response Example (Success):
(No content in response body, 204 No Content status)

# HTTP/1.1 204 No Content

Response Example (Not Found):

curl -X DELETE \
-H "x-api-key: mysecretapikey123" \
http://localhost:3000/api/products/999
```json
{
  "error": {
    "name": "NotFoundError",
    "message": "Product with ID 999 not found for deletion."
  }
}

6. GET /api/products/search - Search Products by Name
Request:

curl "http://localhost:3000/api/products/search?q=smart"

Response Example:

[
  { "id": "8", "name": "Smart Speaker", "description": "Voice-controlled smart speaker", "price": 100, "category": "Audio", "inStock": false },
  { "id": "11", "name": "Smartphone", "description": "Latest model with AI features", "price": 899, "category": "Electronics", "inStock": true },
  { "id": "18", "name": "Smart Thermostat", "description": "Energy-saving home climate control", "price": 199, "category": "Smart Home", "inStock": true }
]

7. GET /api/products/stats - Get Product Statistics
Request:

curl http://localhost:3000/api/products/stats

Response Example:

{
  "totalProducts": 25,
  "totalInStock": 20,
  "totalOutOfStock": 5,
  "totalValueInStock": 4640,
  "countByCategory": {
    "Electronics": 6,
    "Furniture": 1,
    "Audio": 2,
    "Lighting": 1,
    "Storage": 1,
    "Kitchen Appliances": 2,
    "Apparel": 1,
    "Fitness": 1,
    "Books": 2,
    "Smart Home": 2,
    "Personal Care": 1,
    "Gaming": 1,
    "Accessories": 1,
    "Outdoor": 1,
    "Art & Design": 1
  },
  "categories": [
    "Electronics",
    "Furniture",
    "Audio",
    "Lighting",
    "Storage",
    "Kitchen Appliances",
    "Apparel",
    "Fitness",
    "Books",
    "Smart Home",
    "Personal Care",
    "Gaming",
    "Accessories",
    "Outdoor",
    "Art & Design"
  ]
}

