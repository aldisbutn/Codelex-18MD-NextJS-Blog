const mysql = require('mysql2');
const DB_NAME = 'aldis_blog_database';

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'example',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log('Connected to MySQL server');

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
  connection.query(createDatabaseQuery, (createDatabaseError, createDatabaseResults) => {
    if (createDatabaseError) {
      console.error('Error creating database:', createDatabaseError);
      connection.end();
      return;
    }

    console.log(`Database "${DB_NAME}" created or already exists`);

    // Switch to the created database
    connection.changeUser({ database: DB_NAME }, (changeUserError) => {
      if (changeUserError) {
        console.error('Error switching to database:', changeUserError);
        connection.end();
        return;
      }

      console.log(`Switched to database "${DB_NAME}"`);

      // Define the SQL query to create a table if not exists
      const createTableQueries = [
        'CREATE TABLE Users (userID INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(250), email VARCHAR(50));',

        'CREATE TABLE Categories (categoryID INT PRIMARY KEY, categoryName VARCHAR(50));',

        'CREATE TABLE Posts (postID INT AUTO_INCREMENT PRIMARY KEY, userID INT, categoryID INT, title VARCHAR(255), content TEXT, createdAt VARCHAR(255), imageURL VARCHAR(255), FOREIGN KEY (userID) REFERENCES Users(userID), FOREIGN KEY (categoryID) REFERENCES Categories(categoryID));',

        'CREATE TABLE Comments (commentID INT AUTO_INCREMENT PRIMARY KEY, postID INT, author VARCHAR(50), content TEXT, createdAt VARCHAR(250), FOREIGN KEY (postID) REFERENCES Posts(postID));',
      ];

      // Execute the query to create the table
      createTableQueries.forEach((createQuery) => {
        connection.query(createQuery, (createTableError, createTableResults) => {
          if (createTableError) {
            console.error('Error creating table:', createTableError);
            connection.end();
            return;
          }

          console.log('Table created or already exists');
        });
      });

      // Define the SQL query to insert data into the table
      const insertDataQueries = [
        `INSERT INTO Users (userID, username, password) VALUES (1, 'Aldis', '$2b$10$6J4PrUxkdfTXmqaj2ACzMe2lVpf4KOnFRqq.tn00TeVJSt8qgfKEG', 'aldis@codelex.lv');`,

        `INSERT INTO Categories (categoryID, categoryName) VALUES (1, 'Programming'), (2, 'Music'), (3, 'Racing'), (4, 'Lifestyle'), (5, 'Other');`,

        `INSERT INTO Posts (postID, userID, categoryID, title, content, createdAt, imageURL) VALUES
          (1, 1, 1, 'How to code', 'This is my first blog post where Im going to teach programming', '2023-01-01 08:00:00', 'https://picsum.photos/200'),
          (2, 1, 2, 'My favorite albums of 2023', 'These are my favorite albums of 2023', '2023-02-02 08:00:00', 'https://picsum.photos/200'),
          (3, 1, 3, 'Best F1 races of 2023', 'These are my favorite races of 2023', '2023-03-03 08:00:00', 'https://picsum.photos/200'),
          (4, 1, 4, 'How to tie your shoes', 'This is a simple tutorial of how to tie your shoes', '2023-04-03 08:00:00', 'https://picsum.photos/200'),
          (5, 1, 5, 'Some other blog post', 'lalalalalal', '2023-05-06 08:00:00', 'https://picsum.photos/200');`,

        `INSERT INTO Comments (commentID, postID, author, content, createdAt) VALUES
          (1, 1, 'Jay', 'Nice post', '2023-02-02 08:00:00'),
          (2, 1, 'Mike', 'I agree', '2023-02-02 08:00:00'),
          (3, 1, 'BigO', 'nooooo!', '2023-02-02 08:00:00'),
          (4, 1, 'Smile123', 'THANK YOU', '2023-02-02 08:00:00'),
          (5, 1, 'CatMan200', 'Cool', '2023-02-02 08:00:00');`,
      ];

      // Execute the query to insert data
      insertDataQueries.forEach((insertDataQuery) => {
        connection.query(insertDataQuery, (insertDataError, insertDataResults) => {
          if (insertDataError) {
            console.error('Error inserting data:', insertDataError);
          } else {
            console.log('Data inserted or already exists');
          }
        });
      });

      // Close the connection
      connection.end();
    });
  });
});
