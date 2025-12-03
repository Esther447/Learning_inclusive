const { spawn } = require('child_process');
const path = require('path');

// Get the port from environment variable or use default
const port = process.env.PORT || 8000;

console.log('🚀 Starting Python FastAPI application...');
console.log(`📍 Port: ${port}`);
console.log(`📁 Working directory: ${__dirname}`);

// Try different Python commands in order
const pythonCommands = ['python3', 'python', 'python3.10', 'python3.11'];
let pythonCmd = 'python3';

// Use python3 -m uvicorn to ensure we're using the correct Python environment
if (process.env.PYTHON_BIN) {
  pythonCmd = process.env.PYTHON_BIN;
} else if (process.env.PYTHON_VERSION) {
  pythonCmd = `python${process.env.PYTHON_VERSION}`;
}

console.log(`🐍 Using Python: ${pythonCmd}`);

// Spawn the uvicorn process using python -m uvicorn
const uvicorn = spawn(pythonCmd, [
  '-m', 'uvicorn',
  'main:app',
  '--host', '0.0.0.0',
  '--port', port.toString()
], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,  // Use shell to allow PATH resolution
  env: {
    ...process.env,
    PYTHONUNBUFFERED: '1'
  }
});

// Handle process exit
uvicorn.on('close', (code) => {
  if (code !== 0) {
    console.error(`Uvicorn process exited with code ${code}`);
  }
  process.exit(code || 0);
});

// Handle errors
uvicorn.on('error', (err) => {
  console.error('Failed to start uvicorn:', err);
  console.error('Make sure Python and uvicorn are installed and available in PATH');
  process.exit(1);
});

// Handle signals
process.on('SIGTERM', () => {
  uvicorn.kill('SIGTERM');
});

process.on('SIGINT', () => {
  uvicorn.kill('SIGINT');
});

