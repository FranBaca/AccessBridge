# AccessBridge Server

Express.js server with TypeScript for the AccessBridge application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=3000
NODE_ENV=development
```

## Available Scripts

### Development
```bash
npm run dev
```
Runs the server in development mode with hot reload using ts-node-dev.

### Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist` folder.

### Production
```bash
npm start
```
Runs the compiled JavaScript server (requires build first).

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Features

- Express.js framework
- TypeScript support
- CORS enabled
- Environment variable configuration
- JSON body parsing
- URL-encoded body parsing 