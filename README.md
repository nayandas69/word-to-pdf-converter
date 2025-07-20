# Word to PDF Converter

A modern, full-stack web application that converts Word documents (.doc, .docx) to PDF format with a beautiful user interface and robust backend processing.

## Features

- [x] Fast and reliable Word to PDF conversion
- [x] Drag and drop file upload interface
- [x] Real-time conversion progress tracking
- [x] Automatic file download after conversion
- [x] Responsive design for all devices
- [x] Secure file handling with automatic cleanup
- [x] Support for both .doc and .docx formats
- [x] File size validation (up to 10MB)
- [x] Modern UI with smooth animations
- [x] Toast notifications for user feedback
- [x] Rate limiting for API protection
- [x] CORS and security middleware
- [ ] Batch file conversion (planned)
- [ ] User authentication (planned)
- [ ] Conversion history (planned)

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful toast notifications
- **React Icons** - Comprehensive icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Multer** - Middleware for handling file uploads
- **Mammoth** - Library for extracting text from Word documents
- **PDF-lib** - Library for creating PDF documents
- **Helmet** - Security middleware for Express
- **CORS** - Cross-Origin Resource Sharing middleware
- **Express Rate Limit** - Rate limiting middleware

## Prerequisites

> [!IMPORTANT]
> Ensure you have the following installed on your system:

- **Node.js**: v22.17.0 or higher
- **npm**: v10.9.2 or higher

You can check your versions by running:
```bash
node -v
npm -v
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nayandas69/word-to-pdf-converter.git
cd word-to-pdf-converter
```

### 2. Install Dependencies

Install dependencies for all packages (root, backend, and frontend):

```bash
npm run install-deps
```

This command will:
- Install root dependencies
- Install backend dependencies
- Install frontend dependencies

### 3. Environment Configuration

The backend uses environment variables for configuration. The default `.env` file is already configured for development:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.doc,.docx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> [!NOTE]
> For production deployment, update the `FRONTEND_URL` to match your deployed frontend URL.

## Development

### Start Development Servers

Run both frontend and backend development servers concurrently:

```bash
npm run dev
```

This will start:
- **Backend server**: http://localhost:3000
- **Frontend server**: http://localhost:5173

### Individual Server Commands

Start only the backend server:
```bash
npm run server
```

Start only the frontend client:
```bash
npm run client
```

## API Endpoints

### Health Check
```http
GET /api/health
```
Returns the API health status and version information.

### Convert Document
```http
POST /api/convert
```

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the Word document

**Response:**
- Success: PDF file download
- Error: JSON error message

**Example using curl:**
```bash
curl -X POST \
  http://localhost:3000/api/convert \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/document.docx'
```

## Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service (Netlify, Vercel, etc.)

### Backend Deployment to Vercel

> [!IMPORTANT]
> Vercel supports Node.js serverless functions. The backend is configured for Vercel deployment.

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   cd backend
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.com`
   - `MAX_FILE_SIZE=10485760`
   - `ALLOWED_FILE_TYPES=.doc,.docx`

> [!CAUTION]
> When deploying to Vercel, be aware of the following limitations:
> - Serverless functions have a 10-second execution timeout
> - File uploads are limited to 4.5MB for Hobby plan
> - Temporary file storage is limited in serverless environment

### Alternative Backend Deployment Options

For better file handling capabilities, consider these alternatives:

- **Railway**: Supports persistent storage and longer execution times
- **Render**: Free tier with good Node.js support
- **Heroku**: Reliable platform with file system support
- **DigitalOcean App Platform**: Scalable with persistent storage

## Security Features

- [x] **Helmet.js** - Sets various HTTP headers for security
- [x] **CORS** - Configured for specific frontend origin
- [x] **Rate Limiting** - Prevents API abuse
- [x] **File Validation** - Validates file type, size, and content
- [x] **Automatic Cleanup** - Removes uploaded files after processing
- [x] **Input Sanitization** - Validates and sanitizes all inputs

## Error Handling

The application includes comprehensive error handling:

### Backend Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Codes
- `UPLOAD_ERROR` - File upload failed
- `VALIDATION_ERROR` - File validation failed
- `CONVERSION_ERROR` - PDF conversion failed
- `FILE_TOO_LARGE` - File exceeds size limit
- `INVALID_FILE_TYPE` - Unsupported file format

## Performance Optimizations

- [x] **File Size Limits** - Prevents large file uploads
- [x] **Automatic Cleanup** - Removes temporary files
- [x] **Rate Limiting** - Prevents server overload
- [x] **Optimized Builds** - Minified production builds
- [x] **Lazy Loading** - Components loaded on demand
- [x] **Image Optimization** - Optimized assets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/nayandas69/word-to-pdf-converter/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer: [Nayan Das](https://github.com/nayandas69)

## Acknowledgments

- [docx-pdf](https://www.npmjs.com/package/docx-pdf) - Core conversion library
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Express.js](https://expressjs.com/) - Backend framework

---

**Made with 💔 by [Nayan Das](https://github.com/nayandas69)**
