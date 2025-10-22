# VirtualHire Frontend

A modern React.js frontend for VirtualHire - a mock interview platform where candidates can practice interviews with industry professionals.

## 🚀 Features

### Authentication & User Management
- **Multi-role Registration**: Support for Candidates, Interviewers, and Admin
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Profile Management**: Complete profile setup for candidates and interviewers
- **Role-based Access Control**: Different dashboards based on user roles

### Candidate Features
- **Profile Completion**: Skills, experience, and resume upload
- **Interviewer Discovery**: Browse and filter interviewers by skills, experience, and companies
- **Slot Booking**: Book available interview slots with payment integration
- **Interview Management**: View booked interviews and manage reschedules
- **Rating System**: Rate interviewers after completed sessions

### Interviewer Features
- **Profile Setup**: Professional background, expertise, and company information
- **Verification System**: Admin approval for interviewer profiles
- **Slot Management**: Create, edit, and manage interview time slots
- **Earnings Tracking**: View earnings and payment history
- **Candidate Feedback**: Provide feedback to candidates after interviews

### Admin Features
- **User Management**: View and manage all candidates and interviewers
- **Verification System**: Approve or reject interviewer verification requests
- **Platform Analytics**: Overview of platform usage and statistics

### UI/UX Features
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Fully responsive across all device sizes
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Loading States**: Proper loading indicators and error handling
- **Form Validation**: Client-side validation with Zod schemas

## 🛠️ Tech Stack

- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Cards/          # Card components
│   ├── Forms/          # Form components
│   ├── Modals/         # Modal components
│   └── Shared/         # Shared components
├── context/            # State management
│   ├── authStore.js    # Authentication state
│   └── themeStore.js   # Theme state
├── pages/              # Page components
│   ├── candidate/      # Candidate-specific pages
│   ├── interviewer/    # Interviewer-specific pages
│   ├── admin/          # Admin-specific pages
│   └── auth/           # Authentication pages
├── services/           # API services
│   └── api.js         # API client configuration
├── utils/             # Utility functions
├── App.jsx            # Main app component
└── main.jsx          # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VirtualHire/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=VirtualHire
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray**: Various shades for text and backgrounds

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Sizes**: Responsive scale from 12px to 48px

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Consistent styling with validation states
- **Modals**: Centered with backdrop blur

## 🔐 Authentication Flow

1. **Registration**: Users register with role selection
2. **Profile Completion**: Candidates and interviewers complete profiles
3. **Verification**: Interviewers request admin verification
4. **Dashboard Access**: Role-based dashboard access

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔌 API Integration

The frontend integrates with the backend API through:

- **Authentication**: JWT tokens with refresh mechanism
- **User Management**: CRUD operations for user profiles
- **Slot Management**: Create, read, update, delete slots
- **Booking System**: Payment integration and booking management
- **Admin Functions**: User verification and platform management

## 🎯 Key Features Implemented

### ✅ Completed
- [x] User authentication and registration
- [x] Role-based dashboards
- [x] Profile completion for all user types
- [x] Interviewer discovery and filtering
- [x] Slot booking with dummy payment
- [x] Admin verification system
- [x] Responsive design
- [x] Dark/light theme toggle
- [x] Form validation
- [x] Loading states and error handling

### 🚧 Future Enhancements
- [ ] Real Razorpay integration
- [ ] Email notifications
- [ ] Video call integration
- [ ] Advanced filtering options
- [ ] Interview scheduling calendar
- [ ] Real-time notifications
- [ ] Mobile app development

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

---

**VirtualHire** - Connecting candidates with industry professionals for better interview preparation.