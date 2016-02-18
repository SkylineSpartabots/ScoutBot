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
            var data = getGameData();
            var qrcode = new QRCode(qrResult, data);
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

        function getGameData() {
            var teamNumber = +$("#gameTeamNumber").val();
            var fouled = isChecked("fouled");
            var deadBot = isChecked("deadBot");

            var cd = {
                a: getRadio("cdCatA"),
                b: getRadio("cdCatB"),
                c: getRadio("cdCatC"),
                d: getRadio("cdCatD")
            };

            var ad = {
                a: [
                    getRadio("autoDefensePortcullis"),
                    getRadio("autoDefenseChevalDeFrise")
                ],
                b: [
                    getRadio("autoDefenseMoat"),
                    getRadio("autoDefenseRamparts")
                ],
                c: [
                    getRadio("autoDefenseDrawbridge"),
                    getRadio("autoDefenseSallyPort")
                ],
                d: [
                    getRadio("autoDefenseRockWall"),
                    getRadio("autoDefenseRoughTerrain")
                ],
                lowbar: isChecked("adLowbar"),
                grabBall: isChecked("adGrabBall")
            };

            var aGoals = {
                high: {
                    makes: $("#autonomous .highGoals .goals.makes").text(),
                    misses: $("#autonomous .highGoals .goals.misses").text()
                },
                low: {
                    makes: $("#autonomous .lowGoals .goals.makes").text(),
                    misses: $("#autonomous .lowGoals .goals.misses").text()
                }
            };

            var bd = {
                a: {
                    defense: getRadio("bdCatA"),
                    makes: $(".bdCatA.makes").text(),
                    misses: $(".bdCatA.misses").text()
                },
                b: {
                    defense: getRadio("bdCatB"),
                    makes: $(".bdCatB.makes").text(),
                    misses: $(".bdCatB.misses").text()
                },
                c: {
                    defense: getRadio("bdCatC"),
                    makes: $(".bdCatC.makes").text(),
                    misses: $(".bdCatC.misses").text()
                },
                d: {
                    defense: getRadio("bdCatD"),
                    makes: $(".bdCatD.makes").text(),
                    misses: $(".bdCatD.misses").text()
                },
                lowbar: isChecked("bdLowbar")
            };

            var goals = {
                high: {
                    makes: $(".nonAutonomous .highGoals .goals.makes").text(),
                    misses: $(".nonAutonomous .highGoals .goals.misses").text()
                },
                low: {
                    makes: $(".nonAutonomous .lowGoals .goals.makes").text(),
                    misses: $(".nonAutonomous .lowGoals .goals.misses").text()
                }
            };

            var gameRoles = {
                highShooting : isChecked("gameHighShootingSpecialty"),
                lowShooting : isChecked("gameLowShootingSpecialty"),
                breaching : isChecked("gameBreachingSpecialty"),
                defending : isChecked("gameDefendingSpecialty")
            };

            var challengedTower = isChecked("challengedTower");
            var scalingSuccessful = isChecked("scalingSuccessful");

            return teamNumber + " " + fouled  + " " + deadBot + " " +  cd.a + " " + cd.b + " " + cd.c + " " + cd.d + " " + ad.a[0] + " " + ad.a[1] + " " + ad.b[0] + " " + ad.b[1] + " " + ad.c[0] + " " + ad.c[1] + " " + ad.d[0] + " " + ad.d[1]  + " " + ad.lowbar + " " + ad.grabBall + " " + aGoals.high.makes + " " + aGoals.high.misses + " " + aGoals.low.makes + " " + aGoals.low.misses + " " + bd.a.defense + " " + bd.a.makes + " " + bd.a.misses + " " + bd.b.defense + " " + bd.b.makes + " " + bd.b.misses + " " + bd.c.defense + " " + bd.c.makes + " " + bd.c.misses + " " + bd.d.defense + " " + bd.d.makes + " " + bd.d.misses + " " + bd.lowbar + " " + goals.high.makes + " " + goals.high.misses + " " + goals.low.makes + " " + goals.low.misses + " " + gameRoles.highShooting + " " + gameRoles.lowShooting + " " + gameRoles.breaching + " " + gameRoles.defending + " " + challengedTower + " " + scalingSuccessful;
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
    }
};

app.initialize();
