const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Validation test:', isValid ? 'PASS' : 'FAIL');
}

generatePasswordHash();