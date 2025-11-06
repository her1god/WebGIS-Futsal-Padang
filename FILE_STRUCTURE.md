# 🌳 Struktur File Proyek - WebGIS Futsal Padang

```
webgis-futsal/
│
├── 📄 app.js                          # Main Express application server
├── 📄 package.json                    # Node.js dependencies & scripts
├── 📄 .env                            # Environment variables (DB config)
├── 📄 .gitignore                      # Git ignore rules
├── 📄 futsal_db.sql                   # MySQL database schema + sample data
│
├── 📂 controllers/                    # Business Logic Layer
│   ├── 📄 userController.js           # User features (login, register, rating)
│   └── 📄 adminController.js          # Admin features (CRUD, moderation)
│
├── 📂 models/                         # Data Access Layer
│   ├── 📄 db.js                       # MySQL connection pooling
│   └── 📄 lapanganModel.js            # Database queries (CRUD operations)
│
├── 📂 routes/                         # API Routes & Endpoints
│   ├── 📄 userRoutes.js               # User routes (/, /login, /register, etc)
│   └── 📄 adminRoutes.js              # Admin routes (/admin/dashboard, /admin/lapangan)
│
├── 📂 utils/                          # Helper Functions
│   └── 📄 haversine.js                # Haversine algorithm for distance calculation
│
├── 📂 views/                          # Frontend Templates (EJS)
│   ├── 📄 index.ejs                   # Homepage with interactive map
│   ├── 📄 login.ejs                   # User login page
│   ├── 📄 register.ejs                # User registration page
│   ├── 📄 detailLapangan.ejs          # Field detail page with rating form
│   └── 📄 adminDashboard.ejs          # Admin dashboard (CRUD & moderation)
│
├── 📂 public/                         # Static Assets (CSS, JS, Images)
│   ├── 📂 css/
│   │   └── 📄 style.css               # Complete styling (responsive design)
│   ├── 📂 js/
│   │   ├── 📄 map.js                  # Leaflet map integration & Haversine
│   │   └── 📄 admin.js                # Admin dashboard interactions
│   └── 📂 images/                     # Image assets folder (empty, ready to use)
│
├── 📂 Documentation Files/
│   ├── 📄 README.md                   # Complete project documentation
│   ├── 📄 INSTALL.md                  # Quick installation guide
│   ├── 📄 DEPLOYMENT.md               # Production deployment guide
│   ├── 📄 PROJECT_SUMMARY.md          # Project completion summary
│   ├── 📄 CHANGELOG.md                # Version history & updates
│   └── 📄 FILE_STRUCTURE.md           # This file - visual tree structure
│
└── 📂 Scripts/
    ├── 📄 test-db.js                  # Database connection test script
    ├── 📄 start.sh                    # Quick start for Linux/Mac
    ├── 📄 start.bat                   # Quick start for Windows
    └── 📄 generate_password.sh        # Password hash generator
```

---

## 📊 File Statistics

| Type | Count | Purpose |
|------|-------|---------|
| **JavaScript (.js)** | 9 | Backend logic & frontend interactions |
| **EJS Templates (.ejs)** | 5 | HTML views with dynamic data |
| **CSS (.css)** | 1 | Styling & responsive design |
| **SQL (.sql)** | 1 | Database schema & sample data |
| **JSON (.json)** | 1 | Package configuration |
| **Markdown (.md)** | 6 | Documentation files |
| **Config Files** | 2 | .env, .gitignore |
| **Shell Scripts** | 3 | Helper scripts |
| **Total Files** | 28 | Complete project |

---

## 🗂️ File Size & Lines of Code (Approximate)

| File | Lines | Description |
|------|-------|-------------|
| `app.js` | ~230 | Express server setup & middleware |
| `controllers/userController.js` | ~240 | User features implementation |
| `controllers/adminController.js` | ~180 | Admin features implementation |
| `models/lapanganModel.js` | ~250 | Database queries & models |
| `routes/userRoutes.js` | ~40 | User route definitions |
| `routes/adminRoutes.js` | ~30 | Admin route definitions |
| `utils/haversine.js` | ~90 | Haversine algorithm |
| `views/index.ejs` | ~90 | Homepage template |
| `views/detailLapangan.ejs` | ~200 | Detail page template |
| `views/adminDashboard.ejs` | ~200 | Admin dashboard template |
| `public/css/style.css` | ~800 | Complete styling |
| `public/js/map.js` | ~250 | Map logic & Haversine integration |
| `public/js/admin.js` | ~180 | Admin dashboard logic |
| `futsal_db.sql` | ~80 | Database schema |
| **Total LOC** | **~2,860** | Clean, well-commented code |

---

## 📁 Folder Purpose & Responsibilities

### 🎯 `/controllers/`
**Purpose:** Business logic layer
- Handles HTTP requests
- Processes data from models
- Returns responses to views
- Input validation
- Authentication checks

### 🗄️ `/models/`
**Purpose:** Data access layer
- Database connection management
- SQL queries (CRUD operations)
- Data validation
- Return formatted data to controllers

### 🛣️ `/routes/`
**Purpose:** URL routing
- Define API endpoints
- Map URLs to controller functions
- Apply middleware (authentication, authorization)
- RESTful API structure

### 🎨 `/views/`
**Purpose:** Presentation layer
- EJS templates for HTML rendering
- Dynamic content with data from controllers
- User interface components
- Form handling

### 🌐 `/public/`
**Purpose:** Static assets
- CSS for styling
- Client-side JavaScript
- Images and icons
- Accessible from browser

### 🔧 `/utils/`
**Purpose:** Helper functions
- Reusable utility functions
- Algorithm implementations
- Helper methods
- Independent of business logic

---

## 🔗 File Dependencies & Flow

```
┌─────────────┐
│   app.js    │ ◄── Main entry point
└──────┬──────┘
       │
       ├──► routes/userRoutes.js
       │      └──► controllers/userController.js
       │            └──► models/lapanganModel.js
       │                  └──► models/db.js
       │
       ├──► routes/adminRoutes.js
       │      └──► controllers/adminController.js
       │            └──► models/lapanganModel.js
       │
       └──► views/*.ejs
              └──► public/css/style.css
              └──► public/js/map.js
              └──► public/js/admin.js
```

---

## 🔐 Security Files

| File | Security Feature |
|------|-----------------|
| `.env` | Stores sensitive configuration (DB password, secrets) |
| `.gitignore` | Prevents sensitive files from being committed to Git |
| `controllers/*` | Input validation & sanitization |
| `models/*` | Prepared statements (SQL injection prevention) |
| `app.js` | Security headers, session configuration |

---

## 📚 Documentation Files

| File | Purpose | Target Audience |
|------|---------|-----------------|
| `README.md` | Complete documentation | All users |
| `INSTALL.md` | Quick installation | New users |
| `DEPLOYMENT.md` | Production deployment | DevOps/Admins |
| `PROJECT_SUMMARY.md` | Project overview | Reviewers/Clients |
| `CHANGELOG.md` | Version history | Developers |
| `FILE_STRUCTURE.md` | This file | Developers |

---

## 🎓 For Academic/Thesis Use

### Key Files to Present:
1. **Algorithm Implementation:** `utils/haversine.js`
2. **Database Design:** `futsal_db.sql`
3. **Backend Logic:** `controllers/*.js`, `models/*.js`
4. **Frontend Design:** `views/*.ejs`, `public/css/style.css`
5. **API Design:** `routes/*.js`

### Files to Explain in Documentation:
- Architecture: `app.js` (MVC pattern)
- Data Flow: controllers → models → database
- User Flow: routes → controllers → views
- Algorithm: Haversine implementation

---

## 🚀 Getting Started Files Priority

**For First-Time Setup:**
1. ✅ Read `INSTALL.md`
2. ✅ Configure `.env`
3. ✅ Import `futsal_db.sql`
4. ✅ Run `test-db.js`
5. ✅ Execute `start.sh` or `start.bat`

**For Development:**
1. ✅ Modify `controllers/*.js` for business logic
2. ✅ Update `views/*.ejs` for UI changes
3. ✅ Edit `public/css/style.css` for styling
4. ✅ Adjust `models/*.js` for database operations

**For Deployment:**
1. ✅ Follow `DEPLOYMENT.md`
2. ✅ Update `.env` with production values
3. ✅ Secure `app.js` configurations

---

## 🔄 File Modification Frequency

| File Type | Frequency | Reason |
|-----------|-----------|--------|
| `controllers/*.js` | High | Add new features |
| `views/*.ejs` | High | UI updates |
| `public/css/style.css` | Medium | Design changes |
| `public/js/*.js` | Medium | Frontend logic |
| `models/*.js` | Low | Database structure changes |
| `routes/*.js` | Low | New API endpoints |
| `app.js` | Very Low | Core configuration |
| `.env` | Very Low | Environment changes |

---

## 📦 Distribution Files

**For Source Code Distribution:**
- Include all files except:
  - `node_modules/` (install via `npm install`)
  - `.env` (user must configure)
  - Any generated logs

**For Production Deployment:**
- Include all files
- Exclude development dependencies
- Minify CSS/JS (optional)
- Optimize images (optional)

---

**Last Updated:** October 25, 2025  
**Project Version:** 1.0.0  
**Total Files:** 28  
**Total Lines of Code:** ~2,860  
**Documentation Coverage:** 100%  

---

✨ **Semua file telah dibuat dengan lengkap dan terstruktur!**
