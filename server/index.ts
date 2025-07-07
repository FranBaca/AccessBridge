import express, { Application, Request, Response, RequestHandler, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Data file path
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize submissions file if it doesn't exist
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
}

// JWT secret (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory session storage (could be moved to database later)
const sessions = new Map<string, Session>();

// Types
interface UserSubmission {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  areaOfInterest: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Authentication interfaces
interface Session {
  sessionId: string;
  userId: string;
  email: string;
  approvedAt: string;
  expiresAt: string;
}

interface MagicLinkToken {
  userId: string;
  email: string;
  type: 'magic_link';
  expiresAt: string;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: Session;
    }
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Helper function to read submissions
const readSubmissions = (): UserSubmission[] => {
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading submissions file:', error);
    return [];
  }
};

// Helper function to write submissions
const writeSubmissions = (submissions: UserSubmission[]): void => {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
  } catch (error) {
    console.error('Error writing submissions file:', error);
    throw error;
  }
};

// Authentication helper functions
const generateMagicLinkToken = (userId: string, email: string): string => {
  const payload: MagicLinkToken = {
    userId,
    email,
    type: 'magic_link',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

const verifyMagicLinkToken = (token: string): MagicLinkToken | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as MagicLinkToken;
  } catch (error) {
    return null;
  }
};

const createSession = (userId: string, email: string): string => {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  sessions.set(sessionId, {
    sessionId,
    userId,
    email,
    approvedAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString()
  });
  
  return sessionId;
};

// Authentication middleware
const authenticateSession = (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.cookies.accessbridge_session;
  
  if (!sessionId) {
    return res.status(401).json({ success: false, message: 'No session found' });
  }
  
  const session = sessions.get(sessionId);
  if (!session || new Date(session.expiresAt) < new Date()) {
    return res.status(401).json({ success: false, message: 'Session expired' });
  }
  
  req.user = session;
  next();
};

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to AccessBridge API' });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API endpoint to submit user interest
app.post('/api/interest', (req: Request, res: Response): any => {
  try {
    const { name, email, phoneNumber, areaOfInterest } = req.body;

    // Validation
    if (!name || !email || !phoneNumber || !areaOfInterest) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, phoneNumber, areaOfInterest'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Argentine phone number validation
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Argentine phone number patterns:
    // +54 9 11 1234-5678 (mobile with country code)
    // +54 11 1234-5678 (landline with country code)
    // 9 11 1234-5678 (mobile without country code)
    // 11 1234-5678 (landline without country code)
    const argentinePhoneRegex = /^(\+54\s?)?(9\s?)?(1[1-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\s?[0-9]{4}\s?[0-9]{4}$/;
    
    if (!argentinePhoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresa un número de teléfono argentino válido (ej: 9 11 1234-5678 o 11 1234-5678)'
      });
    }

    // Create new submission
    const newSubmission: UserSubmission = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: cleanPhone,
      areaOfInterest: areaOfInterest.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    // Read existing submissions
    const submissions = readSubmissions();

    // Check for duplicate email
    const existingSubmission = submissions.find(sub => sub.email === newSubmission.email);
    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: 'A submission with this email already exists'
      });
    }

    // Add new submission
    submissions.push(newSubmission);

    // Save to file
    writeSubmissions(submissions);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Your interest has been submitted successfully! We will review your application and get back to you soon.',
      submissionId: newSubmission.id
    });

  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// API endpoint to get all submissions (for admin use)
app.get('/api/admin/submissions', (req: Request, res: Response) => {
  try {
    const submissions = readSubmissions();
    res.json({
      success: true,
      data: submissions,
      count: submissions.length
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API endpoint to approve a user
app.post('/api/admin/approve/:id', (req: Request, res: Response): any => {
  try {
    const { id } = req.params;
    const submissions = readSubmissions();
    
    const userIndex = submissions.findIndex(sub => sub.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    submissions[userIndex].status = 'approved';
    writeSubmissions(submissions);
    
    res.json({
      success: true,
      message: 'User approved successfully',
      user: submissions[userIndex]
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API endpoint to get courses (for approved users)
app.get('/api/courses', (req: Request, res: Response) => {
  try {
    // For now, return static course data
    // In the future, this could check user approval status
    const courses = [
      {
        id: '1',
        title: 'Google IT Support Professional Certificate',
        description: 'Aprende los fundamentos de soporte técnico de IT. Incluye troubleshooting, redes, sistemas operativos, y seguridad informática. Perfecto para iniciar en ciberseguridad.',
        provider: 'Google',
        duration: '6 meses',
        level: 'Beginner',
        category: 'IT Support & Cybersecurity',
        url: 'https://www.coursera.org/professional-certificates/google-it-support',
        isBlocked: true
      },
      {
        id: '2',
        title: 'Microsoft Azure Fundamentals (AZ-900)',
        description: 'Obtén una comprensión sólida de los conceptos básicos de la nube y los servicios de Microsoft Azure.',
        provider: 'Microsoft',
        duration: '3 meses',
        level: 'Beginner',
        category: 'Cloud Computing',
        url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/',
        isBlocked: true
      },
      {
        id: '3',
        title: 'Google Data Analytics Professional Certificate',
        description: 'Desarrolla habilidades en análisis de datos, visualización y toma de decisiones basadas en datos. Ideal para marketing digital y análisis de campañas.',
        provider: 'Google',
        duration: '6 meses',
        level: 'Beginner',
        category: 'Data Analytics & Marketing',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        isBlocked: true
      },
      {
        id: '4',
        title: 'Microsoft 365 Fundamentals (MS-900)',
        description: 'Aprende sobre los servicios de Microsoft 365, herramientas de productividad y colaboración en la nube.',
        provider: 'Microsoft',
        duration: '2 meses',
        level: 'Beginner',
        category: 'Productivity Tools',
        url: 'https://learn.microsoft.com/en-us/certifications/microsoft-365-fundamentals/',
        isBlocked: true
      },
      {
        id: '5',
        title: 'Google Project Management Professional Certificate',
        description: 'Adquiere habilidades esenciales de gestión de proyectos y metodologías ágiles.',
        provider: 'Google',
        duration: '6 meses',
        level: 'Beginner',
        category: 'Project Management',
        url: 'https://www.coursera.org/professional-certificates/google-project-management',
        isBlocked: true
      },
      {
        id: '6',
        title: 'Microsoft Power Platform Fundamentals (PL-900)',
        description: 'Explora las capacidades de Microsoft Power Platform para automatización y desarrollo de aplicaciones sin código.',
        provider: 'Microsoft',
        duration: '3 meses',
        level: 'Beginner',
        category: 'Productivity & Automation',
        url: 'https://learn.microsoft.com/en-us/certifications/power-platform-fundamentals/',
        isBlocked: true
      }
    ];

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Authentication API endpoints

// Generate magic link for approved user
app.post('/api/auth/magic-link', (req: Request, res: Response): any => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    // Find approved user
    const submissions = readSubmissions();
    const user = submissions.find(sub => 
      sub.email === email.toLowerCase() && sub.status === 'approved'
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found or not approved'
      });
      return;
    }

    const token = generateMagicLinkToken(user.id, user.email);
    const magicLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses?token=${token}`;

    res.json({
      success: true,
      magicLink
    });
  } catch (error) {
    console.error('Error generating magic link:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify magic link and create session
app.post('/api/auth/verify', (req: Request, res: Response): any => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const payload = verifyMagicLinkToken(token);
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const sessionId = createSession(payload.userId, payload.email);

    // Set HTTP-only cookie
    res.cookie('accessbridge_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      success: true,
      message: 'Session created successfully'
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user info
app.get('/api/auth/me', authenticateSession, (req: Request, res: Response): any => {
  res.json({
    success: true,
    user: req.user
  });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.accessbridge_session;
    if (sessionId) {
      sessions.delete(sessionId);
    }

    res.clearCookie('accessbridge_session');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update courses endpoint to require authentication
app.get('/api/courses', authenticateSession, (req: Request, res: Response): any => {
  try {
    // Return courses data for authenticated users
    const courses = [
      {
        id: '1',
        title: 'Google IT Support Professional Certificate',
        description: 'Aprende los fundamentos de soporte técnico de IT. Incluye troubleshooting, redes, sistemas operativos, y seguridad.',
        provider: 'Google',
        duration: '6 meses',
        level: 'Beginner',
        category: 'IT Support',
        url: 'https://www.coursera.org/professional-certificates/google-it-support',
        isBlocked: false // Now accessible for authenticated users
      },
      {
        id: '2',
        title: 'Microsoft Azure Fundamentals (AZ-900)',
        description: 'Obtén una comprensión sólida de los conceptos básicos de la nube y los servicios de Microsoft Azure.',
        provider: 'Microsoft',
        duration: '3 meses',
        level: 'Beginner',
        category: 'Cloud Computing',
        url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/',
        isBlocked: false
      },
      {
        id: '3',
        title: 'Google Data Analytics Professional Certificate',
        description: 'Desarrolla habilidades en análisis de datos, visualización y toma de decisiones basadas en datos.',
        provider: 'Google',
        duration: '6 meses',
        level: 'Beginner',
        category: 'Data Analytics',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        isBlocked: false
      },
      {
        id: '4',
        title: 'Microsoft 365 Fundamentals (MS-900)',
        description: 'Aprende sobre los servicios de Microsoft 365 y las opciones de licenciamiento disponibles.',
        provider: 'Microsoft',
        duration: '2 meses',
        level: 'Beginner',
        category: 'Productivity',
        url: 'https://learn.microsoft.com/en-us/certifications/microsoft-365-fundamentals/',
        isBlocked: false
      },
      {
        id: '5',
        title: 'Google Project Management Professional Certificate',
        description: 'Adquiere habilidades esenciales de gestión de proyectos y metodologías ágiles.',
        provider: 'Google',
        duration: '6 meses',
        level: 'Beginner',
        category: 'Project Management',
        url: 'https://www.coursera.org/professional-certificates/google-project-management',
        isBlocked: false
      },
      {
        id: '6',
        title: 'Microsoft Power Platform Fundamentals (PL-900)',
        description: 'Explora las capacidades de Microsoft Power Platform para automatización y desarrollo de aplicaciones.',
        provider: 'Microsoft',
        duration: '3 meses',
        level: 'Beginner',
        category: 'Low-Code Development',
        url: 'https://learn.microsoft.com/en-us/certifications/power-platform-fundamentals/',
        isBlocked: false
      }
    ];

    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Data directory: ${DATA_DIR}`);
});

export default app; 