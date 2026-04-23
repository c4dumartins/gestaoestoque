import mysql from 'mysql2/promise';

// Criamos uma "pool" (piscina) de conexões. 
// Isso é melhor que uma conexão única porque permite várias consultas ao mesmo tempo.
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});