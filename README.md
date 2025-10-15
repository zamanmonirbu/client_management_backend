## Client Management Backend

A robust **Node.js** backend API built with **Express.js**, **TypeScript**, **Prisma ORM**, and **MySQL** for the client management CRUD application. Features comprehensive authentication, modular architecture with separation of concerns, and helper functions for maintainable code.

### Live Demo
- **Backend API**: [https://client-management-backend-eg3d.onrender.com/](https://client-management-backend-eg3d.onrender.com/)
- **Frontend**: [https://client-management-frontend-phi.vercel.app/](https://client-management-frontend-phi.vercel.app/)
- **Login Credentials**:
  - Email: `monir.cse6.bu@gmail.com`
  - Password: `monir.cse6.bu@gmail.com`

*⚠️ Note: First load may take ~1 minute due to Render's cold start. Subsequent requests are fast.*

### Technologies Used
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **ORM**: Prisma ORM (MySQL)
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod for request validation
- **Database**: MySQL
- **Architecture**: Modular pattern with separation of concerns
- **Deployment**: Render
- **Documentation**: Postman
- **Testing**: Jest, Supertest

### Features
- **Full CRUD API** for client management
- **Complete Authentication System** (JWT, Refresh tokens)
- **Pagination** support for all list endpoints
- **CSV Export** endpoint for bulk data download
- **Input Validation** with Zod schemas
- **Error Handling** with global middleware
- **Protected Routes** with role-based access
- **API Documentation** ready structure
- **Performance Optimized** with Prisma query optimization
- **CORS Support** for frontend integration
- **Modular Architecture** with helper functions


### Quick Start

#### Prerequisites
- Node.js 18+
- MySQL / MariaDB database
- npm
- Git

#### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/zamanmonirbu/client_management_backend.git
   cd client_management_backend
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   Update `.env` with your database credentials:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   ALLOWED_ORIGIN=http://localhost:3000

   # Database (Prisma)
   DATABASE_URL="mysql://username:password@host:port/database"

   # JWT
   JWT_SECRET=your_super_secure_jwt_secret_here
   REFRESH_SECRET=your_refresh_token_secret_here
   ACCESS_TOKEN_EXPIRE=15m
   REFRESH_TOKEN_EXPIRE=7d
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # Seed database (optional)
   npx prisma db seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```
   API will be available at [http://localhost:5000](http://localhost:5000)

#### Build for Production
```bash
npm run build
npm start
```

### Development Scripts
- `npm run dev` - Start with nodemon (development)
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Testing

#### Testing Strategy
- **Unit Tests**: Services, utilities, and helper functions
- **Integration Tests**: API endpoints with database

#### Testing Tools
- **Jest**: Test runner and assertions
- **Supertest**: HTTP assertion library
- **Prisma Test Utils**: Database testing utilities
- **Zod**: Schema validation testing

#### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run specific test
npm test -- controllers/client.controller.test.ts

# Test with database (requires test DB setup)
npm run test:integration
```

#### Test Database Setup
```bash
# Create test database
npx prisma db push --schema=./tests/prisma/schema.prisma

# Run migration for test DB
npx prisma migrate deploy --schema=./tests/prisma/schema.prisma
```

### API Endpoints

#### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/refresh` - Refresh access token
- `POST /api/v1/users/logout` - User logout

#### Clients (Protected)
- `GET /api/v1/clients` - Get clients with pagination
- `GET /api/v1/clients/:id` - Get single client
- `POST /api/v1/clients` - Create new client
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client

#### Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://client-management-backend-eg3d.onrender.com/api/v1`

### Security Features
- **JWT Authentication** with refresh tokens
- **Input Validation** using Zod schemas
- **Rate Limiting** middleware
- **CORS Protection** with allowed origins
- **Helmet** for security headers
- **Environment Variables** for secrets
- **Error Handling** middleware
- **Request Logging** for debugging

### Architecture Patterns
- **Modular Design**: Controllers, Services, Middleware separation
- **Separation of Concerns**: Each layer has single responsibility
- **Helper Functions**: Reusable utilities for common operations
- **TypeScript**: Full type safety throughout
- **Dependency Injection**: Services injected into controllers
- **Error Handling**: Centralized error management
- **Logging**: Structured logging for monitoring

### Database Setup

#### Using Railway (Production)
The production database uses Railway MySQL. Connection string format:
```
mysql://username:password@host:port/database
```

#### Local Development
1. Install MySQL/MariaDB locally
2. Create database: `client_management`
3. Update `DATABASE_URL` in `.env`
4. Run migrations: `npx prisma migrate dev`

#### Prisma Commands
```bash
# Generate client
npx prisma generate

# Database push (schema sync)
npx prisma db push

# Create migration
npx prisma migrate dev --name feature_name

# Studio (GUI)
npx prisma studio

# Seed data
npx prisma db seed
```

### Deployment
#### CI/CD
- This project includes a CI/CD pipeline using GitHub Actions for Continuous Integration and Render for Continuous Deployment. The pipeline runs linting, builds, and tests on pushes and pull requests, and (when green) automatically deploys to Render.
- Current Status:

⚠️ Important: CI/CD configuration is present in the repository; however, the latest code includes a new test feature that is currently causing CI failures.
To keep the public demo stable, the Render deployment is currently pointing to a specific stable commit (a commit made before the test feature and CI changes). Once the test suite is stabilized, the Render service will be switched to the latest main branch and CI will fully manage deployments.

#### Render (Current)
- **Service**: Web Service on Render
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Set in Render dashboard

#### Environment Variables for Production
```env
NODE_ENV=production
PORT=10000  # Render assigns this
DATABASE_URL=your_production_db_url
JWT_SECRET=super_secure_production_secret
REFRESH_SECRET=super_secure_refresh_secret
ALLOWED_ORIGIN=https:frontend-domain.com
```

### Code Quality
- **TypeScript** strict mode enabled
- **ESLint** with Airbnb rules
- **Prettier** for consistent formatting
- **Modular helper functions** for DRY code
- **Comprehensive error handling**
- **Input sanitization** and validation

### 📄 License
This project is for demonstration purposes and follows the company's coding test requirements.

### 🔗 Related Projects
- **Frontend**: [https://github.com/zamanmonirbu/client_management_frontend](https://github.com/zamanmonirbu/client_management_frontend)
- **Design Reference**: [Figma Design](https://www.figma.com/design/xrb43ILns2cArgkRnW1t2k/Test)

### 🙏 Acknowledgments
- Built for **Software Engineer (Node.js)** position coding test
- Special thanks to the recruitment team for the opportunity
- Design specifications provided by the company

---

⭐ **Star this repository if you found it helpful!**

---

*Built with by Moniruzzaman*   
*For coding test submission - Software Engineer (Node.js) and (React.js)*