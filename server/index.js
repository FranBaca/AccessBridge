"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000', 10);
// Data file path
const DATA_DIR = path_1.default.join(__dirname, 'data');
const SUBMISSIONS_FILE = path_1.default.join(DATA_DIR, 'submissions.json');
// Ensure data directory exists
if (!fs_1.default.existsSync(DATA_DIR)) {
    fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
}
// Initialize submissions file if it doesn't exist
if (!fs_1.default.existsSync(SUBMISSIONS_FILE)) {
    fs_1.default.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
}
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Helper function to read submissions
const readSubmissions = () => {
    try {
        const data = fs_1.default.readFileSync(SUBMISSIONS_FILE, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading submissions file:', error);
        return [];
    }
};
// Helper function to write submissions
const writeSubmissions = (submissions) => {
    try {
        fs_1.default.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
    }
    catch (error) {
        console.error('Error writing submissions file:', error);
        throw error;
    }
};
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to AccessBridge API' });
});
// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// API endpoint to submit user interest
app.post('/api/interest', (req, res) => {
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
        // Basic phone validation (allows various formats)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number'
            });
        }
        // Create new submission
        const newSubmission = {
            id: (0, uuid_1.v4)(),
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
    }
    catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});
// API endpoint to get all submissions (for admin use)
app.get('/api/admin/submissions', (req, res) => {
    try {
        const submissions = readSubmissions();
        res.json({
            success: true,
            data: submissions,
            count: submissions.length
        });
    }
    catch (error) {
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
exports.default = app;
