# Blog Application

A modern blog application built with React and Material-UI that allows users to create, read, update, and delete blog posts, as well as manage their profiles.
Frontend Livelink: https://effortless-dolphin-5b618c.netlify.app/

## Features

- 🔐 User Authentication (Login/Register)
- 👤 Profile Management
  - Edit profile information
  - Update avatar
  - Add bio
- 📝 Blog Posts
  - Create new posts
  - Read posts from other users
  - Update own posts
  - Delete own posts
  - Add tags to posts
- 💬 Social Features
  - Like posts
  - Comment on posts
  - View post author profiles
- 🎨 Modern UI with Material-UI
- 📱 Responsive Design

## Tech Stack

- React.js
- Material-UI (MUI)
- Axios for API calls
- React Router for navigation
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
REACT_APP_API_URL=https://login-8elt.vercel.app
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will open in your default browser at `http://localhost:3000`.

## Project Structure

```
src/
├── components/        # Reusable components
├── contexts/         # Context providers
├── pages/           # Page components
├── App.js           # Main app component
└── index.js         # Entry point
```

## API Integration

The application integrates with a RESTful API with the following endpoints:

- `/api/auth/login` - User login
- `/api/auth/signup` - User registration
- `/api/auth/profile` - Get/Update user profile
- `/api/posts` - CRUD operations for blog posts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the beautiful components
- React team for the amazing framework
- All contributors who have helped with the project
