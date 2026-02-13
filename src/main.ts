#!/usr/bin/env node

import { BrevoServer } from './server.js';

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  console.error('Error: BREVO_API_KEY environment variable is required');
  console.error('');
  console.error('Usage:');
  console.error('  export BREVO_API_KEY=your-api-key-here');
  console.error('  brevo-mcp');
  console.error('');
  console.error('Or provide it inline:');
  console.error('  BREVO_API_KEY=your-api-key-here brevo-mcp');
  process.exit(1);
}

const server = new BrevoServer(apiKey);
server.run().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
