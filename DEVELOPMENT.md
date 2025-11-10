# Development Guide - Rescue Eats

## Project Structure

```
rescue-eats/
├── assets/
│   └── css/
│       └── tailwind.css          # Global styles and Tailwind utilities
├── components/
│   ├── ProductCard.vue           # Product display card
│   ├── SearchBar.vue             # Search with filters
│   └── OrderSummaryCard.vue      # Order voucher display
├── middleware/
│   └── auth.ts                   # Authentication middleware
├── pages/
│   ├── index.vue                 # Homepage with product grid
│   ├── auth/
│   │   ├── login.vue            # Login page
│   │   └── register.vue         # Registration page
│   ├── products/
│   │   └── [id].vue             # Product detail page
│   ├── orders/
│   │   └── index.vue            # User orders page
│   └── store/
│       ├── dashboard.vue        # Store product management
│       └── products/
│           └── new.vue          # Add new product
├── server/
│   ├── api/
│   │   ├── auth/                # Authentication endpoints
│   │   ├── products/            # Product CRUD endpoints
│   │   └── orders/              # Order endpoints
│   └── models/                  # Mongoose schemas
│       ├── user.schema.ts
│       ├── store.schema.ts
│       ├── product.schema.ts
│       └── order.schema.ts
├── public/                       # Static assets
├── nuxt.config.ts               # Nuxt configuration
├── tailwind.config.ts           # Tailwind configuration
└── package.json                 # Dependencies

```

## Tech Stack Details

### Frontend
- **Nuxt 4**: Vue.js framework with SSR
- **Vue 3**: Progressive JavaScript framework
- **Tailwind CSS**: Utility-first CSS framework
- **Iconify**: Icon framework (using Lucide icons)

### Backend
- **Nitro**: Server engine for Nuxt
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **bcrypt**: Password hashing

### Authentication
- **nuxt-auth-utils**: Session-based authentication

### PWA
- **@vite-pwa/nuxt**: Progressive Web App support

## Development Workflow

### 1. Setup Development Environment

```bash
# Clone repository
git clone https://github.com/pin705/Rescue-Eats.git
cd Rescue-Eats

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB connection

# Start development server
npm run dev
```

### 2. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB
mongod

# Access MongoDB shell
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
- Follow instructions in DEPLOYMENT.md

### 3. Development Server

```bash
npm run dev
```

Access at: `http://localhost:3000`

### 4. Building for Production

```bash
# Build application
npm run build

# Preview production build
npm run preview
```

## Database Schemas

### User Schema
```typescript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'customer' | 'store' | 'admin',
  createdAt: Date
}
```

### Store Schema
```typescript
{
  userId: ObjectId (ref: User),
  storeName: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  phone: String,
  status: 'pending' | 'approved' | 'rejected' | 'suspended',
  createdAt: Date,
  approvedAt: Date
}
```

### Product Schema
```typescript
{
  storeId: ObjectId (ref: Store),
  name: String,
  description: String,
  category: 'meat' | 'vegetables' | 'dairy' | 'bakery' | 'fruits' | 'prepared-food' | 'other',
  images: [String],
  expiryDate: Date,
  quantity: Number,
  originalPrice: Number,
  discountedPrice: Number,
  discountPercentage: Number (auto-calculated),
  status: 'active' | 'archived' | 'sold-out',
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```typescript
{
  userId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  storeId: ObjectId (ref: Store),
  quantity: Number,
  totalPrice: Number,
  voucherCode: String (unique, auto-generated),
  status: 'reserved' | 'confirmed' | 'completed' | 'cancelled' | 'expired',
  reservedAt: Date,
  expiresAt: Date (24h from reservation),
  completedAt: Date,
  productSnapshot: Object (saved product details)
}
```

## API Endpoints

### Authentication
```
POST   /api/auth/register  - Register new user
POST   /api/auth/login     - Login user
POST   /api/auth/logout    - Logout user
GET    /api/auth/session   - Get current session
```

### Products
```
GET    /api/products           - List products (with filters)
GET    /api/products/:id       - Get product details
POST   /api/products           - Create product (store only)
PUT    /api/products/:id       - Update product (store only)
DELETE /api/products/:id       - Archive product (store only)
```

### Orders
```
POST   /api/orders        - Create reservation
GET    /api/orders        - Get user orders
```

## Styling Guidelines

### Color Palette
```css
/* Earth Green - Primary */
--earth-green-50: #f0fdf4
--earth-green-800: #166534  /* Main brand color */
--earth-green-900: #14532d

/* Neutral */
--gray-50: #f9fafb
--gray-900: #111827
```

### Tailwind Classes

**Buttons**
```html
<button class="btn-primary">Primary Button</button>
<button class="btn-secondary">Secondary Button</button>
<button class="btn-outline">Outline Button</button>
```

**Inputs**
```html
<input class="input-field" />
```

**Cards**
```html
<div class="card">Card content</div>
```

### Icon Usage

```vue
<Icon name="lucide:search" class="w-5 h-5" />
<Icon name="lucide:store" class="w-5 h-5" />
<Icon name="lucide:package" class="w-5 h-5" />
```

Browse icons: [Lucide Icons](https://lucide.dev/)

## Adding New Features

### 1. Add a New Page

Create file in `pages/` directory:
```vue
<!-- pages/example.vue -->
<template>
  <div>
    <h1>Example Page</h1>
  </div>
</template>

<script setup lang="ts">
// Page logic
</script>
```

### 2. Add New API Endpoint

Create file in `server/api/` directory:
```typescript
// server/api/example.get.ts
export default defineEventHandler(async (event) => {
  return {
    message: 'Hello World'
  }
})
```

### 3. Add New Component

Create file in `components/` directory:
```vue
<!-- components/ExampleComponent.vue -->
<template>
  <div>
    {{ message }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string
}>()
</script>
```

## Testing

### Manual Testing Checklist

**Authentication Flow**
- [ ] Customer registration
- [ ] Store registration (check pending status)
- [ ] Login with customer account
- [ ] Login with store account
- [ ] Logout

**Customer Flow**
- [ ] View homepage
- [ ] Search products by keyword
- [ ] Filter by category
- [ ] Use location search
- [ ] View product details
- [ ] Reserve a product
- [ ] View orders page
- [ ] See voucher code

**Store Flow**
- [ ] Login as store
- [ ] Add new product
- [ ] View dashboard
- [ ] Edit product
- [ ] Archive product

### Database Testing

```javascript
// Connect to MongoDB
mongosh

// Use database
use rescue-eats

// View collections
show collections

// Query examples
db.users.find()
db.stores.find({ status: 'pending' })
db.products.find({ status: 'active' })
db.orders.find({ status: 'reserved' })

// Approve a store
db.stores.updateOne(
  { _id: ObjectId('...') },
  { $set: { status: 'approved' } }
)
```

## Common Development Tasks

### Reset Database
```javascript
// In MongoDB shell
use rescue-eats
db.dropDatabase()
```

### Create Test Data

```javascript
// Create approved store for testing
db.stores.updateOne(
  { storeName: 'Test Store' },
  { $set: { status: 'approved' } }
)
```

### View Server Logs
```bash
# Development logs appear in terminal
npm run dev
```

### Clear Build Cache
```bash
rm -rf .nuxt .output node_modules/.cache
npm run dev
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues
- Check MongoDB is running: `mongosh`
- Verify connection string in `.env`
- Check MongoDB logs

### Build Errors
- Delete `.nuxt` and `.output` directories
- Run `npm install` again
- Check Node.js version: `node --version` (must be 18+)

## Code Style

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Use async/await for asynchronous operations
- Component names in PascalCase
- Use Tailwind CSS utilities instead of custom CSS
- Keep components small and focused

## Resources

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

**Happy coding! 🚀**
