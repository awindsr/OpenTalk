import express from "express";
import router from './Routes/script.js';

const app=express();
const PORT=3000;

app.use('/', router);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");


app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

