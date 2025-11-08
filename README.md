# Pizza Pantry - Inventory Management System

A modern, full-stack inventory management web application built for pizza shops. Users can manage inventory items, track stock levels, adjust quantities, and view detailed audit trails of all changes.

## 🚀 Features

### Core Functionality
- **Authentication**: Secure user authentication via Clerk
- **Inventory Management**: Full CRUD operations for inventory items
- **Quantity Adjustments**: Add or remove stock with reason tracking
- **Audit Trail**: Complete history of all inventory changes
- **Search & Filter**: Search by name, filter by category, sort by multiple fields
- **Low Stock Alerts**: Visual indicators for items below reorder threshold
- **Responsive Design**: Mobile-friendly, accessible UI

### Technical Highlights
- **Server-side & Client-side Validation**: Zod schemas for robust data validation
- **Real-time Updates**: Optimistic UI updates with proper error handling
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Type Safety**: Full TypeScript implementation
- **Clean Architecture**: Feature-based folder structure, reusable components

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

- Node.js 20.9.0 or higher (recommended)
- MongoDB (local or Atlas)
- Clerk account (free tier available)

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pizza-pantry
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory (use `env.example` as reference):

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB
MONGDB_URI=mongodb://localhost:27017/pizza-pantry
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pizza-pantry

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Getting Clerk Credentials:

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key from the API Keys section
4. Paste them into your `.env.local` file

#### MongoDB Setup:

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string and add to `.env.local`

### 4. Seed the Database (Optional)

Populate the database with sample inventory data:

```bash
npm run seed
```

This creates 12 sample items across different categories (Dairy, Meats, Vegetables, etc.)

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Sign Up / Sign In

Create an account using Clerk's authentication flow. You'll be redirected to the inventory dashboard.

## 📁 Project Structure

```
pizza-pantry/
├── app/
│   ├── (dashboard)/          # Main inventory page
│   │   └── page.tsx
│   ├── api/                  # API routes
│   │   ├── items/           # Item CRUD endpoints
│   │   └── categories/      # Categories endpoint
│   ├── sign-in/             # Clerk sign-in page
│   ├── sign-up/             # Clerk sign-up page
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Global styles
├── components/
│   ├── inventory/           # Inventory-specific components
│   │   ├── item-form.tsx
│   │   └── adjust-quantity-dialog.tsx
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ...
├── lib/
│   ├── mongodb.ts           # Database connection
│   ├── validations.ts       # Zod schemas
│   └── utils.ts             # Utility functions
├── models/
│   ├── Item.ts              # Item model
│   └── AuditLog.ts          # Audit log model
├── scripts/
│   └── seed.ts              # Database seeding script
├── middleware.ts            # Clerk authentication middleware
└── env.example              # Environment variables template
```

## 🏗️ Architecture & Design Decisions

### Data Model

**Item Schema:**
- `name`: String (required, unique)
- `category`: String (required)
- `unit`: String (required, e.g., kg, liters, units)
- `quantity`: Number (min: 0)
- `reorderThreshold`: Number (min: 0)
- `costPrice`: Number (min: 0)
- `createdBy`: String (Clerk user ID)
- `createdAt`, `updatedAt`: Timestamps

**AuditLog Schema:**
- `itemId`: Reference to Item
- `itemName`: String (denormalized for history)
- `action`: Enum (create, update, delete, quantity_adjust)
- `userId`: String (Clerk user ID)
- `userName`: String
- `changes`: Object (field, oldValue, newValue, delta, reason)
- `timestamp`: Date

### API Design

- **RESTful endpoints** with proper HTTP methods
- **Server-side validation** using Zod schemas
- **Authentication checks** on all routes via Clerk middleware
- **Error handling** with descriptive messages
- **Pagination support** for large datasets

### Security

- All API routes protected by Clerk authentication
- Server-side input validation prevents injection attacks
- MongoDB connection pooling for performance
- Environment variables for sensitive data
- CSRF protection via Next.js

### Performance

- Database indexes on frequently queried fields
- Optimistic UI updates for better UX
- Efficient query patterns (lean queries, field selection)
- Connection caching to prevent connection exhaustion

### Accessibility

- Semantic HTML elements
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management in dialogs
- Screen reader friendly

## 🧪 Testing

While automated tests are not included in this version, the application is structured for easy testing:

**Suggested test coverage:**
- API route handlers (unit tests)
- Validation schemas (unit tests)
- Form components (integration tests)
- E2E user flows (Playwright/Cypress)

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Environment Variables for Production

Ensure all variables from `.env.local` are set in your deployment platform.

## 📝 API Endpoints

### Items
- `GET /api/items` - List items (with search, filter, sort)
- `POST /api/items` - Create item
- `GET /api/items/[id]` - Get single item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item
- `POST /api/items/[id]/adjust` - Adjust quantity
- `GET /api/items/[id]/audit` - Get audit logs

### Categories
- `GET /api/categories` - Get all unique categories

## 🎯 Future Enhancements

### Planned Features
- **Role-based access control** (Admin vs Staff)
- **Export functionality** (CSV, PDF reports)
- **Barcode scanning** for quick item lookup
- **Automated reorder notifications** (email/SMS)
- **Dashboard analytics** (charts, trends)
- **Multi-location support** for chain stores
- **Recipe management** with ingredient tracking
- **Supplier management** and purchase orders

### Technical Improvements
- Unit and integration tests
- E2E testing with Playwright
- Performance monitoring (Sentry, LogRocket)
- Caching layer (Redis)
- Real-time updates (WebSockets)
- Offline support (PWA)

## 🐛 Known Limitations

1. **Single tenant**: No multi-organization support
2. **No image uploads**: Items don't have photos
3. **Basic reporting**: Limited analytics and insights
4. **No bulk operations**: Can't update multiple items at once
5. **Simple search**: No advanced filtering or full-text search

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built as part of a technical assessment for demonstrating full-stack development skills.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for seamless authentication
- Radix UI for accessible components
- Vercel for hosting platform
