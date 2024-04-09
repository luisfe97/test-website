const dotenv = require("dotenv");
dotenv.config();
const mysql2 = require("mysql2");

class DBConnection {
  constructor() {
    this.db = mysql2.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
    });

    this.checkConnection();
  }

  checkConnection() {
    console.log("Reached the connection");
    this.db.getConnection((err, connection) => {
      if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.error("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
          console.error("Database has too many connections.");
        }
        if (err.code === "ECONNREFUSED") {
          console.error("Database connection was refused.");
        }
      }
      if (connection) {
        connection.release();
      }
      return;
    });
  }

  query = async (sql, values) => {
    try {
      const result = await this.db.promise().execute(sql, values);
      return result[0];
    } catch (error) {
      const mysqlErrorList = Object.keys(HttpStatusCodes);
      // Convert MySQL errors that are in the mysqlErrorList to HTTP status codes
      error.status = mysqlErrorList.includes(error.code) ? HttpStatusCodes[error.code] : error.status;
      throw error;
    }
  };
}

// Enum for HTTP status codes
const HttpStatusCodes = Object.freeze({
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
  ER_DUP_ENTRY: 409,
});

module.exports = new DBConnection().query;
