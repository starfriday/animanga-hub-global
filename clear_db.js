/* eslint-disable @typescript-eslint/no-require-imports */
const mysql = require('mysql2/promise');

async function dropAllTables() {
    try {
        console.log('Connecting to database...');
        // Connection string from your .env
        const connection = await mysql.createConnection({
            host: 'server185.hosting.reg.ru',
            user: 'u3408035_starfriday',
            password: 'L8Z-sF5-VrE-qQf',
            database: 'u3408035_shinaji',
            port: 3306,
            multipleStatements: true
        });

        console.log('Connected! Fetching tables...');

        // Get all tables
        const [rows] = await connection.query('SHOW TABLES');

        if (rows.length === 0) {
            console.log('Database is already empty!');
            process.exit(0);
        }

        const tables = rows.map(row => Object.values(row)[0]);
        console.log(`Found ${tables.length} tables:`, tables.join(', '));

        console.log('Disabling foreign key checks...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

        for (const table of tables) {
            console.log(`Dropping table ${table}...`);
            await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
        }

        console.log('Re-enabling foreign key checks...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

        console.log('✅ All tables successfully dropped!');
        await connection.end();
    } catch (e) {
        console.error('❌ Error:', e);
    }
}

dropAllTables();
