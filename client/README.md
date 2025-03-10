# Chess Game

## Overview
This is a personal project that showcases a fully functional chess game using modern web technologies. The frontend is built with React, providing a dynamic and interactive user experience, while the backend is developed using PHP to handle the game's logic and API requests. This project serves as a demonstration of my skills in full-stack web development and is intended to be part of my professional portfolio.

## Features
- **Interactive Chessboard**: A visually appealing chessboard built with `react-chessboard` that allows users to move pieces with drag-and-drop functionality.
- **Game Logic**: The game logic is managed using `chess.js`, ensuring all moves are validated and the game state is accurately maintained.
- **Backend API**: A simple PHP-based API to handle game states and interactions.
- **Cross-Origin Support**: Configured CORS to allow seamless interaction between the React frontend and PHP backend.

## Technologies Used
### Frontend
- **React**: A JavaScript library for building user interfaces.
- **react-chessboard**: A React component for rendering the chessboard.
- **chess.js**: A library for chess game logic.

### Backend
- **PHP**: A server-side scripting language for API development.
- **Composer**: A dependency manager for PHP.

### Others
- **Node.js & npm**: For managing frontend dependencies and running the development server.
- **Apache**: A web server to host the PHP backend.

## Setup and Installation

### Prerequisites
Ensure you have the following installed:
- Node.js and npm
- PHP and Composer
- A web server like Apache or Nginx

### Steps

#### Clone the Repository

bash
git clone https://github.com/your-username/chess-game.git
cd chess-game 

### Frontend Setup
 - cd frontend
 - npm install
 - npm start

### Backend Setup

- cd backend
- composer install

Ensure your web server is configured to serve the backend API. Place the backend directory in your web server's root directory. For example, if using Apache, move the backend directory to /var/www/html/chess-api.

### Usage

- Access the frontend at http://localhost:3000.
- The backend API should be accessible at http://localhost/chess-api.

### Future Enhancements
 - Implement user authentication and multiplayer support.
 - Add AI opponent using a chess engine.
 - Enhance the UI with animations and additional features.

### Contributing
Feel free to fork this repository and submit pull requests. Any contributions, whether it's bug fixes, enhancements, or new features, are welcome!

### License
This project is open-source and available under the MIT License. See the LICENSE file for more details.
