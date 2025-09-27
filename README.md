# File Server Admin Dashboard

A modern, responsive admin dashboard built with Next.js, TypeScript, and Tailwind CSS for managing a file server with games, tags, and users.

## Features

- 🔐 **Admin Authentication** - Secure login system
- 🎮 **Games Management** - Create, read, and update games and software
- 🏷️ **Tags Management** - Manage additional tags for categorization
- 👥 **User Management** - View users and manage subscriptions
- 📊 **Dashboard Analytics** - Overview of system statistics
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Clean, minimalist design with smooth interactions

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Authentication:** Cookie-based sessions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running file server API on `http://localhost:9000`

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd file_server_admin
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login

- **Username:** admin
- **Password:** admin

## API Endpoints

The application connects to the following API endpoints:

- `POST /auth/login` - Admin authentication
- `GET /admin/games/game` - Get all games
- `POST /admin/games/game` - Create new game
- `PUT /admin/games/game` - Update existing game
- `GET /admin/games/additional_tags` - Get all tags
- `POST /admin/games/additional_tags` - Create new tag
- `DELETE /admin/games/additional_tags` - Delete tag
- `GET /admin/user` - Get all users
- `PUT /admin/user/set_subscription` - Update user subscription

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   │   ├── games/         # Games management
│   │   ├── tags/          # Tags management
│   │   └── users/         # User management
│   ├── login/             # Login page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Games/            # Game-related components
│   └── Layout/           # Layout components
├── context/              # React context providers
├── lib/                  # Utility functions and types
│   ├── api.ts           # API client
│   └── types.ts         # TypeScript types
└── public/              # Static assets
```

## Features Overview

### Dashboard

- System statistics overview
- Quick action buttons
- Responsive cards layout

### Games Management

- Create and edit games/software
- Image upload support
- Tag assignment
- Search and filter functionality
- Grid view with responsive cards

### Tags Management

- Create and delete additional tags
- Search functionality
- Real-time updates
- Usage statistics

### User Management

- View all registered users
- Toggle subscription status
- User statistics
- Search and filter users
- Subscription analytics

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file for environment-specific configurations:

```env
# For local development on the same machine
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000

# For mobile testing - replace with your actual local IP address
# NEXT_PUBLIC_API_BASE_URL=http://192.168.1.100:9000
```

### Mobile Testing Setup

If you want to test the application on a mobile device, you need to:

1. **Find your local IP address:**

   ```bash
   # On macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # On Windows
   ipconfig | findstr "IPv4"
   ```

2. **Create/update `.env.local` file:**

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://YOUR_IP_ADDRESS:9000
   ```

   Replace `YOUR_IP_ADDRESS` with your actual local IP (e.g., `192.168.1.100`)

3. **Make sure your API server accepts connections from other devices:**

   - Your file server API needs to be configured to accept connections from `0.0.0.0:9000` instead of just `localhost:9000`
   - Check your API server configuration and update it if needed

4. **Restart the Next.js development server:**

   ```bash
   npm run dev
   ```

5. **Access the app from your mobile device:**
   - Open your mobile browser
   - Navigate to `http://YOUR_IP_ADDRESS:3000`

### Troubleshooting Mobile Access

If you still can't access the API from mobile:

1. **Check firewall settings** - Make sure ports 3000 and 9000 are not blocked
2. **Verify API server binding** - Your API server must listen on `0.0.0.0:9000`, not `localhost:9000`
3. **Network connectivity** - Ensure your mobile device is on the same network as your development machine
4. **CORS configuration** - Your API server may need CORS headers for cross-origin requests

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
# file_admin
