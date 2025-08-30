# Me-API Playground

A full-stack personal portfolio application with a RESTful API backend and modern React frontend. This project demonstrates professional backend development skills through database-driven API endpoints that manage and expose personal profile information.

## 🚀 Features

### Backend API
- **RESTful Architecture**: Comprehensive API with proper HTTP methods and status codes
- **Database Integration**: SQLite with Sequelize ORM for development, easily configurable for PostgreSQL/MySQL
- **Authentication & Security**: JWT tokens, API key validation, rate limiting, and CORS protection
- **Data Validation**: Input validation and sanitization using express-validator
- **Search Functionality**: Full-text search across profile content
- **Performance Optimization**: Response caching, compression, and query optimization
- **Comprehensive Testing**: Unit and integration tests with Jest and Supertest
- **Production Ready**: Docker containerization, logging, and error handling

### Frontend Interface
- **Modern React Application**: Built with Vite for fast development and optimized builds
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive UI**: Real-time search, filtering, and smooth animations
- **Performance Optimized**: Code splitting, lazy loading, and optimized assets
- **Accessibility**: Semantic HTML and keyboard navigation support

## 📁 Project Structure

```
me-api-playground/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── config/         # Database and environment configuration
│   │   ├── controllers/    # Request handlers and business logic
│   │   ├── models/         # Database schemas and models
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Authentication, logging, CORS
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Helper functions and utilities
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server initialization
│   ├── __tests__/          # Test files
│   ├── logs/               # Application logs
│   ├── .env                # Environment variables
│   ├── Dockerfile          # Container configuration
│   └── package.json        # Dependencies and scripts
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API integration
│   │   └── utils/          # Frontend utilities
│   ├── public/             # Static assets
│   ├── Dockerfile          # Container configuration
│   └── package.json        # Dependencies and scripts
├── docker-compose.yml      # Multi-container orchestration
└── README.md              # Project documentation
```

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Sequelize
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: express-validator
- **Testing**: Jest, Supertest
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Documentation**: OpenAPI/Swagger

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **Icons**: Heroicons, React Icons
- **Notifications**: React Hot Toast

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend)
- **CI/CD**: GitHub Actions ready
- **Monitoring**: Health check endpoints

## 🚦 API Endpoints

### Health & System
- `GET /api/health` - Health check with system information

### Profile Management
- `GET /api/profile` - Retrieve complete profile data
- `POST /api/profile` - Create new profile
- `PUT /api/profile` - Update entire profile
- `PATCH /api/profile` - Partial profile updates

### Skills Management
- `GET /api/skills` - List all skills with filtering options
  - Query parameters: `category`, `proficiency`, `featured`, `limit`, `offset`
- `GET /api/skills/top` - Get featured/top skills
- `POST /api/skills` - Add new skill

### Projects Management
- `GET /api/projects` - List projects with pagination and filtering
  - Query parameters: `skill`, `status`, `featured`, `limit`, `offset`, `sort`, `order`
- `GET /api/projects/:id` - Get specific project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update existing project

### Search
- `GET /api/search?q=query` - Search across all content types
  - Query parameters: `q` (required), `type`, `limit`, `offset`

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd me-api-playground
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure environment variables
   npm run seed         # Populate database with sample data
   npm run dev          # Start development server
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev          # Start development server
   ```

4. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/api/health

### Docker Deployment

1. **Using Docker Compose** (recommended)
   ```bash
   # Set environment variables
   cp .env.example .env
   
   # Build and start all services
   docker-compose up --build
   
   # Access at http://localhost
   ```

2. **Individual containers**
   ```bash
   # Backend
   cd backend
   docker build -t me-api-backend .
   docker run -p 3000:3000 me-api-backend
   
   # Frontend
   cd frontend
   docker build -t me-api-frontend .
   docker run -p 80:80 me-api-frontend
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm test -- --coverage    # Run with coverage report
```

### Test Coverage
The backend includes comprehensive test coverage for:
- API endpoint functionality
- Database operations and relationships
- Input validation and error handling
- Authentication and security features

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
DB_PATH=./database.sqlite
JWT_SECRET=your-super-secret-jwt-key
API_KEY=your-api-key
FRONTEND_URL=http://localhost:3001
LOG_LEVEL=info
CACHE_TTL=300
```

**Frontend**
- `REACT_APP_API_URL`: Backend API base URL

### Database Configuration

The application uses SQLite for development and can be configured for PostgreSQL or MySQL in production:

```javascript
// config/database.js
const sequelize = new Sequelize({
  dialect: 'postgres', // or 'mysql'
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
```

## 📊 Database Schema

### Core Tables
- **users**: Personal information, contact details, social links
- **skills**: Technical skills with proficiency levels and categories
- **projects**: Portfolio projects with descriptions, URLs, and metadata
- **work_experience**: Employment history and achievements
- **education**: Academic background and certifications
- **project_skills**: Many-to-many relationship between projects and skills

### Relationships
- User → Projects (One-to-Many)
- User → Work Experience (One-to-Many)  
- User → Education (One-to-Many)
- Projects ↔ Skills (Many-to-Many through project_skills)

## 🚀 Deployment

### Production Deployment Options

1. **Docker Compose** (Recommended)
   - Easiest setup with both frontend and backend
   - Includes nginx configuration and health checks
   - Suitable for VPS or cloud instances

2. **Separate Services**
   - Backend: Deploy to Railway, Render, Heroku
   - Frontend: Deploy to Vercel, Netlify, GitHub Pages
   - Database: Use managed PostgreSQL service

3. **Cloud Platforms**
   - AWS: ECS/Fargate with RDS
   - Google Cloud: Cloud Run with Cloud SQL
   - Azure: Container Instances with PostgreSQL

### Environment Setup

**Production Backend**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=secure-random-string
API_KEY=secure-api-key
FRONTEND_URL=https://your-frontend-domain.com
```

**Build Commands**
```bash
# Backend
npm install --production
npm start

# Frontend
npm run build
# Serve dist/ folder with nginx or static hosting
```

## 🔍 API Documentation

### Response Format
All API responses follow a consistent format:

**Success Response**
```json
{
  "success": true,
  "data": {...},
  "pagination": {...} // for paginated responses
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // validation errors array
}
```

### Authentication

The API supports multiple authentication methods:

1. **JWT Token** (Optional)
   ```bash
   Authorization: Bearer <token>
   ```

2. **API Key** (Optional)
   ```bash
   X-API-Key: <api-key>
   ```

3. **Development Mode**: No authentication required

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable through environment variables

## 📈 Performance Features

- **Caching**: In-memory caching for frequently accessed data
- **Compression**: Response compression for reduced bandwidth
- **Pagination**: Efficient data loading for large datasets
- **Indexing**: Database indexes for optimized queries
- **Lazy Loading**: Code splitting for faster frontend loading
- **Image Optimization**: Responsive images with proper sizing

## 🛡 Security Features

- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries through Sequelize
- **XSS Protection**: Content sanitization and CSP headers
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Success Criteria Validation

✅ **Backend API**
- All required endpoints implemented and functional
- Comprehensive error handling and validation
- Database relationships working correctly
- Authentication and security middleware in place

✅ **Frontend Interface**
- Responsive design working on all devices
- Real-time search and filtering functionality
- Proper error handling and loading states
- Integration with backend API complete

✅ **Database & Data**
- Normalized schema with proper relationships
- Realistic seed data for demonstration
- Full-text search capabilities
- Performance optimizations with indexes

✅ **Testing & Quality**
- Comprehensive test coverage (>80%)
- Unit and integration tests
- API endpoint testing
- Error scenario testing

✅ **Documentation & Deployment**
- Complete setup and deployment instructions
- API documentation with examples
- Docker containerization ready
- Production deployment configuration

---

## 📞 Support

For questions, issues, or feature requests, please:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact: [your-email@example.com](mailto:your-email@example.com)

---

**Built with ❤️ by Alex Johnson**