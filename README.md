# 🍃 Rescue Eats - Cứu Vãn Thực Phẩm

A professional web application built with Nuxt 4 to connect buyers with near-expiry food products from stores, reducing food waste and saving money.

## 🌟 Features

### For Customers
- **Location-Based Search**: Find deals near you with geolocation
- **Quick Filters**: Browse by category (Meat, Vegetables, Dairy, Bakery, etc.) or discount level
- **Product Reservation**: Reserve products and receive unique voucher codes
- **My Orders**: Track all reservations with QR/voucher codes

### For Stores
- **Easy Registration**: Simple sign-up with pending approval workflow
- **Product Management**: Add, edit, and archive products with ease
- **Mobile-First**: Optimized for posting products on-the-go
- **Auto-Calculations**: Discount percentages calculated automatically

## 🛠️ Tech Stack

- **Framework**: Nuxt 4 (SSR, SEO optimized)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: nuxt-auth-utils (session-based)
- **PWA**: @vite-pwa/nuxt (installable on mobile)
- **Styling**: Tailwind CSS (earth-green color palette)
- **Icons**: Iconify with Lucide icon set

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud instance)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/pin705/Rescue-Eats.git
cd Rescue-Eats
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/rescue-eats
NUXT_SESSION_PASSWORD=your-secret-password-at-least-32-characters-long
```

4. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🚀 Build & Deploy

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Generate Static Site
```bash
npm run generate
```

## 📱 PWA Features

The app is installable as a Progressive Web App:
- Offline support
- Add to home screen
- Fast loading with caching
- Native-like experience on mobile

## 🗄️ Database Models

### User
- Customer and Store accounts
- Email/password authentication
- Role-based access

### Store
- Store profile with location
- Approval status (pending/approved/rejected)
- Geospatial coordinates for proximity search

### Product
- Name, description, images
- Expiry date tracking
- Original/discounted pricing
- Auto-calculated discount percentage
- Quantity management

### Order
- Product reservations
- Unique voucher codes
- 24-hour expiration
- Product snapshot for historical data

## 🎨 Design Principles

- **Professional & Clean**: No childish or plastic design elements
- **Mobile-First**: Optimized for smartphone usage
- **Earth-Green Palette**: Environmental theme (#166534)
- **Line Icons**: Lucide icon set for modern, minimalist look
- **Accessible**: Clear typography and good contrast

## 🔐 Security

- Passwords hashed with bcrypt
- Session-based authentication
- Store approval workflow
- Input validation on all forms

## 📍 API Endpoints

### Authentication
- `POST /api/auth/register` - Register customer/store
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (store only)
- `PUT /api/products/:id` - Update product (store only)
- `DELETE /api/products/:id` - Archive product (store only)

### Orders
- `POST /api/orders` - Create reservation
- `GET /api/orders` - Get user's orders

## 🌍 Environmental Impact

Every reservation helps:
- Reduce food waste
- Save money for customers
- Recover revenue for stores
- Support sustainability

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ to fight food waste**
