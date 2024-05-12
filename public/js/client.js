const API_KEY = "put your api key";
var lat = "";
var long = "";
const API_URL = `https://api.openweathermap.org/data/2.5/`;


navigator.geolocation.getCurrentPosition(  async  (position)=>{
    lat = position.coords.latitude;
    long = position.coords.longitude;
    var endpoint = `weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`;
    const result = await fetch(API_URL + endpoint);

    const data = await result.json();

    console.log(data)
    $(".temp").text(Math.round(data.main.temp)+ "°");
    $(".weather-type").text(data.weather[0].main)
    $(".weather-icon").children()[0].src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` 
    $(".max-temp").text("MAX "+data.main.temp_max)
    $(".min-temp").text("MIN "+data.main.temp_min)


    $(".yourCity").text(data.name);
    $(".yourCountry").text(data.sys.country)


})
