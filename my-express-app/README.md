# Express.js Product API
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
- **Node.js**: (LTS version recommended)
   - Download Node.js
- **npm**: (Node Package Manager, comes with Node.js)

# Installation
Follow these steps to set up and run the project locally:

**1. Clone the repository (if applicable) or navigate to your project folder:**

```
 # If you're starting from scratch in a new folder
   mkdir my-express-app
   cd my-express-app

  # If you have an existing repo, navigate to it
   cd path/to/your/repo
```

**2. Initialize a new Node.js project:**
This creates the package.json file.
```
npm init -y
```
**3. Install project dependencies:**
This installs Express.js and dotenv (for environment variables).
```
npm install express body-parser uuid dotenv

```

# Environment Variables
This project uses environment variables for sensitive information like the API key.

**1 .Create a .env file:**
In the root of your project directory, create a new file named .env.

**2. Copy variables from .env.example:**
Open the .env.example file (provided in the project) and copy its contents into your newly created .env file.

```
# .env.example (contents to copy)
API_KEY=mysecretapikey123
```

**3. Set your API Key:**
In your .env file, replace mysecretapikey123 with a strong, unique secret key of your choice. Do not share your .env file or commit it to version control.
```
# .env (example with your actual key)
API_KEY=your_very_secret_api_key_here
```

# Running the Server
Once installed and configured, you can start the Express.js server:

**1. Start the server:**
```
node index.js
```
**2. Verify:**
You should see output in your terminal indicating that the server is listening on port 3000:
```
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
```
The API will be accessible at http://localhost:3000.

# API Endpoints Documentation
## API Endpoints Documentation

All API endpoints are prefixed with `/api`.

| Method | Path | Description | Authentication Required |
| :----- | :-------------------------------------------- | :-------------------------------------------------------------------------- | :---------------------- |
| `GET`  | `/api/products`                               | List all products with optional filtering by category and pagination.       | No                      |
| `GET`  | `/api/products/:id`                           | Retrieve a single product by its unique ID.                                 | No                      |
| `POST` | `/api/products`                               | Create a new product.                                                       | Yes (`x-api-key`)       |
| `PUT`  | `/api/products/:id`                           | Update an existing product by its ID.                                       | Yes (`x-api-key`)       |
| `DELETE`| `/api/products/:id`                           | Delete a product by its ID.                                                 | Yes (`x-api-key`)       |
| `GET`  | `/api/products/search`                        | Search products by name using a query parameter `q`.                        | No                      |
| `GET`  | `/api/products/stats`                         | Get various statistics about the products (e.g., counts by category).       | No                      |

**API Key for Authenticated Endpoints:**
For `POST`, `PUT`, and `DELETE` requests, you must include an `x-api-key` header with the value set in your `.env` file (e.g., `mysecretapikey123`).

## Examples of Requests and Responses

You can use `curl` in your terminal or a tool like Postman/Insomnia to test these endpoints.

### 1. `GET /api/products` - List All Products (with Filtering & Pagination)

**Request (All products, default pagination):**
```bash
curl http://localhost:3000/api/products
