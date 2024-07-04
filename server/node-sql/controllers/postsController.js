exports.postsController = {
    async  addPostName(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();
        try {
            
            const { body } = req;
            const [rows] = await connection.execute('SELECT * FROM tbl_22_users WHERE name = ?', [body.name]);
            if (rows.length > 0) {
                connection.end();
                return res.status(400).json({ success: false, message: 'User already exists' });
            }
            const [result] = await connection.execute('INSERT INTO tbl_22_users (name, password) VALUES (?, ?)', [body.name, body.password]);
            const [newUser] = await connection.execute('SELECT access_code FROM tbl_22_users WHERE id = ?', [result.insertId]);
            connection.end();
            res.json({ success: true, access_code: newUser[0].access_code });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        connection.end();
        res.send(true);
    },
    
      // GET localhost:8081/posts
      async getPosts(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        const [rows] = await connection.execute(`SELECT * from tbl_99_posts`);

        connection.end();
        res.json(rows);
    },
    // GET localhost:8081/posts/2
    async getPost(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        const [rows] = await connection.execute(`SELECT * from tbl_99_posts WHERE id=${req.params.postId}`);

        connection.end();
        res.json(rows[0]);
    },
    // POST localhost:8081/posts
    async addPost(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();
        const { body } = req;
       
        await connection
        .execute(`INSERT INTO tbl_99_posts (title, description) VALUES ("${body.title}", "${body.description}")`)
        const [rows] = await connection.execute(`SELECT * from tbl_99_posts WHERE id=${response[0].insertId}`);
        row => res.json(row);
        },
    // PUT localhost:8081/posts/5
    async updatePost(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        const { body } = req;
        await connection.execute(`UPDATE tbl_99_posts SET title = "${body.title}", description = "${body.description}" WHERE id=${req.params.postId}`);

        connection.end();
        res.send(true);
    },
    // DELETE localhost:8081/posts/5
    async deletePost(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        await connection.execute(`DELETE FROM tbl_99_posts WHERE id=${req.params.postId}`);

        connection.end();
        res.send(true);
    }
};