const bcrypt = require('bcryptjs');

async function generateNewPasswords() {
  const users = [
    { username: 'citizen1', password: 'password123' },
    { username: 'officer1', password: 'officer123' },
    { username: 'admin1', password: 'admin123' }
  ];

  const updatedUsers = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    updatedUsers.push({
      id: (i + 1).toString(),
      username: user.username,
      password: hashedPassword,
      role: user.username.includes('citizen') ? 'citizen' : 
            user.username.includes('officer') ? 'officer' : 'admin'
    });
    
    console.log(`✅ Generated password for ${user.username}: "${user.password}"`);
  }

  console.log('\n📄 Updated users.json content:');
  console.log(JSON.stringify(updatedUsers, null, 2));
  
  return updatedUsers;
}

generateNewPasswords();