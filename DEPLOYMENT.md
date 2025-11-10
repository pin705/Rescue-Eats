# Deployment Guide - Rescue Eats

## Prerequisites

1. **MongoDB Database**
   - Option A: Local MongoDB installation
   - Option B: MongoDB Atlas (Cloud) - Recommended for production
   
2. **Node.js Environment**
   - Node.js 18 or higher
   - npm or yarn package manager

## Environment Setup

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/rescue-eats
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/rescue-eats

# Session Security (MUST be at least 32 characters)
NUXT_SESSION_PASSWORD=your-very-secure-random-32-character-minimum-password-here
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add `MONGODB_URI` and `NUXT_SESSION_PASSWORD`

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Build and Deploy**
```bash
npm run build
netlify deploy --prod --dir=.output/public
```

3. **Configure Environment Variables**
   - In Netlify dashboard > Site settings > Environment variables
   - Add `MONGODB_URI` and `NUXT_SESSION_PASSWORD`

### Option 3: Traditional VPS/Server

1. **Build the application**
```bash
npm run build
```

2. **Install PM2 (Process Manager)**
```bash
npm install -g pm2
```

3. **Start the application**
```bash
pm2 start .output/server/index.mjs --name rescue-eats
```

4. **Setup Nginx as reverse proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 4: Docker

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

2. **Build and Run**
```bash
docker build -t rescue-eats .
docker run -p 3000:3000 -e MONGODB_URI=your-uri -e NUXT_SESSION_PASSWORD=your-password rescue-eats
```

## MongoDB Atlas Setup (Cloud Database)

1. **Create Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your users
   - Create cluster

3. **Create Database User**
   - Database Access > Add New User
   - Choose username and password
   - Grant read/write access

4. **Whitelist IP**
   - Network Access > Add IP Address
   - For development: 0.0.0.0/0 (allow from anywhere)
   - For production: Add specific IPs

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Post-Deployment Checklist

- [ ] Verify MongoDB connection is working
- [ ] Test user registration (customer)
- [ ] Test store registration
- [ ] Create a test store account and approve it manually in MongoDB:
  ```javascript
  // In MongoDB shell or Compass:
  db.stores.updateOne(
    { /* filter by store */ },
    { $set: { status: 'approved' } }
  )
  ```
- [ ] Test product creation
- [ ] Test product search
- [ ] Test reservation system
- [ ] Verify PWA installation on mobile
- [ ] Test location-based search
- [ ] Check mobile responsiveness

## Admin Operations

Since the MVP doesn't have an admin panel, use MongoDB directly:

### Approve a Store
```javascript
db.stores.updateOne(
  { _id: ObjectId("store_id_here") },
  { $set: { status: 'approved', approvedAt: new Date() } }
)
```

### View All Pending Stores
```javascript
db.stores.find({ status: 'pending' })
```

### Make a User Admin
```javascript
db.users.updateOne(
  { email: 'admin@example.com' },
  { $set: { role: 'admin' } }
)
```

## Monitoring & Maintenance

1. **Check Logs**
   - Vercel/Netlify: Check dashboard logs
   - PM2: `pm2 logs rescue-eats`

2. **Database Backups**
   - MongoDB Atlas: Automatic backups enabled
   - Self-hosted: Set up regular backups

3. **Update Dependencies**
```bash
npm update
npm audit fix
```

## Security Recommendations

1. **Always use HTTPS** in production
2. **Set strong session password** (32+ random characters)
3. **Regular security updates** for dependencies
4. **Monitor MongoDB access logs**
5. **Use environment variables** - never commit secrets
6. **Implement rate limiting** for production (not included in MVP)

## Troubleshooting

### MongoDB Connection Fails
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Check database user credentials

### Build Fails
- Clear `.nuxt` and `.output` directories
- Delete `node_modules` and run `npm install` again
- Check Node.js version (must be 18+)

### PWA Not Installing
- Ensure HTTPS is enabled
- Check service worker registration in browser DevTools
- Verify manifest.json is accessible

## Support

For issues or questions:
- Open an issue on GitHub
- Check MongoDB Atlas documentation
- Review Nuxt 4 documentation

---

**Good luck with your deployment! 🚀**
