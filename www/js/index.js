var app = {
    // Application Constructor
    initialize: function() {
        $(document).on("deviceready", this.onDeviceReady);
    },
    onDeviceReady: function() {

        var fileObj;

        // start doing stuff
        $("#tabsContainer div").click(function() {
            $("#app").attr("class", $(this).attr("id") + "Active");
        });

        window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(dir) {
            // alert("got main dir" + dir);
            dir.getFile("scoutingData.txt", {create:true}, function(file) {
                // alert("got the file" + file);
                fileObj = file;
            });
        });

        function writeToFile(str) {
            str += "\n";
            fileObj.createWriter(function(fileWriter) {
                fileWriter.seek(fileWriter.length);
                var blob = new Blob([str], {type:'text/plain'});
                fileWriter.write(blob);
            });
        }

        $("label").prepend("<span></span>");

        $("#pitTeamNumber, #gameTeamNumber").change(function() {
            $(this).val($(this).val().substr(0, 4));
        });

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

        $(".generateQR").click(function() {
            $("#qrResult").empty();
            var data = $(this).hasClass("game") ? getGameData() : getPitData(); // set it to either game or pit data
            $("#qrResult").append("<img src='" + qr.toDataURL(data) + "' />");
        });

        $("#decodeQR").click(function() {
            cordova.plugins.barcodeScanner.scan(
                function(result) {
                    if(!result.cancelled) {
                        var finalRow = decodeGame(result.text);
                        alert(finalRow);
                        writeToFile(finalRow);
                    } else {
                        alert("Scan cancelled, data not saved");
                    }
                },
                function(error) {
                    alert("Scan failed: " + error);
                }
            );
        });

        function getPitData() {
            var teamNumber = $("#pitTeamNumber").val();
            while(teamNumber.length < 4) {
                teamNumber = "0" + teamNumber;
            }
            return teamNumber;
        }

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

            // var encodedText = teamNumber + " " + fouled  + " " + deadBot + " " + cd.a + " " + cd.b + " " + cd.c + " " + cd.d + " " + ad.a + " " + ad.b + " " + ad.c + " " + ad.d + " " + ad.lowbar + " " + ad.grabBall + " " + aGoals.high.makes + " " + aGoals.high.misses + " " + aGoals.low.makes + " " + aGoals.low.misses + " " + bd.a.defense + " " + bd.a.makes + " " + bd.a.misses + " " + bd.b.defense + " " + bd.b.makes + " " + bd.b.misses + " " + bd.c.defense + " " + bd.c.makes + " " + bd.c.misses + " " + bd.d.defense + " " + bd.d.makes + " " + bd.d.misses + " " + bd.lowbar + " " + goals.high.makes + " " + goals.high.misses + " " + goals.low.makes + " " + goals.low.misses  + " " + timesBallPickedUp + " " + gameRoles.highShooting + " " + gameRoles.lowShooting + " " + gameRoles.breaching + " " + gameRoles.defending + " " + challengedTower + " " + scalingSuccessful;

            var encodedText = teamNumber + fouled  + deadBot + cd.a + cd.b + cd.c + cd.d + ad.a + ad.b + ad.c + ad.d + ad.lowbar + ad.grabBall + aGoals.high.makes + aGoals.high.misses + aGoals.low.makes + aGoals.low.misses + bd.a.defense + bd.a.makes + bd.a.misses + bd.b.defense + bd.b.makes + bd.b.misses + bd.c.defense + bd.c.makes + bd.c.misses + bd.d.defense + bd.d.makes + bd.d.misses + bd.lowbar + goals.high.makes + goals.high.misses + goals.low.makes + goals.low.misses  + timesBallPickedUp + gameRoles.highShooting + gameRoles.lowShooting + gameRoles.breaching + gameRoles.defending + challengedTower + scalingSuccessful;

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

        function decodeGame(encodedText) {
            // var values = encodedText.split(" ");
            var values = toArray(encodedText);
            for(var i = 0; i < values.length; i++) {
                values[i] = parseInt(values[i], 10);
                if($.inArray(i, [1, 2, 11, 12, 29, 35, 36, 37, 38, 39, 40]) !== -1) {
                    values[i] = (values[i]) ? "TRUE" : "FALSE";
                } else if ($.inArray(i, [3, 17]) !== -1) {
                    values[i] = (values[i]) ? "Cheval de Frise" : "Portcullis";
                } else if ($.inArray(i, [4, 20]) !== -1) {
                    values[i] = (values[i]) ? "Ramparts" : "Moat";
                } else if ($.inArray(i, [5, 23]) !== -1) {
                    values[i] = (values[i]) ? "Sally Port" : "Drawbridge";
                } else if ($.inArray(i, [6, 26]) !== -1) {
                    values[i] = (values[i]) ? "Rough Terrain" : "Rock Wall";
                } else if ($.inArray(i, [7, 8, 9, 10]) !== -1) {
                    if(values[i] === 0) values[i] = "Make";
                    if(values[i] === 1) values[i] = "Reach";
                    if(values[i] === 2) values[i] = "Miss";
                }
            }

            var finalRow = values.join(",");

            return finalRow;
        }

        function toGameArray(encodedText) {
            // encodedText = "1345101010121210110406031060810107104060030500709060909100110";
            var values = [
                encodedText.substr(0,4),//Team #
                encodedText.substr(4,1),//Single Digit
                encodedText.substr(5,1),
                encodedText.substr(6,1),
                encodedText.substr(7,1),
                encodedText.substr(8,1),
                encodedText.substr(9,1),
                encodedText.substr(10,1),
                encodedText.substr(11,1),
                encodedText.substr(12,1),
                encodedText.substr(13,1),
                encodedText.substr(14,1),
                encodedText.substr(15,1),

                encodedText.substr(16,2),//Goal Counts
                encodedText.substr(18,2),
                encodedText.substr(20,2),
                encodedText.substr(22,2),

                encodedText.substr(24,1),
                encodedText.substr(25,2),
                encodedText.substr(27,2),
                encodedText.substr(29,1),

                // 1345 1 0 1 0 1 0 1 2 1 2 1 0 11 04 06 03 1 06 08 1 #01 07 1 04 06 0 03 05 0 07 09 06 09 09 1 0 0 1 1 0
                encodedText.substr(30,2),
                encodedText.substr(32,2),
                encodedText.substr(34,1),
                encodedText.substr(35,2),
                encodedText.substr(37,2),
                encodedText.substr(39,1),
                encodedText.substr(40,2),
                encodedText.substr(42,2),
                encodedText.substr(44,1),

                encodedText.substr(45,2),
                encodedText.substr(47,2),
                encodedText.substr(49,2),
                encodedText.substr(51,2),
                encodedText.substr(53,2),

                encodedText.substr(55,1),
                encodedText.substr(56,1),
                encodedText.substr(57,1),
                encodedText.substr(58,1),
                encodedText.substr(59,1),
                encodedText.substr(60,1)
            ];

            return values;
        }
    }
};

app.initialize();
