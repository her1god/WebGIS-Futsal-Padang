# Changelog - WebGIS Futsal Padang

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-10-25

### 🎉 Initial Release

#### ✨ Features Added
- **User Features:**
  - Interactive map with Leaflet.js showing futsal field locations
  - List of futsal fields with details (name, address, price, rating)
  - Nearby search using Haversine algorithm based on GPS location
  - Field detail page with complete information
  - Rating system (1-5 stars) and reviews
  - User authentication (login/register)

- **Admin Features:**
  - Admin dashboard for system management
  - CRUD operations for futsal fields
  - Rating moderation system
  - View all user reviews

- **Technical Features:**
  - MVC architecture pattern
  - RESTful API endpoints
  - MySQL database with connection pooling
  - Session-based authentication
  - Password hashing with bcrypt
  - Input validation and sanitization
  - Responsive design (mobile-friendly)
  - Security headers implementation

#### 🗂️ Files Created
- `app.js` - Main Express application
- `package.json` - Dependencies and scripts
- `.env` - Environment configuration
- `futsal_db.sql` - Database schema with sample data

**Controllers:**
- `controllers/userController.js` - User business logic
- `controllers/adminController.js` - Admin business logic

**Models:**
- `models/db.js` - Database connection
- `models/lapanganModel.js` - Database queries

**Routes:**
- `routes/userRoutes.js` - User endpoints
- `routes/adminRoutes.js` - Admin endpoints

**Views:**
- `views/index.ejs` - Homepage with map
- `views/login.ejs` - Login page
- `views/register.ejs` - Registration page
- `views/detailLapangan.ejs` - Field detail page
- `views/adminDashboard.ejs` - Admin dashboard

**Public Assets:**
- `public/css/style.css` - Complete styling
- `public/js/map.js` - Map logic and Haversine
- `public/js/admin.js` - Admin dashboard logic

**Utils:**
- `utils/haversine.js` - Haversine algorithm implementation

**Documentation:**
- `README.md` - Complete documentation
- `INSTALL.md` - Quick installation guide
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_SUMMARY.md` - Project summary

**Scripts:**
- `test-db.js` - Database connection test
- `start.sh` - Quick start for Linux/Mac
- `start.bat` - Quick start for Windows
- `generate_password.sh` - Password hash generator

#### 🔒 Security
- Implemented bcrypt password hashing (salt rounds: 10)
- Session-based authentication with HTTPOnly cookies
- Input validation on server and client side
- SQL injection prevention with prepared statements
- XSS protection with proper escaping
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- CSRF token ready (can be implemented)

#### 📊 Database
- Created `futsal_db` database
- Tables: `users`, `lapangan_futsal`, `rating`
- Sample data: 6 futsal fields in Padang City
- Default admin account (username: admin, password: admin123)
- Database view for average ratings

#### 🎨 Design
- Clean and modern UI with neutral colors (blue, white, gray)
- Responsive design (mobile-first approach)
- Intuitive navigation with navbar
- Consistent branding and layout
- Fast loading with optimized assets

#### 📐 Haversine Algorithm
- Accurate distance calculation between coordinates
- Integration with backend API
- Sort fields by nearest distance
- Display distance in kilometers
- Support for radius-based filtering

#### 🧪 Testing
- Database connection test script
- Manual testing checklist provided
- Sample data for testing

#### 📝 Code Quality
- Clean code principles applied
- Descriptive variable and function names
- Clear comments in critical functions
- Consistent indentation (2 spaces)
- No code duplication (DRY principle)
- Modular structure (separation of concerns)

#### 📦 Dependencies
**Production:**
- express@^4.18.2
- mysql2@^3.6.5
- bcrypt@^5.1.1
- ejs@^3.1.9
- dotenv@^16.3.1
- express-session@^1.17.3
- body-parser@^1.20.2

**Development:**
- nodemon@^3.0.2

#### 🚀 Deployment
- Deployment guide included
- Support for VPS/Cloud deployment
- Docker configuration example
- PM2 process manager setup
- Nginx reverse proxy configuration
- SSL setup with Let's Encrypt

#### 📚 Documentation
- Comprehensive README with installation steps
- Quick installation guide (INSTALL.md)
- Deployment guide (DEPLOYMENT.md)
- Project summary with completion status
- Inline code comments
- API endpoint documentation

---

## Upcoming Features (Future Versions)

### [1.1.0] - Planned
- [ ] Photo upload for futsal fields
- [ ] Filter fields by price range
- [ ] Filter fields by rating
- [ ] Advanced search functionality

### [1.2.0] - Planned
- [ ] Online booking system
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Booking history for users

### [1.3.0] - Planned
- [ ] SMS notifications (Twilio)
- [ ] Export data to Excel/PDF
- [ ] Analytics dashboard with charts
- [ ] Field availability calendar

### [2.0.0] - Future
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Social media integration

---

## Bug Fixes

### Known Issues in 1.0.0
1. **Geolocation accuracy** - May not be accurate in some browsers
   - Workaround: Use HTTPS for better accuracy
   
2. **Map loading speed** - Slower on poor internet connection
   - Planned fix: Implement caching and lazy loading

3. **Browser compatibility** - Some features may not work on IE11
   - Note: Modern browsers recommended (Chrome, Firefox, Edge, Safari)

---

## Versioning

We use [SemVer](http://semver.org/) for versioning:
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward compatible manner
- **PATCH** version for backward compatible bug fixes

---

## Contributors

- **Fairuz** - Initial development and documentation

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note:** This is a thesis/final project for academic purposes. The system is designed for educational use and can be extended for commercial purposes with proper modifications.
