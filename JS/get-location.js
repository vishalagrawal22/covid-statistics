$(document).ready(function() {
    function getLocation() {
        if (navigator.geolocation) {
            console.log("Successfully fetch location");
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
        let currently_using = 1;
        if (currently_using) {
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
                console.log(response);
            });
        }
    }

    getLocation();
});