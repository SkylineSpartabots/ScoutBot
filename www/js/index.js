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

        $("label").prepend("<span></span>");

        var defenseLabels = $(".defenses label:not(.noPicture), #autonomous fieldset fieldset legend");
        for(var i = 0; i < defenseLabels.length; i++) {
            var imageUrl = "img/" + $(defenseLabels[i]).text().replace(/ /g,"_").toLowerCase() + ".png";
            var image = $("<img src='" + imageUrl + "'>");
            $(defenseLabels[i]).append(image);
        }

        defenseLabels.on("taphold", {
            duration: 1000
        }, function() {
            $(this).children("img").addClass("visible");
            return false;
        });
        defenseLabels.children("img").click(function() {
            $(this).removeClass("visible");
            return false;
        });

        var breachedDefenses = $(".game.view .defenses")[1];
        var buttonHTML = "<button class='minus'></button><button class='plus'></button>";
        $(breachedDefenses).children("fieldset").children("span.makes, span.misses").after(buttonHTML);
        $("span.goals.makes, span.goals.misses").after(buttonHTML);
        $("button.minus").click(function() {
            var input = $(this).prevAll("span")[0];
            if($(input).text() > 0) $(input).text( +$(input).text() - 1);
        });
        $("button.plus").click(function() {
            var input = $(this).prevAll("span")[0];
            if($(input).text() < 20) $(input).text( +$(input).text() + 1);
        });

        $("#generateQR").click(function() {
            var qrResult = $("#qrResult").empty()[0]; // clear the element
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
