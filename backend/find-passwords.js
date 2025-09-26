const bcrypt = require('bcryptjs');

// Common passwords to test
const commonPasswords = ['password', 'password123', '123456', 'admin', 'officer'];

// Hashed passwords from users.json
const hashedPasswords = {
  citizen1: '$2a$10$9z12Lr8dwF0zA73J.o9D6eF7AZiYme/XHrjzyBiRYR3tyQozPnmB.',
  officer1: '$2a$10$RExZEwNsgUiDSo83wVZQ/.JQ9Il/yn7TpUR48J1/qrPFY/1BRwnc6',
  admin1: '$2a$10$yVlN5jQ62g8ZcNtDZfzqw.cQ5JGeUVzBqQwlJVIfCY3aaXbVHXH6C'
};

async function findPasswords() {
  for (const [username, hash] of Object.entries(hashedPasswords)) {
    console.log(`\n🔍 Testing passwords for ${username}:`);
    
    for (const password of commonPasswords) {
      try {
        const isMatch = await bcrypt.compare(password, hash);
        if (isMatch) {
          console.log(`✅ Password found for ${username}: "${password}"`);
          break;
        }
      } catch (error) {
        console.error(`Error testing password "${password}" for ${username}:`, error.message);
      }
    }
  }
}

findPasswords();