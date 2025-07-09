# 🏪 Salon Payroll Management System

Complete payroll management system for salon businesses with advanced commission tracking, KPI monitoring, and comprehensive reporting.

## ✨ Features

- 👥 **Employee Management** - Complete employee profiles with groups and levels
- 💰 **Advanced Payroll Calculation** - Multi-tier commission structure
- 📊 **KPI Tracking** - Service-specific KPI monitoring with penalties
- 📈 **Daily Commission Tracking** - Real-time commission calculation
- 📋 **Comprehensive Reports** - Charts, analytics, and export functionality
- 🔐 **Authentication** - Secure login with role-based access
- 🗄️ **Database Integration** - PostgreSQL with Prisma ORM
- 🐳 **Docker Support** - Easy deployment with Docker
- ☁️ **Cloud Ready** - Deploy to Vercel, Netlify, or any cloud platform

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd salon-payroll-system

# Run automatic setup
npm run setup
\`\`\`

### Option 2: Manual Setup
\`\`\`bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
\`\`\`

### Option 3: Docker
\`\`\`bash
# Start with Docker Compose
docker-compose up -d

# Access the application
open http://localhost:3000
\`\`\`

## 🗄️ Database Setup

### PostgreSQL (Recommended)
\`\`\`bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Create database
createdb salon_payroll

# Update .env file
DATABASE_URL="postgresql://salon_user:salon_password@localhost:5432/salon_payroll"
\`\`\`

### SQLite (Development)
\`\`\`bash
# For development only
DATABASE_URL="file:./dev.db"
\`\`\`

## 🔧 Configuration

### Environment Variables
\`\`\`env
# Database
DATABASE_URL="postgresql://salon_user:salon_password@localhost:5432/salon_payroll"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Optional: Email, File Upload, etc.
\`\`\`

### System Settings
Access admin panel to configure:
- Company information
- Tax rates
- Commission structures
- KPI requirements

## 📱 Usage

### Default Login
- **Email**: admin@salon.com
- **Password**: admin123

### Employee Groups
1. **THỢ PHỤ** - Assistant stylists with facial/product commissions
2. **THỢ CHÍNH** - Main stylists with cutting/coloring commissions  
3. **NAIL** - Nail technicians with design-based commissions
4. **RELAX** - Massage/spa therapists

### Commission Structure
- **Level-based rates** - Higher levels = higher commission %
- **Service-specific** - Different rates for different services
- **KPI penalties** - 2% penalty for not meeting KPIs (4% for new employees)

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm run deploy:vercel
\`\`\`

### Netlify
\`\`\`bash
npm run deploy:netlify
\`\`\`

### Docker Production
\`\`\`bash
docker build -t salon-payroll .
docker run -p 3000:3000 salon-payroll
\`\`\`

### VPS/Server
\`\`\`bash
npm run build
npm start
\`\`\`

## 🛠️ Development

### Available Scripts
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
npm run db:seed      # Seed database
\`\`\`

### Project Structure
\`\`\`
salon-payroll-system/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── components/     # React components
│   ├── types/          # TypeScript types
│   └── page.tsx        # Main page
├── lib/                # Utility libraries
├── prisma/             # Database schema and migrations
├── scripts/            # Deployment and utility scripts
├── docker-compose.yml  # Docker configuration
└── README.md
\`\`\`

## 📊 Features Overview

### Employee Management
- Create/edit employee profiles
- Assign to groups (THỢ PHỤ, THỢ CHÍNH, NAIL, RELAX)
- Set basic salary and allowances
- Track employment status

### Payroll Calculation
- Automatic level calculation based on revenue
- Multi-tier commission structure
- KPI-based bonuses and penalties
- Advance and deduction tracking

### Daily Commission Tracking
- Real-time service entry
- Commission calculation per service
- Revenue tracking before/after discounts
- Export capabilities

### Reporting & Analytics
- Monthly payroll reports
- Top performer rankings
- Revenue analytics
- KPI achievement tracking
- Export to Excel/PDF

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- SQL injection protection with Prisma
- CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@salon.com
- 💬 Discord: [Join our community](https://discord.gg/salon)
- 📖 Documentation: [docs.salon.com](https://docs.salon.com)

## 🙏 Acknowledgments

- Built with Next.js, Prisma, and Tailwind CSS
- UI components from Radix UI
- Charts powered by Recharts
- Icons by Lucide React

---

Made with ❤️ for salon businesses
