
// main fuction done by jQuery (1st function)
$(document).ready(function() {
    var currentDate = moment().format('dddd, L');

    //clicking-on-the-search-button function (2nd function)
    $("#searchBtn").on("click", function(event) {
        // stopPropagation(). Tried to use this instead of preventDefault(), but it did not work
       
        event.preventDefault();
        var currentCity = $("#currentCityInput").val();    
        
        //Array   
        cCityDisplay(currentCity);
        fCityDisplay(currentCity);
        mainButton(currentCity);
    
        //pushing the value (city) to store
        currentCityHistory.push(currentCity);
        storeButtons()
        // and then storing it
        var currentCityName = $("#currentCityInput").val();
        storeInput(currentCityName);
    
        //Clearing the search bar after browsing the results of the research
        $("#cityInput").val("");
    });
  
    //Rendering history buttons when the search button is clicked
    function mainButton(currentCity){
        var clickableButton = $("<button>");
        clickableButton.addClass("cityButtons btn btn-block");
        clickableButton.attr("data-name", currentCity);
        clickableButton.text(currentCity);

        //prepend the city name into the div
        $("#history").prepend(clickableButton);
       
    }

    //function to display the next 5 days weather days of the selected city
    function fCityDisplay(currentCityName){
        var api = "1c705d6d9650683e7124ea49c8cc5e78";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ currentCityName +"&appid=" + api;
        
      //Using GET method to append data from the below URL
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            //using empty method to remove the previous data shown
            $("#weatherData").empty();
            var index = [3,11,19,27,35];
            for(var i = 0; i < index.length; i++){
                var div = $("<div class = 'card'>");
                var br = $("<br>");
  
                var time = moment().add(i+1, 'd').format('L');
                var pTime = $("<h5>").text(time);
                div.append(pTime, br);
 
                var icon = response.list[index[i]].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                var iconAdd = $("<img>").attr("src", iconurl);
                iconAdd.css("width", "50px");
                div.append(iconAdd, br);
  
                var temp = ((response.list[index[i]].main.temp - 273.15) * 1.80 + 32).toFixed(2);
                var paraTemp = $("<p>").text("Temp: " + temp + " °F");
                div.append(paraTemp, br);
 
                var humidity = response.list[index[i]].main.humidity;
                var paraHumid = $("<p>").text("Humidity: " + humidity);
                div.append(paraHumid);
               
                $("#weatherData").append(div);
            }
           
          
        })
    }

    //Current weather of the city the user selects (this function was so challenging. I got help from internet)
    function cCityDisplay(currentCityName){
        var api = "1c705d6d9650683e7124ea49c8cc5e78";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ currentCityName +"&appid=" + api;
      
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            var icon = response.weather[0].icon;
            var iconLink = "http://openweathermap.org/img/w/" + icon + ".png";
            var iconAdd = $("<img>").attr("src", iconLink);
            var temprature = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(1);
 
            $(".currentCity").text(response.name +"  ("+currentDate +")")
            $(".currentCity").append(iconAdd); 
            $(".temperature").text("Temperature:  " + temprature + " °F"); 
            $(".humidity").text("Humidity:  "+ response.main.humidity + "%");
            $(".wind-speed").text("Wind speed:  "+ response.wind.speed + "MPH");      

               //function of the Ultraviolet index

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var uvIndex = function(lat, lon){
            var UltravioletQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+ api +"&lat="+ lat +"&lon="+ lon;
            
        $.ajax({
            url: UltravioletQueryURL,
            method: "GET"
            }).then(function(response) {
                var ultraVioletValue = response.value;
                var ultraVioletDegree = $("<span>").attr("id", "ultraVioletDegree").addClass("badge");
                ultraVioletDegree.text(ultraVioletValue );
                 if (ultraVioletValue  <= 2){
                    ultraVioletDegreeaddClass("normal");
                }else if (ultraVioletValue  >=3 && ultraVioletValue  <=7){
                    ultraVioletDegree.addClass("mild");
                }else{
                    ultraVioletDegree.addClass("hot");
                }
                 $(".uv-index").text("UV Index:  " );
                $(".uv-index").append(ultraVioletDegree);
             })
    }
    uvIndex(lat,lon);
  
})
}


    //function that handles the history buttons event
    $(document).on("click", ".cityButtons", function(event) {
        event.preventDefault();
        var currentCityName = $(this).attr("data-name");
        currentCityHistory.push(currentCityName);
        cCityDisplay(currentCityName);
        fCityDisplay(currentCityName);
    })

//storage (This also allows the user to dispplay the previously searched data once clicking on the city name)
    function storeInput(currentCityName){
        localStorage.setItem("City searched", currentCityName);
    }
    cCityDisplay(localStorage.getItem("city searched"));
    fCityDisplay(localStorage.getItem("city searched"));
  
    var currentCityHistory = JSON.parse(window.localStorage.getItem("history")) || [];

    if(currentCityHistory.length > 0){
        cCityDisplay(currentCityHistory[currentCityHistory.length - 1])
    }

    for(var i = 0; i < currentCityHistory.length; i++){
        mainButton(currentCityHistory[i]);
    }

    function storeButtons(){
        localStorage.setItem("history", JSON.stringify(currentCityHistory));
    }

  
 })
