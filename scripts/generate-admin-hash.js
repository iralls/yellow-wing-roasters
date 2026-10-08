#!/usr/bin/env node

/**
 * Yellow Wing Roasters - Admin Passcode Hash Generator
 * 
 * Computes salted SHA-256 hash for owner authentication.
 * Safe for public open-source git repositories; plaintext passwords are never stored.
 * 
 * Usage:
 *   node scripts/generate-admin-hash.js "MySecretPasscode"
 *   node scripts/generate-admin-hash.js (interactive prompt with hidden input)
 */

const crypto = require('crypto');
const readline = require('readline');

const DEFAULT_SALT = 'yellow-wing-roasters-auth-v1';

function computeHash(password, salt) {
  salt = salt || DEFAULT_SALT;
  return crypto.createHash('sha256').update(salt + password.trim()).digest('hex');
}

function promptPassword(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  process.stdout.write('Enter roaster admin password: ');

  if (process.stdin.isTTY) {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let password = '';
    stdin.on('data', function onData(ch) {
      ch = ch.toString('utf8');
      if (ch === '\n' || ch === '\r' || ch === '\u0004') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        rl.close();
        callback(password);
      } else if (ch === '\u0003') {
        process.stdout.write('\n');
        process.exit(0);
      } else if (ch === '\u007f' || ch === '\b') {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        password += ch;
        process.stdout.write('*');
      }
    });
  } else {
    rl.question('', function (answer) {
      rl.close();
      callback(answer);
    });
  }
}

function displayResult(hash) {
  console.log('\n--- Roaster Admin Security Credentials ---');
  console.log(`Salt: ${DEFAULT_SALT}`);
  console.log(`SHA-256 Hash: ${hash}\n`);
  console.log('Copy and paste this into scripts/google-forms/orders/Code.gs:');
  console.log(`  var ADMIN_PASSWORD_HASH = '${hash}';\n`);
}

function main() {
  const args = process.argv.slice(2).filter(a => !a.startsWith('-'));

  if (args.length > 0) {
    const password = args[0];
    const hash = computeHash(password, DEFAULT_SALT);
    displayResult(hash);
  } else {
    promptPassword(function (password) {
      if (!password || password.trim() === '') {
        console.error('Error: Password cannot be empty.');
        process.exit(1);
      }
      const hash = computeHash(password, DEFAULT_SALT);
      displayResult(hash);
    });
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  computeHash: computeHash,
  DEFAULT_SALT: DEFAULT_SALT
};
