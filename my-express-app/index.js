// Load environment variables from .env file
require('dotenv').config();

// Import the Express.js library
const express = require('express');

// Create an instance of the Express application
const app = express();

// Define the port the server will listen on
const port = 3000;

// --- Custom Error Classes ---
class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError'; 
    this.statusCode = 404;    
  }
}

class ValidationError extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;      
  }
}

// --- Async Error Handling Wrapper ---
const asyncHandler = (fn) => (req, res, next) => {
  // Execute the asynchronous function and catch any errors.
  // If an error occurs, it's passed to the `next` middleware.
  Promise.resolve(fn(req, res, next)).catch(next);
};


// --- Global Middleware ---

// 1. JSON Body Parsing Middleware
app.use(express.json());

// 2. Custom Logger Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString(); 
  console.log(`[${timestamp}] ${req.method} ${req.url}`); 
  next(); 
});


// --- In-Memory Data Store (simulating a database) ---
let products = [
  { id: '1', name: 'Laptop', description: 'Powerful laptop for coding', price: 1200, category: 'Electronics', inStock: true },
  { id: '2', name: 'Mouse', description: 'Wireless optical mouse', price: 25, category: 'Electronics', inStock: true },
  { id: '3', name: 'Keyboard', description: 'Mechanical keyboard with RGB', price: 90, category: 'Electronics', inStock: false },
  { id: '4', name: 'Monitor', description: '27-inch 4K display', price: 350, category: 'Electronics', inStock: true },
  { id: '5', name: 'Desk Chair', description: 'Ergonomic office chair', price: 250, category: 'Furniture', inStock: true },
  { id: '6', name: 'Webcam', description: 'Full HD webcam for video calls', price: 60, category: 'Electronics', inStock: true },
  { id: '7', name: 'Headphones', description: 'Noise-cancelling over-ear headphones', price: 180, category: 'Audio', inStock: true },
  { id: '8', name: 'Smart Speaker', description: 'Voice-controlled smart speaker', price: 100, category: 'Audio', inStock: false },
  { id: '9', name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', price: 40, category: 'Lighting', inStock: true },
  { id: '10', name: 'External SSD', description: '1TB portable solid-state drive', price: 150, category: 'Storage', inStock: true },
  { id: '11', name: 'Smartphone', description: 'Latest model with AI features', price: 899, category: 'Electronics', inStock: true },
  { id: '12', name: 'Coffee Maker', description: 'Programmable drip coffee machine', price: 75, category: 'Kitchen Appliances', inStock: true },
  { id: '13', name: 'Blender', description: 'High-speed blender for smoothies', price: 120, category: 'Kitchen Appliances', inStock: false },
  { id: '14', name: 'Running Shoes', description: 'Lightweight and breathable running shoes', price: 110, category: 'Apparel', inStock: true },
  { id: '15', name: 'Yoga Mat', description: 'Non-slip, eco-friendly yoga mat', price: 35, category: 'Fitness', inStock: true },
  { id: '16', name: 'Novel - Sci-Fi', description: 'Bestselling science fiction novel', price: 15, category: 'Books', inStock: true },
  { id: '17', name: 'Cookbook - Italian', description: 'Authentic Italian recipes', price: 22, category: 'Books', inStock: true },
  { id: '18', name: 'Smart Thermostat', description: 'Energy-saving home climate control', price: 199, category: 'Smart Home', inStock: true },
  { id: '19', name: 'Security Camera', description: 'Outdoor wireless security camera', price: 130, category: 'Smart Home', inStock: false },
  { id: '20', name: 'Electric Toothbrush', description: 'Rechargeable with multiple brush modes', price: 55, category: 'Personal Care', inStock: true },
  { id: '21', name: 'Gaming Console', description: 'Next-gen gaming system', price: 499, category: 'Gaming', inStock: true },
  { id: '22', name: 'Wireless Earbuds', description: 'Compact and high-fidelity audio', price: 99, category: 'Audio', inStock: true },
  { id: '23', name: 'Backpack', description: 'Durable laptop backpack with multiple compartments', price: 80, category: 'Accessories', inStock: true },
  { id: '24', name: 'Water Bottle', description: 'Insulated stainless steel water bottle', price: 20, category: 'Outdoor', inStock: true },
  { id: '25', name: 'Drawing Tablet', description: 'Digital drawing tablet for artists', price: 280, category: 'Art & Design', inStock: true },
];

// --- Helper Function for ID Generation ---
const generateId = () => {
  return Date.now().toString(); 
};

// --- Custom Middleware Functions ---

// Authentication Middleware (API Key)
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; 
  const validApiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn('Authentication failed: No API key provided.');
    return res.status(401).json({ message: 'Authentication failed: No API key provided. Please include x-api-key header.' });
  }

  if (apiKey !== validApiKey) {
    console.warn('Authentication failed: Invalid API key provided.');
    return res.status(401).json({ message: 'Authentication failed: Invalid API key.' });
  }

  console.log('API Key authenticated successfully.');
  next(); 
};

// Validation Middleware for creating a new product (POST)
const validateProductCreation = (req, res, next) => {
  const { name, price, category, inStock } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new ValidationError('Product name is required and must be a non-empty string.');
  }
  if (typeof price !== 'number' || price <= 0) {
    throw new ValidationError('Product price is required and must be a positive number.');
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    throw new ValidationError('Product category is required and must be a non-empty string.');
  }
  
  if (typeof inStock !== 'undefined' && typeof inStock !== 'boolean') {
    throw new ValidationError('inStock must be a boolean if provided.');
  }

  next(); 
};

// Validation Middleware for updating an existing product (PUT)
const validateProductUpdate = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  // At least one field must be provided for update
  if (Object.keys(req.body).length === 0) {
    throw new ValidationError('No fields provided for update.');
  }

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    throw new ValidationError('Product name must be a non-empty string if provided.');
  }
  if (description !== undefined && (typeof description !== 'string')) {
    throw new ValidationError('Product description must be a string if provided.');
  }
  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    throw new ValidationError('Product price must be a positive number if provided.');
  }
  if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
    throw new ValidationError('Product category must be a non-empty string if provided.');
  }
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    throw new ValidationError('inStock must be a boolean if provided.');
  }

  next()
};


// --- RESTful API Routes for the 'products' resource ---

app.get('/api/products', asyncHandler((req, res) => {
  let filteredProducts = [...products];

  // 1. Filtering by category
  const category = req.query.category;
  if (category) {
    filteredProducts = filteredProducts.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 2. Pagination
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 5; // Default to 5 items per page

  // Basic validation for pagination parameters
  if (isNaN(page) || page <= 0) {
    throw new ValidationError('Page number must be a positive integer.');
  }
  if (isNaN(limit) || limit <= 0) {
    throw new ValidationError('Limit must be a positive integer.');
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limit);

  res.json({
    products: paginatedProducts,
    meta: {
      totalProducts: totalProducts,
      currentPage: page,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
}));


// GET /api/products/search: Search products by name
app.get('/api/products/search', asyncHandler((req, res) => {
  const searchTerm = req.query.q; 

  if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
    throw new ValidationError('Search query (q) is required and must be a non-empty string.');
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(lowerCaseSearchTerm)
  );

  res.json(searchResults);
}));

// GET /api/products/stats: Get product statistics
app.get('/api/products/stats', asyncHandler((req, res) => {
  const stats = {
    totalProducts: products.length,
    totalInStock: products.filter(p => p.inStock).length,
    totalOutOfStock: products.filter(p => !p.inStock).length,
    totalValueInStock: products
      .filter(p => p.inStock)
      .reduce((sum, p) => sum + p.price, 0),
    countByCategory: {}, 
    categories: [] 
  };

  // Calculate count by category and list unique categories
  products.forEach(p => {
    const category = p.category;
    if (stats.countByCategory[category]) {
      stats.countByCategory[category]++;
    } else {
      stats.countByCategory[category] = 1;
      stats.categories.push(category); 
    }
  });

  res.json(stats);
}));

// GET /api/products/:id: Get a single product by ID
app.get('/api/products/:id', asyncHandler((req, res) => {
  const id = req.params.id;
  const product = products.find(p => p.id === id);

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found.`);
  }
  res.json(product);
}));

// POST /api/products: Create a new product
app.post(
  '/api/products',
  authenticateApiKey,
  validateProductCreation,
  asyncHandler((req, res) => {
    const newProductData = req.body;

    const newProduct = {
      id: generateId(),
      name: newProductData.name,
      description: newProductData.description || 'No description provided.',
      price: newProductData.price,
      category: newProductData.category,
      inStock: typeof newProductData.inStock === 'boolean' ? newProductData.inStock : true
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  })
);

// PUT /api/products/:id: Update an existing product
app.put(
  '/api/products/:id',
  authenticateApiKey,
  validateProductUpdate,
  asyncHandler((req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundError(`Product with ID ${id} not found for update.`);
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updatedFields,
      id: id
    };
    res.json(products[productIndex]);
  })
);

// DELETE /api/products/:id: Delete a product
app.delete(
  '/api/products/:id',
  authenticateApiKey,
  asyncHandler((req, res) => {
    const id = req.params.id;

    const initialProductCount = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialProductCount) {
      throw new NotFoundError(`Product with ID ${id} not found for deletion.`);
    }
    res.status(204).send(); // 204 No Content for successful deletion
  })
);

// --- Root Endpoint ---
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Access /api/products for product data.');
});


// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err); // Log the full error for debugging on the server side

  // Determine the status code: use custom error's statusCode or default to 500
  const statusCode = err.statusCode || 500;

  // Determine the error message: use custom error's message or a generic one
  const message = err.message || 'An unexpected server error occurred.';

  // Send the error response in a consistent JSON format
  res.status(statusCode).json({
    error: {
      name: err.name || 'ServerError', 
      message: message,
    }
  });
});


// --- Start the Express Server ---
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
  console.log('\n--- API Endpoints Available ---');
  console.log(`  GET    http://localhost:${port}/api/products?category=<name>&page=<num>&limit=<num>`);
  console.log(`  GET    http://localhost:${port}/api/products/search?q=<keyword>`);
  console.log(`  GET    http://localhost:${port}/api/products/stats`);
  console.log(`  GET    http://localhost:${port}/api/products/:id`); // This order is important!
  console.log(`  POST   http://localhost:${port}/api/products       (requires API Key, validates body)`);
  console.log(`  PUT    http://localhost:${port}/api/products/:id    (requires API Key, validates body)`);
  console.log(`  DELETE http://localhost:${port}/api/products/:id    (requires API Key)`);
  console.log('\n--- Test with API Key: mysecretapikey123 ---\n');
});
