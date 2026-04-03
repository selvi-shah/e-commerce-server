import { Client } from 'pg';

const client = new Client({
  host: '::1',
  port: 5432,
  user: 'postgres',
  password: 'Nivi@7585',
  database: 'ecommerce-db'
});

console.log('Before connect');
client.connect()
  .then(() => {
    console.log('Connected successfully!');
    client.end();
  })
  .catch(err => {
    console.log('Connection failed:', err.message);
  });
console.log('After connect');