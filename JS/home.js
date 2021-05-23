$(document).ready(function() {
    let debug = 0;
    let currently_using = 1;
    if (currently_using) {
        // getting current date for api call
        let today = new Date();
        let day = Number(String(today.getDate()).padStart(2, '0')) - debug;
        let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let year = today.getFullYear();
        let api_date = `${year}-${month}-${day}`;
        // console.log(api_date);
        const api_key = config.COVID193_KEY;
        let link = "https://covid-193.p.rapidapi.com/history?country=all&day=" + api_date;
        // console.log(link);

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": link,
            "method": "GET",
            "headers": {
                "x-rapidapi-key": api_key,
                "x-rapidapi-host": "covid-193.p.rapidapi.com"
            }
        };

        $.ajax(settings).done(function(response) {
            // console.log(response.response);
            let data_outer_array = response.response;

            let cases_data = data_outer_array[0]["cases"];
            let deaths_data = data_outer_array[0]["deaths"];

            // Overall Data
            let total_cases = Number(cases_data["total"]);
            let total_deaths = Number(deaths_data["total"]);
            let total_recovered = Number(cases_data["recovered"]);
            let total_active_cases = Number(cases_data["active"]);

            let len1 = data_outer_array[0]["deaths"]["new"].length;
            let len2 = data_outer_array[0]["cases"]["new"].length;
            let deaths_today = Number(data_outer_array[0]["deaths"]["new"].substring(1, len1));
            let cases_today = Number(data_outer_array[0]["cases"]["new"].substring(1, len2));
            // console.log(deaths_today);
            // console.log(cases_today);

            function get_comma_number(number) {
                num_str = String(number);
                let ans = "";
                for (let index = 0; index < num_str.length; index++) {
                    if (index % 3 == 0 && index != 0) {
                        ans = ", " + ans;
                    }
                    ans = num_str[num_str.length - 1 - index] + ans;
                }
                return ans;
            }

            // TOTAL STATS
            let total_cases_para = $("<p></p>").text(`Total Cases: ${get_comma_number(total_cases)}`);
            $("body").append(total_cases_para);
            let total_deaths_para = $("<p></p>").text(`Total Deaths: ${get_comma_number(total_deaths)}`);
            $("body").append(total_deaths_para);
            let total_recovered_para = $("<p></p>").text(`Total Recovered Cases: ${get_comma_number(total_recovered)}`);
            $("body").append(total_recovered_para);
            let total_active_para = $("<p></p>").text(`Total Active Cases: ${get_comma_number(total_active_cases)}`);
            $("body").append(total_active_para);

            // TODAY STATS
            let new_cases_para = $("<p></p>").text(`New Cases: ${get_comma_number(cases_today)}`);
            $("body").append(new_cases_para);
            let new_deaths_para = $("<p></p>").text(`New Deaths: ${get_comma_number(deaths_today)}`);
            $("body").append(new_deaths_para);
        });
    }
});