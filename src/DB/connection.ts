import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root", // same as phpMyAdmin
  password: "",
  database: "clinic",
  waitForConnections: true,
  connectionLimit: 10,
});
