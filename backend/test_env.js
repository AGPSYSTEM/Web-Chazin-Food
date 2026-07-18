require('dotenv').config();
console.log('PORT:', process.env.PORT);
console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
console.log('DB_PASSWORD value:', JSON.stringify(process.env.DB_PASSWORD));
console.log('Evaluated password:', process.env.DB_PASSWORD ?? '12345');
