#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Try different ways to run vite build
const viteBinPath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');

console.log('Starting Vite build process...');

const buildProcess = spawn('node', [viteBinPath, 'build'], {
  stdio: 'inherit',
  shell: false
});

buildProcess.on('error', (error) => {
  console.error('Build process error:', error);
  process.exit(1);
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
  process.exit(code);
});