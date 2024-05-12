import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import pg from "pg";


const app = express();
const port = 3000;

const API_URL = `https://api.openweathermap.org/data/2.5/`;

const API_KEY = "put your api key";

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


function unixToUTC(date){
    const dateUTC = new Date(date * 1000);

    return ([dateUTC.getHours(), dateUTC.getMinutes()])
}

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database : "world",
    password: "postgresql",
    port: 5432,
});

db.connect();


async function findCountry(code){
    const input = code;
    const result = await db.query("SELECT country_name FROM countries WHERE UPPER(country_codee) = $1",
        [input.toUpperCase()]
    );
    
    const data = result.rows[0];
    console.log(data)
    return data.country_name;  

}



app.listen(port, ()=>{
    console.log(
        `Server is running on port ${port}`);
})


app.get("/", async(req, res) => {
    res.render("mylocation.ejs")
})

app.post("/city", async(req, res)=>{
    console.log(req.body)
    var place = req.body.place;
    var endpoint = `weather?q=${place}&appid=${API_KEY}&units=metric`;
    console.log(endpoint)
    try {
        const result = await axios.get(API_URL+endpoint);
        console.log(result.data)
        var sunriseTime = unixToUTC(result.data.sys.sunrise);
        var sunsetTime = unixToUTC(result.data.sys.sunset);

        var fullName =await findCountry(result.data.sys.country)
        console.log(fullName);
        res.render("index.ejs",{weather: result.data, sunriseTime, sunsetTime, countryName:fullName})

    } catch (error) {
        console.log(error)
        console.log(error.response.data)
        res.render("index.ejs",{error: error.response.data})
    }
})
