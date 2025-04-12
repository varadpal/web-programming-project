// pre
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();
const serverless = require("serverless-http");



const app = express();
const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Body Parser
app.use(express.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// FOR HOSTING THROUGH RAILWAY_VERCEL

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected!");
});

// MAILCHIMP CONNECTING CODE
mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY, 
    server: process.env.MAILCHIMP_SERVER
});

async function addSubscriber(email, firstName, lastName, phone) {
    try {
        const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
            email_address: email, // ✅ Correct field name
            status: "subscribed", // ✅ Note: it's 'subscribed', not 'subscribe'
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
                PHONE: phone
            }
        });

        console.log("✅ Subscriber Added:", response); 
    } catch(err) {
        console.log("❌ Error Adding Subscriber:", err.response.body.detail); 
    };
};

app.get("/", (req, res) => {
    res.render("homePage");
})

app.get("/gallery", (req, res) => {
    res.render("gallery")
});

app.get("/topPicks", (req, res) => {
    db.query("SELECT * FROM movies", (err, movies) => {
        if (err) throw err; 
        res.render("topPicks", { movies }); 
    })
}); 

app.post("/topPicks", async (req, res) => {
    const searchTerm = req.body.query;

    const imdb = require('imdb-api');
    const client = new imdb.Client({ apiKey: process.env.OMDB_API_KEY }); // You may already have this line

    try {
        const results = await client.search({ name: searchTerm });
        const basicResults = results.results.slice(0, 10); // Limit to 10 movies

        const detailedMovies = await Promise.all(
            basicResults.map(async (movie) => {
                try {
                    const fullMovie = await client.get({ id: movie.imdbid });
                    return fullMovie;
                } catch (err) {
                    console.error(`Error fetching full data for ${movie.title}:, err`);
                    return movie; // fallback to basic
                }
            })
        );

        res.render("searchResults", { query: searchTerm, movies: detailedMovies });
    } catch (err) {
        console.error("Search failed:", err);
        res.render("searchResults", { query: searchTerm, movies: [] });
    }
});

app.get("/newsletter", (req, res) => {
    // console.log("🟡 GET /newsletter called");
    res.render("newsletterReg");
}); 

app.post("/newsletter", async (req, res) => {
    // console.log("🟢 POST /newsletter called with data:", req.body);
    const { fname, lname, email, phone } = req.body;
  
    try {
      await addSubscriber(email, fname, lname, phone);
      res.render("thankyou");
    } catch (err) {
      res.status(500).send("Something went wrong. Please try again.");
    }
});

app.get("/thankyou", (req, res) => {
    res.render("thankyou")
})

app.get("/about", (req, res) => {
    res.render("about.ejs");
})

// TRADITIONAL LISTNER
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export it as a Vercel handler
// module.exports = app; 
// module.exports.handler = serverless(app);