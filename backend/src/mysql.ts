import mysql from 'mysql2/promise';

// Create the connection to database
export const getConnection = async () => await mysql.createConnection({
    host: 'db',
    user: 'supervan',
    database: 'supervan',
    password: 'supervan'
});