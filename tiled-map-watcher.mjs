// Node.js program to demonstrate the
// fs.watch() method

// Importing the filesystem module
import fs from 'fs';
import { exec } from 'child_process';

fs.watch('artwork/slangespillet.tmx', (eventType, filename) => {
  console.log('The file ', filename, ' was modified!');

  exec('npm run map');
});
