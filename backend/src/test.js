const bcrypt = require('bcrypt');

async function generateHash(password) {
  const hash = await bcrypt.hash(password, 10); // 10 salt rounds
  console.log(hash);
}

generateHash('abc123');