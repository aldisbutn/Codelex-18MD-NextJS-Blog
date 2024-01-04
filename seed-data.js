import { createConnection } from 'mysql2';
const DB_NAME = 'aldis_blog_database';

const connection = createConnection({
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
  connection.query(createDatabaseQuery, (createDatabaseError) => {
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
        connection.query(createQuery, (createTableError) => {
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
        (1,	1,	1,	'The Importance of HTML in Web Development',	'HTML (HyperText Markup Language) is the backbone of web development. It provides structure to your web content. Understanding its significance is crucial for any aspiring web developer.\r\n\r\n   <p><strong>HTML Basics:</strong> HTML is used to create the basic structure of a web page. It consists of various tags such as &lt;head&gt;, &lt;body&gt;, and &lt;p&gt;.</p>\r\n   <ul>\r\n   <li><span style="font-family: Arial;">HTML Tags:</span> Tags like &lt;strong&gt;, &lt;em&gt;, and &lt;span&gt; enhance the text in different ways.</li>\r\n   <li><span style="font-family: Impact;">Styling Text:</span> Utilize styles like <span style="font-size: 18px;">font size</span> and <span style="font-size: 24px;">different fonts</span> to make your content visually appealing.</li>\r\n   </ul>\r\n   <p style="text-align:center;"><span style="font-family: Times New Roman;">Mastering HTML opens doors to creating stunning websites!</span></p>',	'2024-01-02T11:44:15.908Z',	'https://i.ibb.co/WtSRtBv/html.png'),
        (2,	1,	1,	'CSS Magic: Styling Your HTML Documents',	'While HTML structures your web page, CSS (Cascading Style Sheets) adds the magic of stylish presentation. Let's delve into how CSS can transform the look and feel of your HTML content.\r\n\r\n   <p><em>Understanding Selectors:</em> Selectors in CSS allow you to target specific HTML elements and apply styles to them.</p>\r\n   <ol>\r\n   <li><span style="font-family: Times New Roman;">Box Model:</span> Explore how the box model influences the layout of HTML elements.</li>\r\n   <li><span style="font-family: Times New Roman;">Flexbox and Grid:</span> Learn about modern layout techniques that CSS offers.</li>\r\n   </ol>\r\n   <p style="text-align:right;"><span style="font-family: Times New Roman;">Elevate your web design skills with CSS mastery!</span></p>',	'2022-10-01T11:55:14.690Z',	'https://i.ibb.co/v3DF9Pw/css.png'),
        (3,	1,	1,	'JavaScript for Dynamic Web Interactions',	'To make your web pages interactive, JavaScript comes into play. It's a versatile programming language that enables dynamic and responsive user experiences.\r\n\r\n<ins>JavaScript Basics:</ins> Explore the fundamentals of JavaScript, including variables, functions, and data types.\r\n\r\n   <ul>\r\n   <li><span style="font-family: Arial;">DOM Manipulation:</span> Learn how JavaScript interacts with the Document Object Model (DOM) to update page content.</li>\r\n   <li><span style="font-family: Impact;">Event Handling:</span> Discover how to respond to user actions with JavaScript events.</li>\r\n   </ul>\r\n   <p style="text-align:left;"><span style="font-family: Times New Roman;">JavaScript empowers you to bring your web pages to life!</span></p>',	'2023-09-03T14:20:18.822Z',	'https://i.ibb.co/n76hmMp/java.png'),
        (4,	1,	2,	'Celebrating Latvian Song and Dance Festival',	'The Latvian Song and Dance Festival stands as a testament to Latvia's rich cultural heritage. Held every five years, this event brings together thousands of performers and spectators, creating a vibrant tapestry of music and dance.\r\n\r\n   <p><strong>Traditional Folk Tunes:</strong> Explore the enchanting world of Latvian folk music, where intricate melodies and harmonies narrate stories of the country's history and traditions.</p>\r\n   <ul>\r\n   <li><span style="font-family: Arial;">Community Spirit:</span> Witness the unity and camaraderie as participants from all walks of life come together to celebrate their shared musical legacy.</li>\r\n   <li><span style="font-family: Impact;">Dance Extravaganza:</span> Immerse yourself in the rhythmic movements of traditional Latvian dances, adding a visual spectacle to the auditory feast.</li>\r\n   </ul>\r\n   <p style="text-align:center;"><span style="font-family: Times New Roman;">The Latvian Song and Dance Festival: A harmonious celebration of cultural identity.</span></p>',	'2022-08-18T07:05:37.888Z',	'https://i.ibb.co/9Hcss6S/dziesmu.png'),
        (5,	1,	2,	'Wealth in Melody: Richest Musicians Worldwide',	'While music is an art form, it's also a lucrative industry. Delve into the world of the richest musicians who have not only conquered the charts but also amassed substantial wealth.\r\n\r\n   <p><em>Top Earning Artists:</em> Uncover the financial success stories of artists like Jay-Z, Taylor Swift, and Kanye West, whose ventures extend beyond music.</p>\r\n   <ol>\r\n   <li><span style="font-family: Times New Roman;">Entrepreneurial Ventures:</span> Explore how these musicians leverage their brand to venture into businesses, fashion, and tech.</li>\r\n   <li><span style="font-family: Times New Roman;">Philanthropy in Music:</span> Discover how some musicians use their wealth for charitable causes, making a positive impact beyond the industry.</li>\r\n   </ol>\r\n   <p style="text-align:right;"><span style="font-family: Times New Roman;">From hits on the charts to riches in the bank, these musicians redefine success.</span></p>',	'2023-11-15T08:45:22.501Z',	'https://i.ibb.co/HtHGdFF/musicmoney.png'),
        (6,	1,	2,	'Michael Jackson: The King of Pop's Enduring Legacy',	'No exploration of music is complete without acknowledging the legendary Michael Jackson. His influence transcends generations, and his impact on the music industry remains unparalleled.\r\n\r\n<ins>The Thriller Era:</ins> Take a journey through Michael Jackson's iconic albums, with a spotlight on the groundbreaking "Thriller" and its cultural significance.\r\n\r\n   <ul>\r\n   <li><span style="font-family: Arial;">Moonwalk Magic:</span> Uncover the secrets behind Michael's signature dance move and its lasting impact on pop culture.</li>\r\n   <li><span style="font-family: Impact;">Innovations in Music Videos:</span> Explore how Michael Jackson revolutionized the art of music videos, setting new standards for creativity and production.</li>\r\n   </ul>\r\n   <p style="text-align:left;"><span style="font-family: Times New Roman;">Michael Jackson's music and legacy continue to inspire and captivate audiences worldwide.</span></p>',	'2022-02-10T20:50:55.632Z',	'https://i.ibb.co/QJFTzR7/jackson.png'),
        (7,	1,	3,	'Formula 1: The Pinnacle of Speed and Precision',	'Formula 1 (F1) is the epitome of motorsport, blending cutting-edge technology with the skills of the world's best drivers. Let's dive into the heart-pounding world of Formula 1 racing.\r\n\r\n   <p><strong>The Engineering Marvels:</strong> Explore the high-tech world of F1 cars, where aerodynamics, hybrid power units, and tire technology contribute to unparalleled speed.</p>\r\n   <ul>\r\n   <li><span style="font-family: Arial;">Race Strategy:</span> Unravel the intricate strategies teams employ, from pit stops to tire choices, as they aim for the checkered flag.</li>\r\n   <li><span style="font-family: Impact;">Famous Circuits:</span> Discover iconic F1 circuits like Monaco, Silverstone, and Spa-Francorchamps, each with its unique challenges and history.</li>\r\n   </ul>\r\n   <p style="text-align:center;"><span style="font-family: Times New Roman;">Formula 1: Where speed meets strategy on the world's most prestigious tracks.</span></p>',	'2023-05-09T12:10:45.765Z',	'https://i.ibb.co/JnHjk03/f1.png'),
        (8,	1,	3,	'The Drama and Glory of Formula 1 Championships',	'Formula 1 Championships are a culmination of a season's worth of hard-fought battles. From nail-biting rivalries to historic victories, the F1 championship is a spectacle of drama and glory.\r\n\r\n   <p><em>Rivalries and Showdowns:</em> Explore some of the most memorable rivalries in F1 history, from Senna vs. Prost to Hamilton vs. Rosberg.</p>\r\n   <ol>\r\n   <li><span style="font-family: Times New Roman;">Champion's Journey:</span> Follow the journey of F1 champions, from their early career struggles to the triumphant moments that define their legacy.</li>\r\n   <li><span style="font-family: Times New Roman;">Technology Evolution:</span> Witness how technological advancements in F1 cars have influenced championship outcomes over the years.</li>\r\n   </ol>\r\n   <p style="text-align:right;"><span style="font-family: Times New Roman;">The Formula 1 Championship: A thrilling saga of triumph, defeat, and the pursuit of greatness.</span></p>',	'2022-12-15T15:40:28.472Z',	'https://i.ibb.co/qxHBCW3/f1drama.png'),
        (9,	1,	3,	'Rally Racing: Off-Road Adventures and Adrenaline Rush',	'Rally racing takes the thrill of motorsport off the paved tracks and into challenging terrains. It's a true test of a driver's skill, navigating through unpredictable landscapes.\r\n\r\n<ins>The Allure of Rally Cars:</ins> Discover the specialized features that make rally cars unique, from rugged suspensions to all-wheel drive capabilities.\r\n\r\n   <ul>\r\n   <li><span style="font-family: Arial;">Legendary Rally Events:</span> Explore renowned rally events like the Dakar Rally and the World Rally Championship (WRC), known for their demanding courses and extreme conditions.</li>\r\n   <li><span style="font-family: Impact;">Navigating the Unknown:</span> Learn about the crucial role of co-drivers and the intricate communication required to conquer rally challenges.</li>\r\n   </ul>\r\n   <p style="text-align:left;"><span style="font-family: Times New Roman;">Rally racing: Where skill, strategy, and the spirit of adventure collide in a cloud of dust.</span></p>',	'2021-09-14T03:17:09.078Z',	'https://i.ibb.co/SR8GyCg/rally.png'),
        (10,	1,	4,	'Unlocking the Power of Quality Sleep for a Healthier Life',	'Quality sleep is a cornerstone of a healthy lifestyle, impacting both physical and mental well-being. Explore the science behind good sleep and how it contributes to overall wellness.\r\n\r\n   <p><strong>The Sleep Cycle:</strong> Understand the different stages of sleep and their importance in promoting cognitive function, memory consolidation, and mood regulation.</p>\r\n   <ul>\r\n   <li><span style="font-family: Arial;">Creating a Sleep Sanctuary:</span> Tips and tricks for optimizing your sleep environment to enhance the quality of your rest.</li>\r\n   <li><span style="font-family: Impact;">Sleep Hygiene Practices:</span> Explore habits and routines that promote good sleep hygiene, contributing to better overall health.</li>\r\n   </ul>\r\n   <p style="text-align:center;"><span style="font-family: Times New Roman;">Embrace the transformative power of a good night's sleep for a revitalized you.</span></p>',	'2022-04-22T18:15:50.349Z',	'https://i.ibb.co/6PKHwZ4/sleep.png'),
        (11,	1,	4,	'The Vital Role of Exercise in a Balanced Lifestyle',	'Exercise is not just about staying fit; it's a key component of a balanced and healthy lifestyle. Delve into the various aspects of exercise and its positive impacts on physical and mental health.\r\n\r\n   <p><em>Types of Exercise:</em> From cardiovascular workouts to strength training, explore different forms of exercise and their specific benefits.</p>\r\n   <ol>\r\n   <li><span style="font-family: Times New Roman;">Mental Health Benefits:</span> Discover how regular exercise can alleviate stress, boost mood, and improve cognitive function.</li>\r\n   <li><span style="font-family: Times New Roman;">Incorporating Physical Activity:</span> Practical tips on fitting exercise into a busy lifestyle, making it accessible for everyone.</li>\r\n   </ol>\r\n   <p style="text-align:right;"><span style="font-family: Times New Roman;">Elevate your well-being through the transformative power of regular physical activity.</span></p>',	'2023-07-22T16:55:30.123Z',	'https://i.ibb.co/PTRpQpC/exercise.png'),
        (12,	1,	4,	'Mindful Living: Finding Balance in a Fast-Paced World',	'In the hustle and bustle of modern life, finding balance is essential for overall well-being. Explore the principles of mindful living and how they contribute to a more fulfilling lifestyle.\r\n\r\n<ins>The Art of Mindfulness:</ins> Understand mindfulness techniques and how they can be applied to daily activities for increased awareness and presence.\r\n\r\n   <ul>\r\n   <li><span style="font-family: Arial;">Digital Detox:</span> Unplug and recharge by exploring the benefits of taking breaks from technology and embracing moments of digital detox.</li>\r\n   <li><span style="font-family: Impact;">Cultivating Gratitude:</span> Reflect on the practice of gratitude and its positive impact on mental health and overall life satisfaction.</li>\r\n   </ul>\r\n   <p style="text-align:left;"><span style="font-family: Times New Roman;">Embrace the journey of mindful living and discover the joy of balance in a fast-paced world.</span></p>',	'2022-06-06T13:30:41.205Z',	'https://i.ibb.co/qCpH5d5/mindful.png'),
        (13,	1,	5,	'The Fascinating World of Quantum Computing',	'Quantum computing is at the forefront of technological innovation, promising unprecedented computational power. Dive into the mysterious and mind-bending world of quantum mechanics and its applications in computing.\r\n\r\n   <p><strong>Quantum Bits (Qubits):</strong> Explore the fundamental unit of quantum information and how qubits differ from classical bits, leading to the potential for parallel computing.</p>\r\n   <ul>\r\n   <li><span style="font-family: Arial;">Quantum Supremacy:</span> Delve into the concept of quantum supremacy and the recent breakthroughs that mark significant milestones in quantum computing.</li>\r\n   <li><span style="font-family: Impact;">Real-World Implications:</span> Discuss potential applications of quantum computing, from solving complex mathematical problems to revolutionizing cryptography.</li>\r\n   </ul>\r\n   <p style="text-align:center;"><span style="font-family: Times New Roman;">Quantum computing: A glimpse into the future of computation and problem-solving.</span></p>',	'2021-11-27T22:03:11.914Z',	'https://i.ibb.co/TBvBsS3/quantum.png'),
        (14,	1,	5,	'Exploring the Wonders of Bioluminescence in Nature',	'Bioluminescence, the production and emission of light by living organisms, adds a magical touch to the natural world. Embark on a journey to discover the creatures that light up the darkness.\r\n\r\n   <p><em>Bioluminescent Organisms:</em> From fireflies to deep-sea creatures, explore the variety of organisms that possess the ability to produce light.</p>\r\n   <ol>\r\n   <li><span style="font-family: Times New Roman;">Biological Functions:</span> Uncover the evolutionary purposes of bioluminescence, including attracting mates, confusing predators, and luring prey.</li>\r\n   <li><span style="font-family: Times New Roman;">Bioluminescence Tourism:</span> Learn about destinations where you can witness the mesmerizing spectacle of bioluminescence in the natural world.</li>\r\n   </ol>\r\n   <p style="text-align:right;"><span style="font-family: Times New Roman;">Bioluminescence: Nature's own light show that illuminates the mysteries of the living world.</span></p>',	'2023-12-31T10:33:27.014Z',	'https://i.ibb.co/hLd8WhQ/biolum.png'),
        (15,	1,	5,	'The Art of Storytelling: Crafting Narratives Across Cultures',	'Storytelling is a universal human experience, transcending cultural boundaries. Explore the art of storytelling and its significance in preserving traditions, sharing knowledge, and fostering connections.\r\n\r\n<ins>Oral Tradition:</ins> Delve into the rich history of oral storytelling, passed down through generations as a means of transmitting cultural values and collective wisdom.\r\n\r\n   <ul>\r\n   <li><span style="font-family: Arial;">Cultural Narratives:</span> Examine how storytelling differs across cultures, shaping identities and fostering a sense of belonging.</li>\r\n   <li><span style="font-family: Impact;">Digital Storytelling:</span> Explore the modern evolution of storytelling in the digital age, where narratives unfold through various multimedia platforms.</li>\r\n   </ul>\r\n   <p style="text-align:left;"><span style="font-family: Times New Roman;">Storytelling: An age-old craft that weaves the fabric of human experiences across time and cultures.</span></p>',	'2021-07-01T05:40:01.256Z',	'https://i.ibb.co/RPhW87g/storytelling.png');`,

        `INSERT INTO Comments (commentID, postID, author, content, createdAt) VALUES
          (1, 1, 'Jay', 'Nice post', '2023-02-02 08:00:00'),
          (2, 1, 'Mike', 'I agree', '2023-02-02 08:00:00'),
          (3, 1, 'BigO', 'nooooo!', '2023-02-02 08:00:00'),
          (4, 1, 'Smile123', 'THANK YOU', '2023-02-02 08:00:00'),
          (5, 1, 'CatMan200', 'Cool', '2023-02-02 08:00:00');`,
      ];

      // Execute the query to insert data
      insertDataQueries.forEach((insertDataQuery) => {
        connection.query(insertDataQuery, (insertDataError) => {
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
