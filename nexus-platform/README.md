# Nexus Workflow Management Platform

A modern, multi-tenant SaaS platform that transforms traditional Google Sheets-based task management into a scalable, professional web application with enterprise-grade features.

## 🚀 Features

### Multi-Tenant Architecture
- **Company Isolation**: Each company gets isolated environment with their own data
- **Subdomain Support**: Companies access via `{company-slug}.nexusworkflow.com`
- **Custom Branding**: Company-specific settings and configurations

### Dynamic Task Management
- **Flexible Categories**: Companies create their own task categories
- **Custom Frequencies**: Daily, weekly, monthly, custom intervals, or one-time tasks
- **Role-Based Assignment**: Dynamic user roles with granular permissions
- **Smart Notifications**: Real-time alerts for due tasks and overdue items

### Google Drive Integration
- **Auto-Folder Creation**: Dynamic folder structure based on users and categories
- **File Management**: Seamless file uploads with organized storage
- **Permission Management**: Secure access control for company data

### Professional UI/UX
- **Modern Design**: Clean, professional interface with subtle animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Sidebar Navigation**: Collapsible sidebar with role-based menu items

### Advanced Analytics
- **Performance Tracking**: Individual and team performance metrics
- **Real-time Dashboard**: Live updates on task status and completion
- **Export Capabilities**: Generate reports in various formats
- **Audit Logging**: Complete activity trail for compliance

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Next.js 14 (Full-stack framework)
- PostgreSQL (Primary database)
- Prisma ORM (Database management)
- Redis (Session & caching)
- Google APIs (Drive integration)

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS (Professional styling)
- Radix UI (Accessible components)
- React Query (Data fetching)
- Framer Motion (Animations)

**Infrastructure:**
- Docker (Containerization)
- NGINX (Reverse proxy)
- PM2 (Process management)

### Database Schema

The platform uses a multi-tenant database design with the following core entities:

- **Companies**: Tenant isolation and settings
- **Users**: Role-based user management
- **Roles**: Dynamic permission system
- **Categories**: Company-specific task categories
- **Tasks**: Flexible task definitions
- **TaskSubmissions**: File uploads and tracking
- **AuditLogs**: Security and compliance

## 🚦 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+
- Google Cloud Console project (for Drive integration)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexus-platform
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose (Recommended)**
   ```bash
   # Start all services
   docker-compose -f docker-compose.dev.yml up

   # Start with Prisma Studio
   docker-compose -f docker-compose.dev.yml --profile studio up
   ```

4. **Manual Setup (Alternative)**
   ```bash
   # Install dependencies
   npm install

   # Start PostgreSQL and Redis locally
   # Configure DATABASE_URL and REDIS_URL in .env

   # Run database migrations
   npm run db:migrate

   # Seed initial data
   npm run db:seed

   # Start development server
   npm run dev
   ```

5. **Access the application**
   - Main app: http://localhost:3000
   - Prisma Studio: http://localhost:5555 (if started with studio profile)

### Production Deployment

1. **Environment Setup**
   ```bash
   # Copy and configure production environment
   cp .env.example .env.production
   # Configure all production values
   ```

2. **Deploy with Docker Compose**
   ```bash
   # Basic deployment
   docker-compose -f docker-compose.prod.yml up -d

   # With monitoring
   docker-compose -f docker-compose.prod.yml --profile monitoring up -d

   # With backup service
   docker-compose -f docker-compose.prod.yml --profile backup up -d
   ```

3. **SSL Configuration**
   - Place SSL certificates in `docker/nginx/ssl/`
   - Update nginx configuration for your domain
   - Configure DNS to point to your server

## 🔧 Configuration

### Google Drive Integration

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google Drive API

2. **Create OAuth 2.0 Credentials**
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `{YOUR_DOMAIN}/api/auth/callback/google`

3. **Configure Environment Variables**
   ```bash
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   GOOGLE_REDIRECT_URI="https://yourdomain.com/api/auth/callback/google"
   ```

### Database Configuration

The platform supports PostgreSQL with the following configuration options:

```bash
# Development
DATABASE_URL="postgresql://nexus_user:nexus_password@localhost:5432/nexus_dev"

# Production (with connection pooling)
DATABASE_URL="postgresql://nexus_user:nexus_password@localhost:5432/nexus_prod?connection_limit=10&pool_timeout=20"
```

### Authentication Setup

```bash
# Generate a secure secret (required)
NEXTAUTH_SECRET="your-very-secure-secret-key-here"

# Set correct URL for your deployment
NEXTAUTH_URL="https://yourdomain.com"
```

## 📊 Company Setup Process

### For Platform Administrators

1. **Create Company Account**
   ```bash
   # Use the admin interface or API to create companies
   POST /api/admin/companies
   {
     "name": "Company Name",
     "slug": "company-slug",
     "email": "admin@company.com"
   }
   ```

2. **Google Drive Integration**
   - Company admin connects their Google Drive account
   - System automatically creates folder structure
   - Users are assigned individual folders

3. **User Management**
   - Admin creates user accounts with roles
   - Users receive login credentials
   - Role-based access controls take effect

### For Company Administrators

1. **Initial Setup**
   - Sign in with provided credentials
   - Connect Google Drive account
   - Configure company settings

2. **User Management**
   - Add team members with appropriate roles
   - Set up custom categories for your workflow
   - Define task templates and frequencies

3. **Workflow Configuration**
   - Create task categories (e.g., Marketing, Development, Sales)
   - Set up recurring tasks with custom intervals
   - Configure notification preferences

## 🔐 Security Features

### Multi-Tenant Security
- **Data Isolation**: Complete separation between companies
- **Row-Level Security**: Database-level tenant isolation
- **API Security**: Tenant validation on all endpoints

### Authentication & Authorization
- **JWT-based Authentication**: Secure session management
- **Role-Based Access Control**: Granular permission system
- **Password Security**: Bcrypt hashing with secure defaults

### Data Protection
- **Encryption**: Data encrypted at rest and in transit
- **Audit Logging**: Complete activity trail
- **GDPR Compliance**: Data export and deletion capabilities

## 📈 Monitoring & Analytics

### Built-in Analytics
- Task completion rates
- User performance metrics
- Team productivity insights
- Custom date range reports

### Production Monitoring
- Prometheus metrics collection
- Grafana dashboards
- Real-time system health
- Automated alerting

## 🚀 Deployment Options

### Local Development
Perfect for development and testing:
- Hot reloading
- Debug mode enabled
- Mock external services
- Prisma Studio included

### Single Server Production
Suitable for small to medium companies:
- Docker Compose deployment
- NGINX reverse proxy
- SSL termination
- Automated backups

### Kubernetes/Cloud
For enterprise deployments:
- Horizontal auto-scaling
- Load balancing
- High availability
- Cloud provider integration

## 🛠️ Development

### Project Structure
```
nexus-platform/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── auth/             # Authentication pages
│   └── api/              # API routes
├── components/           # React components
│   ├── ui/               # Base UI components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utilities and configuration
├── prisma/               # Database schema and migrations
├── docker/               # Docker configuration
└── docs/                 # Documentation
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Run migrations
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database

# Docker
npm run docker:dev     # Start development with Docker
npm run docker:prod    # Start production with Docker

# Code Quality
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub issues
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact support at support@nexusworkflow.com

## 🌟 Roadmap

### Phase 1 (Current)
- ✅ Multi-tenant architecture
- ✅ Google Drive integration
- ✅ Task management system
- ✅ Professional UI/UX

### Phase 2 (Next Quarter)
- 📱 Mobile app (React Native)
- 🔗 API integrations (Slack, Teams)
- 📊 Advanced analytics
- 🤖 AI-powered task suggestions

### Phase 3 (Future)
- 🌐 Multi-language support
- 📧 Email campaign integration
- 🔄 Workflow automation
- 📈 Business intelligence tools

---

**Built with ❤️ by the Nexus Team**