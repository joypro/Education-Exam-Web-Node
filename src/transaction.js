const writeConn = require('./dbconnection').writePool;
const util =require('./utility/util')


module.exports.getConnection = async () => {
    try {
        return await writeConn.getConnection();
    } catch (err) {
        util.createLog(err)
        return false;
        // throw new Error('Error occurred while getting the connection');
    }
};
module.exports.beginTransaction = async (connection) => {
    try {
        await connection.beginTransaction();
    } catch (err) {
        connection.release();
        util.createLog(err);
        throw new Error('Error occurred while creating the transaction');
    }
};
module.exports.commitTransaction = async (connection) => {
    try {
        await connection.commit();
        connection.release();
    } catch (err) {
        await connection.rollback();
        connection.release();
        util.createLog(err);
        throw new Error('Commit failed');
        // return false;
    }
};
module.exports.executeQuery = async (connection, query, values) => {
    try {
        return await connection.query(query, values);
    } catch (err) {
        await connection.rollback();
        connection.release();
        util.createLog(err)
        throw new Error('Query execution failed');
        // return false
    }
};