import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "12345",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/read",async (req,res)=>{
  const result = await db.query("SELECT * FROM books");
  res.render("books.ejs" , {allbooks:result.rows});
})

app.get("/add" , async(req,res)=>{
  res.render("addbook.ejs");
})

app.post("/addbook" , async(req,res)=>{
  console.log(req.body);
  await db.query("INSERT INTO books (rating, title,image ,para,author) VALUES ($1,$2,$3,$4,$5)" , 
    [parseInt(req.body.rating),req.body.title,req.body.cover_url,req.body.notes,req.body.author]
  );
  console.log("updated succesfully");
  res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
  
