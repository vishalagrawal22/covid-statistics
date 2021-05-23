$(document).ready(function() {
    function getLocation() {
        if (navigator.geolocation) {
            //console.log("Successfully fetch location");
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        getReadableLocation(latitude, longitude)
    }

    function getReadableLocation(latitude, longitude) {
        let country = "India";
        let state = "Delhi";
        if (config.using_location) {
            let endPointUrl = "https://us1.locationiq.com";
            const APIKey = config.LOCATIONQ_KEY;
            let link = `${endPointUrl}/v1/reverse.php?key=${APIKey}&lat=${latitude}&lon=${longitude}&format=json`;
            const settings = {
                "async": true,
                "crossDomain": true,
                "url": link,
                "method": "GET"
            };

            $.ajax(settings).done(function(response) {
                // console.log(response);
                country = response["address"]["country"];
                state = response["address"]["state"];
                locationFound(country, state);
            });
        } else {
            locationFound(country, state);
        }

        function locationFound(country, state) {
            // console.log(country);
            // console.log(state);
            if (config.get_location_stats) {
                let debug = 1;
                let today = new Date();
                let day = Number(String(today.getDate()).padStart(2, '0')) - debug;
                let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                let year = today.getFullYear();
                let api_date = `${year}-${month}-${day}`;
                let api_url = `https://covid-19-statistics.p.rapidapi.com/reports?date=${api_date}&region_name=${country}`;
                // console.log(api_url);
                const settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": api_url,
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": config.RAPIDAPI_KEY,
                        "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com"
                    }
                };

                function displayData(deaths, recovered, confirmed, active) {
                    let confirmed_para = $("<p></p>").text(`Confirmed Cases: ${confirmed}`);
                    $("body").append(confirmed_para);
                    let active_para = $("<p></p>").text(`Active Cases: ${active}`);
                    $("body").append(active_para);
                    let recovered_para = $("<p></p>").text(`Recovered: ${recovered}`);
                    $("body").append(recovered_para);
                    let deaths_para = $("<p></p>").text(`Deaths: ${deaths}`);
                    $("body").append(deaths_para);
                }

                function handleUserStateData(response) {
                    // console.log(response);
                    let stateHeader = $("<h1></h1>").text(`${state}'s Data`);
                    $("body").append(stateHeader);
                    displayData(response["deaths"], response["recovered"], response["confirmed"], response["active"]);
                }

                $.ajax(settings).done(function(response) {
                    // console.log(response);
                    let country_deaths = 0;
                    let country_recovered = 0;
                    let country_confirmed = 0;
                    let country_active = 0;
                    for (state_data of response["data"]) {
                        // console.log(state_data);
                        country_deaths += state_data["deaths"];
                        country_recovered += state_data["recovered"];
                        country_confirmed += state_data["confirmed"];
                        country_active += state_data["active"];
                        if (state_data["region"]["province"] == state) {
                            handleUserStateData(state_data);
                        }
                    }
                    let countryHeader = $("<h1></h1>").text(`${country}'s Data`);
                    $("body").append(countryHeader);
                    displayData(country_deaths, country_recovered, country_confirmed, country_active);
                });
            }
        }
    }

    getLocation();
});