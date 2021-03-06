var permanentStorage = window.localStorage;
var allGameData = "";
var allRandomKeys = [];
var app = {
    initialize: function() {
        $(document).on("deviceready", this.onDeviceReady);
    },
    onDeviceReady: function() {
        bindTabs();
        customizeMaterial();
        addRestrictions();
        addDefenseTooltips();
        addPlusMinusButtons();

        if(permanentStorage.getItem("csvData")) {
            var rows = permanentStorage.getItem("csvData").split("|");
            for(var i = 0; i < rows.length; i++) {
                addRow(rows[i]);
            }
        }

        if(permanentStorage.getItem("randomKeys")) {
            allRandomKeys = permanentStorage.getItem("randomKeys").split("|");
        }

        var pitFile;
        var gameFile;

        window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(dir) {
            dir.getFile("pitData.csv", {create:true}, function(file) {
                pitFile = file;
            });
        });
        window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(dir) {
            dir.getFile("gameData.csv", {create:true}, function(file) {
                gameFile = file;
                if(allGameData.length < 10) {
                    writeToFile("game", "Team number,Fouled,Dead bot,Chosen Defense A,Chosen Defense B,Chosen Defense C,Chosen Defense D,Auto Defense A,Auto Defense B,Auto Defense C,Auto Defense D,Auto Lowbar,Auto Grabbed ball,Auto High goal makes,Auto High goal misses,Auto Low goal makes,Auto Low goal misses,Breached Defense A,Breached Defense A makes,Breached Defense A misses,Breached Defense B,Breached Defense B makes,Breached Defense B misses,Breached Defense C,Breached Defense C makes,Breached Defense C misses,Breached Defense D,Breached Defense D makes,Breached Defense D misses,Breached Defense Lowbar,High goal makes,High goal misses,Low goal makes,Low goal misses,Ball picked up,High shooter,Low shooter,Breacher,Defender,Tower not weakened,Challenged Tower,Scaled");
                }
            });
        });

        function writeToFile(fileName, str) { // fileName is either "pit" or "game"
            str += "\n";
            var file = (fileName === "game") ? gameFile : pitFile;
            file.createWriter(function(fileWriter) {
                fileWriter.seek(fileWriter.length);
                var blob = new Blob([str], {type:'text/plain'});
                fileWriter.write(blob);
            });
        }

        $(".generateQR").click(function() {
            if($(this).hasClass("game")) { // game
                $("#qrResult").empty();
                var data = getGameData();
                $("#qrResult").append("<img src='" + qr.toDataURL(data) + "' />");
            } else { // pit
                var pitData = getPitData();
                writeToFile("pit", pitData);
                alert("Successful " + pitData);
            }
        });

        $("#decodeQR").click(function() {
            cordova.plugins.barcodeScanner.scan(
                function(result) {
                    if(!result.cancelled) {
                        var encodedText = result.text.substr(8, result.text.length);
                        var randomKey = result.text.substr(1, 7);
                        if($.inArray(randomKey, allRandomKeys) === -1) { // if random key not in allRandomKeys array
                            if(result.text.charAt(0) === "G") {
                                var finalGameRow = decodeGame(encodedText);
                                var teamNumber = +finalGameRow.substr(0, 4);
                                alert("Scanned team " + teamNumber + " successfully: " + finalGameRow);
                                writeToFile("game", finalGameRow);
                            } else {
                                // var finalPitRow = decodePit(encodedText);
                                alert("Oh no something went wrong, tell Vishal he messed up");
                                // writeToFile("pit", finalPitRow);
                            }
                            addUsedKey(randomKey);
                        } else {
                            alert("This QR code has already been scanned.");
                        }
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

            var defenses = {
                portcullis: isChecked("psPortcullis"),
                chevalDeFrise: isChecked("psChevalDeFrise"),
                moat: isChecked("psMoat"),
                ramparts: isChecked("psRamparts"),
                drawbridge: isChecked("psDrawbridge"),
                sallyPort: isChecked("psSallyPort"),
                rockWall: isChecked("psRockWall"),
                roughTerrain: isChecked("psRoughTerrain"),
                lowbar: isChecked("psLowbar")
            };

            var shooting = {
                high: isChecked("psHighGoals"),
                low: isChecked("psLowGoals"),
                grabBall: isChecked("psGrabBall")
            };

            var roles = {
                highShooting : isChecked("psHighShootingSpecialty"),
                lowShooting : isChecked("psLowShootingSpecialty"),
                breaching : isChecked("psBreachingSpecialty"),
                defending : isChecked("psDefendingSpecialty")
            };

            var wheelType = getRadio("wheelType");
            var pickupType = getRadio("pickupType");

            var encodedText = [teamNumber, defenses.portcullis, defenses.chevalDeFrise, defenses.moat, defenses.ramparts, defenses.drawbridge, defenses.sallyPort, defenses.rockWall, defenses.roughTerrain, defenses.lowbar, shooting.high, shooting.low, shooting.grabBall, roles.highShooting, roles.lowShooting, roles.breaching, roles.defending, wheelType, pickupType];

            encodedText[0] = parseInt(encodedText[0], 10);
            for(var i = 1; i < encodedText.length - 2; i++) {
                encodedText[i] = (encodedText[i] === "1") ? "TRUE" : "FALSE";
            }

            return encodedText.join(",");
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

            var towerNotWeakened = isChecked("towerNotWeakened");
            var challengedTower = isChecked("challengedTower");
            var scalingSuccessful = isChecked("scalingSuccessful");

            var encodedText = "G" + getRandom() + teamNumber + fouled  + deadBot + cd.a + cd.b + cd.c + cd.d + ad.a + ad.b + ad.c + ad.d + ad.lowbar + ad.grabBall + aGoals.high.makes + aGoals.high.misses + aGoals.low.makes + aGoals.low.misses + bd.a.defense + bd.a.makes + bd.a.misses + bd.b.defense + bd.b.makes + bd.b.misses + bd.c.defense + bd.c.makes + bd.c.misses + bd.d.defense + bd.d.makes + bd.d.misses + bd.lowbar + goals.high.makes + goals.high.misses + goals.low.makes + goals.low.misses  + timesBallPickedUp + gameRoles.highShooting + gameRoles.lowShooting + gameRoles.breaching + gameRoles.defending + towerNotWeakened + challengedTower + scalingSuccessful;

            return encodedText;
        }

        function getRadio(groupName) {
            if($('input[name="' + groupName + '"]:checked').length) {
                return $('input[name="' + groupName + '"]:checked')[0].value;
            } else {
                if(groupName.indexOf("cdCat") === -1) {
                    alert("Field " + groupName + " not filled out.");
                    return "X";
                }
                return "9";
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

    }
};

// function decodePit(encodedText) {
//     var values = encodedText.split(" ");
//     values[0] = parseInt(values[0], 10);
//     for(var i = 1; i < values.length - 2; i++) {
//         values[i] = (values[i] === "1") ? "TRUE" : "FALSE";
//     }
//
//     var wheelType = values[values.length-1];
//     if(wheelType === "TractionWheels") {
//         values[values.length-1] = "Traction Wheels";
//     } else if(wheelType === "OmniWheels") {
//         values[values.length-1] = "Omni Wheels";
//     } else if(wheelType === "MecanumWheels") {
//         values[values.length-1] = "Mecanum Wheels";
//     } else {
//         values[values.length-1] = "Other Wheels";
//     }
//
//     var pickupType = values[values.length-2];
//     if(pickupType === "WidePickup") {
//         values[values.length-2] = "Wide Pickup";
//     } else if(pickupType === "SmallPickup") {
//         values[values.length-2] = "Small Pickup";
//     } else {
//         values[values.length-2] = "Other Pickup";
//     }
//
//     var finalRow = values.join(",");
//     return finalRow;
// }

function toGameArray(encodedText) { // Daniel's code below. No touch danger zone
    var values = [
        encodedText.substr(0,4), // Team number
        encodedText.substr(4,1), // Single digit
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

        encodedText.substr(16,2), // Goal counts
        encodedText.substr(18,2),
        encodedText.substr(20,2),
        encodedText.substr(22,2),

        encodedText.substr(24,1),
        encodedText.substr(25,2),
        encodedText.substr(27,2),
        encodedText.substr(29,1),

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
        encodedText.substr(60,1),
        encodedText.substr(61,1)
    ];

    return values;
}

function decodeGame(encodedText) {
    var values = toGameArray(encodedText);
    for(var i = 0; i < values.length; i++) {
        values[i] = parseInt(values[i], 10);
        if($.inArray(i, [1, 2, 11, 12, 29, 35, 36, 37, 38, 39, 40, 41]) !== -1) {
            values[i] = (values[i]) ? "TRUE" : "FALSE";
        } else if ($.inArray(i, [3, 17]) !== -1) {
            if(values[i] === 9) {
                values[i] = "X";
            } else {
                values[i] = (values[i]) ? "Cheval de Frise" : "Portcullis";
            }
        } else if ($.inArray(i, [4, 20]) !== -1) {
            if(values[i] === 9) {
                values[i] = "X";
            } else {
                values[i] = (values[i]) ? "Ramparts" : "Moat";
            }
        } else if ($.inArray(i, [5, 23]) !== -1) {
            if(values[i] === 9) {
                values[i] = "X";
            } else {
                values[i] = (values[i]) ? "Sally Port" : "Drawbridge";
            }
        } else if ($.inArray(i, [6, 26]) !== -1) {
            if(values[i] === 9) {
                values[i] = "X";
            } else {
                values[i] = (values[i]) ? "Rough Terrain" : "Rock Wall";
            }
        } else if ($.inArray(i, [7, 8, 9, 10]) !== -1) {
            if(values[i] === 0) values[i] = "Make";
            if(values[i] === 1) values[i] = "Reach";
            if(values[i] === 2) values[i] = "Miss";
        }
    }

    var finalRow = values.join(",");

    addRow(finalRow);
    updateStorage();

    return finalRow;
}

function addRow(csvRow) {
    var htmlRow = "<tr><td>" + csvRow.split(",").join("</td><td>") + "</td></tr>";
    $("#data tbody").append(htmlRow);

    if(allGameData.length) allGameData += "|";
    allGameData += csvRow;
}

function updateStorage() {
    permanentStorage.setItem("csvData", allGameData);
}

function addUsedKey(key) {
    allRandomKeys.push(key);
    permanentStorage.setItem("randomKeys", allRandomKeys.join("|"));
}

function bindTabs() {
    $("#tabsContainer div").click(function() {
        $("#app").attr("class", $(this).attr("id") + "Active");
    });
}

function customizeMaterial() {
    $('input[type="checkbox"]').addClass("filled-in");
}

function addRestrictions() {
    var teams = [];
    teams[492] = "Titan Robotics Club";
    teams[568] = "Nerds of the North";
    teams[948] = "Newport Robotics Group (NRG)";
    teams[1294] = "Top Gun";
    teams[1778] = "Chill Out";
    teams[2605] = "Sehome Seamonsters";
    teams[2660] = "Pengbots";
    teams[2903] = "NeoBots";
    teams[2907] = "Lion Robotics";
    teams[2928] = "Viking Robotics";
    teams[2976] = "Spartabots!!!";
    teams[2980] = "The Whidbey Island Wild Cats";
    teams[3070] = "Team Pronto";
    teams[3238] = "Cyborg Ferrets";
    teams[3268] = "Vahallabots";
    teams[3574] = "HIGH TEKERZ";
    teams[3663] = "CPR";
    teams[3681] = "Robo-Raiders";
    teams[3826] = "Sequim Robotics Federation (SRF)";
    teams[4030] = "NullPointerException";
    teams[4060] = "S.W.A.G.";
    teams[4077] = "M*A*S*H";
    teams[4089] = "Stealth Robotics";
    teams[4173] = "Bulldogs";
    teams[4180] = "Iron Riders";
    teams[4205] = "ROBOCUBS";
    teams[4512] = "BEARbots";
    teams[4654] = "Mountaineers";
    teams[4682] = "BraveBots";
    teams[4683] = "Full-metal Robotics";
    teams[4911] = "CyberKnights";
    teams[4915] = "Spartronics";
    teams[4918] = "The Roboctopi";
    teams[5495] = "Aluminati";
    teams[5748] = "Adna Pirates";

    $("button.clear").click(function() {
        $("input").attr("checked", false);
        $(".makes, .misses, .counter").html("0");
        $("#gameTeamNumber").val("");
        $("#autonomous input[type=radio][value=2]").prop("checked", "checked");
        $("#qrResult").html("");
        alert("Cleared");
    });

    $("#pitTeamNumber, #gameTeamNumber").change(function() {
        var teamNumber = $(this).val().substr(0, 4); // keep only first 4 digits
        $(this).val(teamNumber);

        var teamName = teams[teamNumber];
        if(!teamName) teamName = "???";
        $(this).siblings("span").html("Team " + teamNumber + ": <strong>" + teamName + "</strong>");
    });

    $("#playedAgainstUs ~ fieldset input").prop("disabled", true);
    $("#playedAgainstUs").change(function() {
        $("#playedAgainstUs ~ fieldset input").prop("checked", false);
        $("#playedAgainstUs ~ fieldset input").prop("disabled", !$("#playedAgainstUs ~ fieldset input").prop("disabled"));
    });
}

function addDefenseTooltips() {
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
}

function addPlusMinusButtons() {
    var breachedDefenses = $(".game.view .defenses.breached");
    var buttonHTML = "<button class='btn waves-effect red waves-light minus'></button><button class='btn waves-effect green waves-light plus'></button>";
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
}

function getRandom() { // returns a random 7 digit random number
    return Math.floor(Math.random()*8999999+1000000);
}
app.initialize();
