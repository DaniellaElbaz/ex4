exports.usersController = {
        async getUsers(req, res) {
            const { dbConnection } = require('../db_connection');
            try {
                const connection = await dbConnection.createConnection();
                const [rows] = await connection.execute('SELECT * from tbl_22_users');
                connection.end();
                console.log('Users fetched:', rows);
                res.json(rows);
            } catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        },
        async addUser(req, res) {
            const { randomBytes } = require('crypto');
            const { dbConnection } = require('../db_connection');
            const { name, password } = req.body;
            if (!name || !password) {
                return res.status(400).json({ success: false, message: 'Name and password are required' });
            }
            try {
                const connection = await dbConnection.createConnection();
                const accessCode = randomBytes(8).toString('hex');
                const [existingUsers] = await connection.execute('SELECT * FROM tbl_22_users WHERE name = ?', [name]);
                if (existingUsers.length > 0) {
                    connection.end();
                    return res.status(400).json({ success: false, message: 'User already exists' });
                }
                const [result] = await connection.execute('INSERT INTO tbl_22_users (name, password, access_code) VALUES (?, ?, ?)', [name, password, accessCode]);
                const [newUser] = await connection.execute('SELECT access_code FROM tbl_22_users WHERE id = ?', [result.insertId]);
                connection.end();
                res.json({ success: true, access_code: newUser[0].access_code });
            } catch (error) {
                console.error('Error adding user:', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
         },
         async getUserByAccessCode(req, res) {
            const { dbConnection } = require('../db_connection');
            const { vacationsController } = require('./vacationsController');
            const { chooseVacation } = vacationsController;
            console.log('chooseVacation:', chooseVacation);
            const { access_code } = req.body;
            if (!access_code) {
                return res.status(400).json({ success: false, message: 'Access code is required' });
            }
            try {
                const connection = await dbConnection.createConnection();
                const [user] = await connection.execute('SELECT * FROM tbl_22_users WHERE access_code = ?', [access_code]);
                if (user.length === 0) {
                    connection.end();
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                connection.end();
                req.body.user = user[0];
                await chooseVacation(req, res);
            } catch (error) {
                console.error('Error fetching user by access code:', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
};