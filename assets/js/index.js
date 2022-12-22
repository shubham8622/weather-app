let getWeather = document.getElementById("getWeather");
let cityList = document.getElementById("cityList");
let tbody = document.getElementById("tbody");
let form = document.getElementById("form");
let search = document.getElementById("search");
let cityWeather = [];
let ArrofCities = [];
//HTML collection to Array
let HTMLtoArr = Array.prototype.slice.call(cityList.children);
let tbodyChildren = Array.prototype.slice.call(tbody.children);

// Delete Weather
function deleteWeather(city){
    try{
        let index = ArrofCities.indexOf(city)
        cityWeather.splice(index,1);
        ArrofCities = [];
        tbody.innerHTML = "";
        if(cityWeather.length != 0){
            cityWeather.map((e,i)=>{
                let cityNames = Object.keys(e)[0];
                ArrofCities.push(cityNames)
                    tbody.innerHTML +=`
                    <tr>
                    <td>${cityNames}</td>
                    <td><input type = "text" value = "${e[Object.keys(e)[0]].description}"></td>
                    <td>${e[Object.keys(e)[0]].temp_in_celsius}</td>
                    <td>${e[Object.keys(e)[0]].pressure_in_hPa}</td>
                    <td>${e[Object.keys(e)[0]].date_and_time}</td>
                    <td onClick = "deleteWeather('${cityNames}')">Delete</td>
                    </tr>
                    `
            })
        }else{
            tbody.innerHTML = `
            <tr>
            <td colspan="6">No data</td>
            </tr>
            `
        }
    }catch(e){
        console.log(e);
    }
}
// createAndRenderHTML
function createAndRenderHTML(weather){
    try{
        tbody.innerHTML = "";
        weather.map((e,i)=>{
            let cityNames = Object.keys(e)[0];
            let index = ArrofCities.indexOf(cityNames);
            setTimeout(()=>{
                tbody.innerHTML +=`
                <tr>
                <td>${cityNames}</td>
                <td><input type = "text" value = "${e[Object.keys(e)[0]].description}"></td>
                <td>${e[Object.keys(e)[0]].temp_in_celsius}</td>
                <td>${e[Object.keys(e)[0]].pressure_in_hPa}</td>
                <td>${e[Object.keys(e)[0]].date_and_time}</td>
                <td onClick = "deleteWeather('${cityNames}')">Delete</td>
                </tr>
                `
                HTMLtoArr[index + 1].classList.add("green"); 
            },2000 * i); 
        })
    }catch(e){
        console.log(e.message);
    }
}
//  API call
async function callApi(cityName){
    try{
        let res = await fetch(`https://python3-dot-parul-arena-2.appspot.com/test?cityname=${cityName}`);
        let data = await res.json();
        return data;
    }catch(e){
        console.log(e.message);
    }
}
// Perform Action
async function action(){
    try{
        for(let i=0;i<HTMLtoArr.length;i++){
            if( i != 0){
                let cityName = HTMLtoArr[i].textContent;
                ArrofCities.push(cityName);
                let res = await callApi(cityName);
                cityWeather.push({[cityName]:res});
            }
        }
        createAndRenderHTML(cityWeather);
    }catch(e){
        console.log(e.message);
    }
}
// on Click get weather button event trigger
getWeather.addEventListener("click",()=>{
    if(cityWeather.length < 4){
        cityWeather = [];
        ArrofCities = [];
        action();    
    }
})
// form Submission
form.addEventListener("submit",async (e)=>{
    try{    
        e.preventDefault();
        let searchCityName = search.value 
        if(ArrofCities.includes(searchCityName)){
            let index = ArrofCities.indexOf(searchCityName);
            tbody.children[index].classList.add("yellow");
            setTimeout(()=>{
                tbody.children[index].classList.remove("yellow");
            },3000)
        }else{
            let res = await callApi(search.value);
            if(res.status !== "failed"){
                cityWeather.push({[searchCityName]:res});
                tbody.innerHTML = "";
                cityWeather.map((e,i)=>{
                    let cityNames = Object.keys(e)[0];
                        tbody.innerHTML +=`
                        <tr>
                        <td>${cityNames}</td>
                        <td><input type = "text" value = "${e[Object.keys(e)[0]].description}"></td>
                        <td>${e[Object.keys(e)[0]].temp_in_celsius}</td>
                        <td>${e[Object.keys(e)[0]].pressure_in_hPa}</td>
                        <td>${e[Object.keys(e)[0]].date_and_time}</td>
                        <td onClick = "deleteWeather('${cityNames}')">Delete</td>
                        </tr>
                        `
                })
            }
        }
    }catch(e){
        console.log(e);
    }
});
