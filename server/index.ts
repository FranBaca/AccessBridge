import express, { Application, Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Data directory: ${DATA_DIR}`);
});

export default app; 