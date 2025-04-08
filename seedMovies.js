// importing prerequisites
const imdb = require("imdb-api");
const mysql = require("mysql2");
require("dotenv").config();

const titles = [
  "For Death with Love" ,
  "Cure",
  "The Pianist",
  "Schindler's List",
  "Grave of the Fireflies", 
  "Eternal Sunshine of the Spotless Mind", 
  "A Silent Voice: The Movie", 
  "Memories of Murder",
  "City of God",
  "Parasite",
  "Come and See",
  "The Shining",
  "One Flew Over the Cuckoo's Nest", 
  "There Will Be Blood",
  "The Silence of the Lambs",
  "Oldboy",
  "The Darjeeling Limited",
  "Memento",
  "Nightcrawler",
  "Mother!",
  "The Brutalist"
];
console.log(process.env.DB_HOST, process.env.DB_PORT);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const client = new imdb.Client({ apiKey: "2ab65272" });

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected!");
    
    insertMovies();
});

async function insertMovies() {
    for (let title of titles) {
      try {
        const movie = await client.get({ name: title });
        // const movie = await client.get({ id: "tt5323662" });
  
        if (!movie || !movie.title) {
          console.warn(`⚠️  No data found for: ${title}`);
          continue;
        }
  
        db.query(
          "INSERT INTO movies (title, rating, year, poster, imdbid, description, director, genres, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [movie.title, parseFloat(movie.rating), parseInt(movie.year), movie.poster, movie.imdbid, movie.plot, movie.director, movie.genres, movie.rated],
          (err) => {
            if (err) {
              console.error(`❌ Insert error for ${title}:`, err.message);
            } else {
              console.log(`✅ Inserted: ${movie.title}`);
            }
          }
        );

        // db.query(
        //     "UPDATE movies SET title = ?, rating = ?, year = ?, poster = ?, imdbid = ?, description = ? WHERE id = 7", 
        //     [movie.title, parseFloat(movie.rating), parseInt(movie.year), movie.poster, movie.imdbid, movie.plot], 
        //     (err) => {
        //         if (err) {
        //             console.error(`❌ Insert error for:`, err.message);
        //         } else {
        //             console.log(`✅ Inserted: ${movie.title}`);
        //         }
        //     }
        // );
      } catch (err) {
        console.error(`❌ Fetch failed for ${title}:`, err.message);
      }
  
      // Respect OMDb rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  
    setTimeout(() => {
      db.end();
      console.log("🚀 Done and DB closed.");
    }, 10000);
}
  