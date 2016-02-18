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

        var defenseLabels = $(".defenses label:not(.noPicture), #autonomous legend span");
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

        var breachedDefenses = $(".game.view .defenses.breached");
        var buttonHTML = "<button class='minus'></button><button class='plus'></button>";
        breachedDefenses.children("fieldset").children("span.makes, span.misses").after(buttonHTML);
        $("span.goals.makes, span.goals.misses, span.counter").after(buttonHTML);
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
            var data = getGameData();
            var qrcode = new QRCode(qrResult, data);
        });

        $("#decodeQR").click(function() {
            cordova.plugins.barcodeScanner.scan(
                function(result) {
                    if(!result.cancelled) {
                        var finalRow = decode(result.text);
                        alert(finalRow);
                    } else {
                        alert("Scan cancelled, data not saved");
                    }
                },
                function(error) {
                    alert("Scan failed: " + error);
                }
            );
        });

        function getGameData() {
            var teamNumber = $("#gameTeamNumber").val();
            while(teamNumber.length < 4) {
                teamNumber = "0" + teamNumber;
            }

            var fouled = isChecked("fouled");
            var deadBot = isChecked("deadBot");

            var cd = {
                a: getRadio("cdCatA"),
                b: getRadio("cdCatB"),
                c: getRadio("cdCatC"),
                d: getRadio("cdCatD")
            };

            var ad = {
                a: getRadio("adCatA"),
                b: getRadio("adCatB"),
                c: getRadio("adCatC"),
                d: getRadio("adCatD"),
                lowbar: isChecked("adLowbar"),
                grabBall: isChecked("adGrabBall")
            };

            var aGoals = {
                high: {
                    makes: getTwoDigit("#autonomous .highGoals .goals.makes"),
                    misses: getTwoDigit("#autonomous .highGoals .goals.misses")
                },
                low: {
                    makes: getTwoDigit("#autonomous .lowGoals .goals.makes"),
                    misses: getTwoDigit("#autonomous .lowGoals .goals.misses")
                }
            };

            var bd = {
                a: {
                    defense: getRadio("bdCatA"),
                    makes: getTwoDigit(".bdCatA.makes"),
                    misses: getTwoDigit(".bdCatA.misses")
                },
                b: {
                    defense: getRadio("bdCatB"),
                    makes: getTwoDigit(".bdCatB.makes"),
                    misses: getTwoDigit(".bdCatB.misses")
                },
                c: {
                    defense: getRadio("bdCatC"),
                    makes: getTwoDigit(".bdCatC.makes"),
                    misses: getTwoDigit(".bdCatC.misses")
                },
                d: {
                    defense: getRadio("bdCatD"),
                    makes: getTwoDigit(".bdCatD.makes"),
                    misses: getTwoDigit(".bdCatD.misses")
                },
                lowbar: isChecked("bdLowbar")
            };

            var goals = {
                high: {
                    makes: getTwoDigit(".nonAutonomous .highGoals .goals.makes"),
                    misses: getTwoDigit(".nonAutonomous .highGoals .goals.misses")
                },
                low: {
                    makes: getTwoDigit(".nonAutonomous .lowGoals .goals.makes"),
                    misses: getTwoDigit(".nonAutonomous .lowGoals .goals.misses")
                }
            };

            var timesBallPickedUp = getTwoDigit(".nonAutonomous .ballPickedUp span.counter");

            var gameRoles = {
                highShooting : isChecked("gameHighShootingSpecialty"),
                lowShooting : isChecked("gameLowShootingSpecialty"),
                breaching : isChecked("gameBreachingSpecialty"),
                defending : isChecked("gameDefendingSpecialty")
            };

            var challengedTower = isChecked("challengedTower");
            var scalingSuccessful = isChecked("scalingSuccessful");

            var encodedText = teamNumber + " " + fouled  + " " + deadBot + " " + cd.a + " " + cd.b + " " + cd.c + " " + cd.d + " " + ad.a + " " + ad.b + " " + ad.c + " " + ad.d + " " + ad.lowbar + " " + ad.grabBall + " " + aGoals.high.makes + " " + aGoals.high.misses + " " + aGoals.low.makes + " " + aGoals.low.misses + " " + bd.a.defense + " " + bd.a.makes + " " + bd.a.misses + " " + bd.b.defense + " " + bd.b.makes + " " + bd.b.misses + " " + bd.c.defense + " " + bd.c.makes + " " + bd.c.misses + " " + bd.d.defense + " " + bd.d.makes + " " + bd.d.misses + " " + bd.lowbar + " " + goals.high.makes + " " + goals.high.misses + " " + goals.low.makes + " " + goals.low.misses  + " " + timesBallPickedUp + " " + gameRoles.highShooting + " " + gameRoles.lowShooting + " " + gameRoles.breaching + " " + gameRoles.defending + " " + challengedTower + " " + scalingSuccessful;

            return encodedText;
        }

        function getRadio(groupName) {
            if($('input[name="' + groupName + '"]:checked').length) {
                return $('input[name="' + groupName + '"]:checked')[0].value;
            } else {
                alert("Field " + groupName + " not filled out.");
                return "X";
            }
        }

        function isChecked(checkboxId) {
            return ($("#" + checkboxId).is(":checked")) ? "1" : "0";
        }

        function getTwoDigit(selector) {
            var possiblySingleDigit = $(selector).text();
            while(possiblySingleDigit.length < 2) {
                possiblySingleDigit = "0" + possiblySingleDigit;
            }
            return possiblySingleDigit;
        }

        function decode(encodedText) {
            var values = encodedText.split(" ");
            for(var i = 0; i < values.length; i++) {
                values[i] = parseInt(values[i], 10);
                if($.inArray(i, [1,2,11,12,29,35,36,37,38,39,40])) {
                    values[i] = (values[i]) ? "TRUE" : "FALSE";
                }
            }

            var finalRow = values.join(",");
            return finalRow;
        }
    }
};

app.initialize();
