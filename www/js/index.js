var app = {
    // Application Constructor
    initialize: function() {
        $(document).on("deviceready", this.onDeviceReady);
    },
    onDeviceReady: function() {
        // start doing stuff
        $("#tabsContainer div").click(function() {
            $("#app").attr("class", $(this).attr("id") + "Active");
        });

        var defenseLabels = $("#defensesChosen label, #defensesBreached label:not(.noPicture)");
        for(var i = 0; i < defenseLabels.length; i++) {
            var imageUrl = "img/" + $(defenseLabels[i]).text().replace(/ /g,"_").toLowerCase() + ".png";
            var image = $("<img src='" + imageUrl + "'>");
            $(defenseLabels[i]).append(image);
        }
        defenseLabels.click(function() {
            $(this).children("img").toggleClass("visible");
        });

        $("#generateQR").click(function() {
            var qrResult = document.getElementById("qrResult");
            var qrcode = new QRCode(qrResult, "test data");
        });

        $("#decodeQR").click(function() {
            cordova.plugins.barcodeScanner.scan(
                function(result) {
                    if(!result.cancelled) {
                        alert(result.text);
                    } else {
                        alert("Scan cancelled, data not saved");
                    }
                },
                function(error) {
                    alert("Scan failed: " + error);
                }
            );
        });
    }
};

app.initialize();
