# RoadMap Generator - Project Index

## 📋 Project Overview

**RoadMap Generator** is a full-stack web application that helps users create personalized learning pathways for various technologies. The application uses AI (Google Gemini) to generate structured learning roadmaps and provides an interactive interface for users to track their progress through these pathways.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React.js with Bootstrap, Material-UI, D3.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini API
- **Styling**: CSS3, Tailwind CSS, Bootstrap

### Project Structure
```
RoadMap_Generator/
├── backend/                 # Node.js/Express server
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   └── server.js          # Main server file
├── frontend/              # React.js application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── assets/       # Images and animations
│   │   └── pages/        # Page components
│   └── package.json
└── package.json          # Root dependencies
```

## 🔧 Backend Components

### Server Configuration (`backend/server.js`)
- **Port**: 5000 (configurable via environment variables)
- **CORS**: Configured for localhost:3000
- **Database**: MongoDB connection with error handling
- **Middleware**: JSON parsing, CORS, authentication

### Authentication System
- **JWT-based authentication** with bcrypt password hashing
- **Routes**:
  - `POST /api/signup` - User registration
  - `POST /api/login` - User login
  - `GET /api/user` - Get user profile (protected)

### Database Models

#### User Model (`backend/models/User.js`)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  pathways: [ObjectId] // Reference to courses
}
```

#### Course Model (`backend/models/Course.js`)
```javascript
{
  userId: ObjectId (ref: User),
  technology: String,
  pathway: [{
    name: String, // Section name
    children: [{
      name: String, // Step name
      quiz: {
        question: String,
        options: [String],
        correctAnswer: String
      }
    }]
  }],
  progress: Number (0-100),
  completedSteps: [String] // Array of step IDs
}
```

#### Pathway Model (`backend/models/Pathway.js`)
```javascript
{
  userId: ObjectId (ref: User),
  technology: String,
  pathway: Array,
  progress: String,
  timestamps: true
}
```

### API Routes

#### Pathway Routes (`backend/routes/pathwayRoutes.js`)
- **AI Integration**: Uses Google Gemini API to generate learning pathways
- **Endpoint**: `POST /api/pathways/generate`
- **Functionality**: 
  - Accepts technology name
  - Generates structured learning pathway
  - Returns hierarchical pathway data

#### Course Routes (`backend/routes/courseRoutes.js`)
- **CRUD Operations** for user courses:
  - `POST /api/courses/save` - Save new pathway
  - `GET /api/courses/` - Get user's courses
  - `GET /api/courses/:id` - Get specific course
  - `PUT /api/courses/:pathwayId` - Update pathway
  - `DELETE /api/courses/:pathwayId` - Delete pathway
  - `PUT /api/courses/:pathwayId/progress` - Update progress

### Authentication Middleware (`backend/middleware/auth.js`)
- **JWT Verification**: Validates Bearer tokens
- **User Context**: Adds user data to request object
- **Error Handling**: Proper error responses for invalid tokens

## 🎨 Frontend Components

### Main Application (`frontend/src/App.js`)
- **Routing**: React Router with protected routes
- **State Management**: Local state for technology, pathway, and authentication
- **Navigation**: Conditional navbar based on authentication status

### Core Components

#### Authentication Components

**Login Component** (`frontend/src/components/Login.js`)
- **Features**:
  - Email/password authentication
  - JWT token storage in localStorage
  - Animated background with mouse tracking
  - Form validation and error handling
  - Success/error notifications
- **Styling**: Custom CSS with gradient animations

**SignUp Component** (`frontend/src/components/SignUp.js`)
- **Features**:
  - User registration with name, email, password
  - Form validation
  - Success/error handling
  - Responsive design with animations

#### Dashboard Component (`frontend/src/components/Dashboard.js`)
- **Features**:
  - Displays user's saved courses
  - Progress visualization with circular progress bars
  - Color-coded progress indicators
  - Course deletion functionality
  - Navigation to individual courses
- **Styling**: Bootstrap cards with custom CSS

#### Pathway Visualization (`frontend/src/components/PathwayGraph.js`)
- **Technology**: D3.js for interactive tree visualization
- **Features**:
  - Hierarchical tree structure display
  - Zoom and pan functionality
  - Responsive design
  - Node styling with different colors for sections/steps
- **Data Structure**: Accepts pathway object with nested children

#### Course Pathway (`frontend/src/components/CoursePathway.js`)
- **Features**:
  - Interactive step-by-step learning interface
  - Progress tracking with visual indicators
  - Step completion functionality
  - Quiz integration for each step
  - Real-time progress updates
- **Styling**: Custom CSS with animations

#### Quiz Component (`frontend/src/components/Quiz.js`)
- **Features**:
  - AI-generated quizzes using Google Gemini API
  - Multiple choice questions
  - Score tracking
  - Progress indicators
  - Answer review functionality
  - Quiz restart capability
- **Integration**: Connects with course pathway progress

#### Navigation (`frontend/src/components/Navbar.js`)
- **Features**:
  - Responsive navigation bar
  - User dropdown menu
  - Logout functionality
  - Active route highlighting
  - Logo integration

#### Contact Form (`frontend/src/components/ContactUS.js`)
- **Features**:
  - Contact form with validation
  - Responsive design
  - Bootstrap styling
  - Email icon integration

### Styling and Assets
- **CSS Files**: Component-specific styling
- **Animations**: Lottie animations for login/signup
- **Icons**: FontAwesome and Lucide React icons
- **Responsive Design**: Bootstrap grid system

## 🔄 Data Flow

### Pathway Generation Flow
1. User enters technology name in frontend
2. Frontend sends POST request to `/api/pathways/generate`
3. Backend calls Google Gemini API with structured prompt
4. AI generates learning pathway
5. Backend parses and structures the response
6. Frontend receives pathway data and displays it using D3.js

### Course Management Flow
1. User saves generated pathway
2. Frontend sends course data to `/api/courses/save`
3. Backend creates new course document in MongoDB
4. User can view courses in dashboard
5. Progress updates are synced between frontend and backend

### Authentication Flow
1. User registers/logs in
2. Backend validates credentials and generates JWT
3. Frontend stores token in localStorage
4. Token is sent with subsequent API requests
5. Backend middleware validates token for protected routes

## 🚀 Key Features

### AI-Powered Learning Pathways
- **Dynamic Generation**: Real-time pathway creation using Google Gemini
- **Structured Learning**: Hierarchical organization of learning steps
- **Technology Agnostic**: Works with any technology or skill

### Interactive Learning Experience
- **Progress Tracking**: Visual progress indicators and completion status
- **Step-by-Step Navigation**: Interactive course progression
- **Quiz Integration**: AI-generated quizzes for knowledge assessment

### User Management
- **Secure Authentication**: JWT-based user sessions
- **Personal Dashboard**: User-specific course management
- **Progress Persistence**: Database storage of learning progress

### Modern UI/UX
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Visualizations**: D3.js-powered pathway graphs
- **Smooth Animations**: CSS transitions and Lottie animations
- **Intuitive Navigation**: Clear user flow and interface

## 🔧 Environment Setup

### Required Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/roadmap_generator
JWT_SECRET=your_jwt_secret_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

### Installation Steps
1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database**: Ensure MongoDB is running locally or update MONGO_URI

## 📊 API Endpoints Summary

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/user` - Get user profile (protected)

### Pathways
- `POST /api/pathways/generate` - Generate AI-powered learning pathway

### Courses
- `POST /api/courses/save` - Save new course (protected)
- `GET /api/courses/` - Get user's courses (protected)
- `GET /api/courses/:id` - Get specific course (protected)
- `PUT /api/courses/:id` - Update course (protected)
- `DELETE /api/courses/:id` - Delete course (protected)
- `PUT /api/courses/:id/progress` - Update progress (protected)

## 🎯 Future Enhancements

### Potential Improvements
1. **Social Features**: Course sharing and collaboration
2. **Advanced Analytics**: Detailed learning analytics and insights
3. **Content Management**: User-generated content and course creation
4. **Mobile App**: Native mobile application
5. **Offline Support**: Progressive Web App capabilities
6. **Advanced Quizzes**: More complex assessment types
7. **Learning Recommendations**: AI-powered course suggestions

### Technical Improvements
1. **Performance**: Caching and optimization
2. **Security**: Enhanced authentication and authorization
3. **Testing**: Comprehensive test coverage
4. **Documentation**: API documentation and user guides
5. **Deployment**: CI/CD pipeline and production deployment

## 📝 Development Notes

### Code Organization
- **Modular Structure**: Clear separation of concerns
- **Component Reusability**: Shared components and utilities
- **Error Handling**: Comprehensive error handling throughout
- **Code Comments**: Well-documented code with clear explanations

### Best Practices
- **Security**: JWT authentication, password hashing
- **Performance**: Efficient database queries, optimized rendering
- **Accessibility**: Semantic HTML, keyboard navigation
- **Responsive Design**: Mobile-first approach

This project demonstrates a modern full-stack application with AI integration, providing an engaging learning experience for users to master new technologies through structured, interactive pathways. 