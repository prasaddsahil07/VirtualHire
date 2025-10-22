# VirtualHire Backend API

A robust Node.js backend API for VirtualHire - a mock interview platform connecting candidates with industry professionals for interview practice.

## 🚀 Features

### Authentication & Authorization
- **JWT-based Authentication** with access and refresh tokens
- **Role-based Access Control** (Candidate, Interviewer, Admin)
- **Password Hashing** with bcrypt
- **Cookie-based Token Management** for security
- **Email Verification** system
- **Password Recovery** functionality

### User Management
- **Multi-role User System** with different permissions
- **Profile Management** for candidates and interviewers
- **User Verification** system for interviewers
- **Admin User Management** with approval workflows

### Interview Management
- **Slot Creation & Management** for interviewers
- **Booking System** for candidates
- **Payment Integration** (Razorpay ready)
- **Reschedule Management** with approval workflows
- **Interview Feedback** system
- **Rating System** for both candidates and interviewers

### Platform Features
- **Email Notifications** for bookings and updates
- **Admin Dashboard** with analytics
- **Verification System** for interviewer credentials
- **Payment Processing** with platform fee calculation
- **Interview Archiving** for completed sessions

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie management

## 📁 Project Structure

```
backend/
├── controllers/           # Request handlers
│   ├── user.controller.js
│   ├── candidate.controller.js
│   ├── interviewer.controller.js
│   ├── approvalRequest.controller.js
│   ├── booking.controller.js
│   ├── slot.controller.js
│   ├── reschedule.controller.js
│   └── payment.controller.js
├── middleware/            # Custom middleware
│   └── auth.middleware.js
├── models/               # Database schemas
│   ├── user.model.js
│   ├── candidate.model.js
│   ├── interviewer.model.js
│   ├── approvalRequest.model.js
│   ├── booking.model.js
│   ├── slot.model.js
│   ├── reschedule.model.js
│   └── payment.model.js
├── routes/               # API routes
│   ├── user.route.js
│   ├── candidate.route.js
│   ├── interviewer.route.js
│   └── approvalRequest.route.js
├── utils/               # Utility functions
│   └── mailer.js
├── db/                  # Database connection
│   └── connectDB.js
├── constants.js         # Application constants
└── index.js            # Main server file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VirtualHire/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/virtualhire
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_SECRET_EXPIRY=15m
   REFRESH_TOKEN_SECRET_EXPIRY=7d
   
   # Server Configuration
   PORT=8000
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   
   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Razorpay Configuration (for payments)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:8000
   # Should return: {"message": "Welcome to InCruiter API"}
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### User Registration
```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate", // or "recruiter", "admin"
  "gender": "male" // or "female", "other"
}
```

#### User Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### User Logout
```http
POST /users/logout
Authorization: Bearer <access_token>
```

#### Refresh Token
```http
POST /users/refresh-token
```

### Candidate Endpoints

#### Complete Profile
```http
POST /candidates/complete-profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "resumeUrl": "https://drive.google.com/file/...",
  "skills": ["React", "Node.js", "JavaScript"],
  "experience": 2
}
```

#### Get Matching Interviewers
```http
GET /candidates/get-matching-interviewers
Authorization: Bearer <access_token>
```

### Interviewer Endpoints

#### Complete Profile
```http
POST /interviewers/complete-profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "bio": "Experienced software engineer...",
  "companies": ["Google", "Microsoft"],
  "expertise": ["Frontend Development", "React"],
  "experience": 5,
  "linkedinProfile": "https://linkedin.com/in/...",
  "employeeMailId": "john@company.com"
}
```

#### Request Verification
```http
POST /approval-requests/request-verification/:userId
Authorization: Bearer <access_token>
```

### Admin Endpoints

#### Get All Candidates
```http
GET /candidates/get-all
Authorization: Bearer <access_token>
```

#### Get All Interviewers
```http
GET /interviewers/get-all
Authorization: Bearer <access_token>
```

#### Get Approval Requests
```http
GET /approval-requests/get-all
Authorization: Bearer <access_token>
```

#### Approve Request
```http
POST /approval-requests/approve/:requestId
Authorization: Bearer <access_token>
```

#### Reject Request
```http
POST /approval-requests/reject/:requestId
Authorization: Bearer <access_token>
```

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiry**: Configurable token expiration
- **Refresh Tokens**: Secure token refresh mechanism

### Authorization
- **Role-based Access**: Different permissions for each role
- **Route Protection**: Middleware-based route protection
- **Admin Verification**: Secure admin-only operations

### Data Security
- **Input Validation**: Request data validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **CORS Configuration**: Secure cross-origin requests
- **Cookie Security**: HttpOnly, Secure, SameSite cookies

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['candidate', 'recruiter', 'admin'],
  gender: Enum ['male', 'female', 'other'],
  avatarUrl: String,
  emailVerified: Boolean,
  refreshToken: String,
  recoveryCode: Number,
  recoveryCodeExpiry: Date
}
```

### Candidate Model
```javascript
{
  userId: ObjectId (ref: User),
  resumeUrl: String,
  skills: [String],
  experience: Number,
  razorpayCustomerId: String
}
```

### Interviewer Model
```javascript
{
  userId: ObjectId (ref: User),
  bio: String,
  companies: [String],
  expertise: [String],
  experience: Number,
  rating: Number,
  totalBalance: Number,
  verificationStatus: Enum ['pending', 'verified', 'rejected'],
  linkedinProfile: String,
  employeeMailId: String,
  razorpayRecipientId: String,
  payoutsEnabled: Boolean,
  meetLink: String
}
```

### Slot Model
```javascript
{
  interviewerId: ObjectId (ref: Interviewer),
  scheduledDate: Date,
  startTime: String,
  duration: Number,
  status: Enum ['available', 'booked', 'completed', 'cancelled'],
  price: Number,
  feedback: String,
  rating: Number,
  meetLink: String
}
```

### Booking Model
```javascript
{
  slotId: ObjectId (ref: Slot),
  interviewerId: ObjectId (ref: Interviewer),
  candidateId: ObjectId (ref: Candidate),
  bookingDate: Date,
  scheduledStartTime: String,
  status: Enum ['pending', 'confirmed', 'cancelled', 'rescheduled', 'completed'],
  price: Number,
  currency: String,
  paymentId: ObjectId (ref: Payment)
}
```

## 🔧 Environment Variables

### Required Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/virtualhire

# JWT Configuration
ACCESS_TOKEN_SECRET=your_32_character_secret
REFRESH_TOKEN_SECRET=your_32_character_secret
ACCESS_TOKEN_SECRET_EXPIRY=15m
REFRESH_TOKEN_SECRET_EXPIRY=7d

# Server
PORT=8000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Set up email service (Gmail SMTP)
4. Configure Razorpay for payments
5. Set up SSL certificates for HTTPS

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 🧪 Testing

### API Testing with Postman
1. Import the API collection
2. Set up environment variables
3. Run the test suite

### Manual Testing
```bash
# Test server health
curl http://localhost:8000

# Test user registration
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"candidate","gender":"male"}'
```

## 📈 Performance Optimization

### Database Optimization
- **Indexing**: Strategic database indexes
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized MongoDB queries

### Caching Strategy
- **Token Caching**: JWT token optimization
- **Database Caching**: Frequently accessed data
- **Response Caching**: API response caching

## 🔍 Monitoring & Logging

### Logging
- **Request Logging**: All API requests logged
- **Error Logging**: Comprehensive error tracking
- **Authentication Logging**: Security event logging

### Health Checks
- **Database Health**: MongoDB connection status
- **Service Health**: API endpoint health checks
- **Performance Metrics**: Response time monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@virtualhire.com or create an issue in the repository.

## 🔮 Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Advanced analytics dashboard
- [ ] Video call integration
- [ ] AI-powered interview feedback
- [ ] Mobile app API
- [ ] Advanced payment methods
- [ ] Interview recording features
- [ ] Automated scheduling system

---

**VirtualHire Backend** - Powering the future of interview preparation with robust, scalable APIs.
