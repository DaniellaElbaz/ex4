exports.postsController = {
    async getPosts(req,res) {
    const { dbConnection } = require('../db_connection');
    const connection = await dbConnection.createConnection();
    const [rows] = await connection.execute(`SELECT * from tbl_22_posts`);
    connection.end();
    return rows;
   },
   async getPost(req,res){
    const { dbConnection } = require('../db_connection');
    const connection = await dbConnection.createConnection();
    const [rows] = await connection.execute(`SELECT * from tbl_22_posts WHERE vacation_code=${req.params.postId}`);
    connection.end();
    res.json(rows[0]);
    },
   async addPost(req,res){
    const { dbConnection } = require('../db_connection');
    const connection = await dbConnection.createConnection();
    const {body}=req;
    await connection.execute(`INSERT INTO from tbl_22_posts (id_user,place,date) VALUES ("${req.params.postId}" , "${body.place}" , "${body.date}")`);
    connection.end();
    res.send(true);
   },
   async updatePost(req,res){
    const { dbConnection } = require('../db_connection');
    const connection = await dbConnection.createConnection();
    const {body}=req;
    await connection.execute(`UPDATE from tbl_22_posts SET place = "${body.place}",date = "${body.date}" WHERE vacation_code="${req.params.postId}"`);
    connection.end();
    res.send(true);
   }
};