# ⚡ Quick Start Guide - Rescue Eats

Get Rescue Eats running on your machine in 5 minutes!

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ MongoDB running (local or MongoDB Atlas account)

## Step 1: Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/pin705/Rescue-Eats.git
cd Rescue-Eats

# Install dependencies
npm install
```

## Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/rescue-eats

# OR for MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rescue-eats

# Generate a secure password (must be 32+ characters)
NUXT_SESSION_PASSWORD=your-very-secure-random-password-min-32-chars
```

💡 **Tip:** Generate secure password with: `openssl rand -base64 32`

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

🎉 **Visit http://localhost:3000**

## Step 4: Test the Application (1 minute)

### Register as Customer
1. Click "Sign Up"
2. Choose "Customer"
3. Fill in details
4. Login automatically

### Register as Store
1. Click "Sign Up"  
2. Choose "Store"
3. Fill in store details
4. Note: Account will be "Pending" approval

### Approve Store (MongoDB)
```bash
# Connect to MongoDB
mongosh rescue-eats

# Find pending store
db.stores.find({ status: 'pending' })

# Approve the store
db.stores.updateOne(
  { status: 'pending' },
  { $set: { status: 'approved', approvedAt: new Date() } }
)
```

### Add a Product (as Store)
1. Login as approved store
2. Click "Add New Product"
3. Fill in product details:
   - Product name
   - Category
   - Image URL (use any public image URL)
   - Expiry date (pick a future date)
   - Quantity
   - Original price: 100000 (VND)
   - Discounted price: 50000 (VND)
4. Submit

### Browse & Reserve (as Customer)
1. Logout from store
2. Login as customer (or browse without login)
3. See products on homepage
4. Click on a product
5. Click "Reserve & Get Voucher"
6. Go to "My Orders" to see voucher code

## 🎯 You're All Set!

The application is now running with:
- ✅ Customer account
- ✅ Store account (approved)
- ✅ Sample product
- ✅ Reservation system working

## Next Steps

### For Development
- Read `DEVELOPMENT.md` for detailed guides
- Explore the codebase
- Add more features

### For Production
- Read `DEPLOYMENT.md` for deployment options
- Set up MongoDB Atlas (recommended)
- Deploy to Vercel/Netlify

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Start MongoDB
mongod
# OR use MongoDB Atlas cloud database
```

### Port 3000 Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .nuxt .output
npm install
```

## 📚 Documentation

- **README.md** - Project overview and features
- **DEVELOPMENT.md** - Development guide
- **DEPLOYMENT.md** - Production deployment
- **SUMMARY.md** - Complete implementation details

## 🆘 Need Help?

1. Check documentation files
2. Review code comments
3. Open an issue on GitHub

---

**Happy coding! 🚀**

Built with ❤️ to fight food waste
