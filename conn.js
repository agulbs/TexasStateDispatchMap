var playerData = {}
var playerCount = {
    leo: 0,
    civ: 0
}

// callsign dept breakdown
var playerDept = {
    '[1D-': '#txdpsTable',
    '[1C-': '#wcsoTable',
    '[1A-': '#femsTable',
    '<LT>': '#femsTable'
}

// renders table that holds all LEO data
function renderLeoTables(player, id) {
    var location = player.Location.split(',');

    if (!document.getElementById(player.name) && !document.getElementById(player.name + 'LEO')) {
        $(id).append(
            `<tr id="` + player.name + `">
                <td>` + player.name + `</td>
                <td>` + player.Weapon + `</td>
                <td>` + player.Vehicle + `</td>
                <td>` + player['Licence Plate'] + `</td>
                <td><b>Street:</b> ` + location[0] + `<br><b>County:</b> ` + location[1] + `</td>
                <td><b>x:</b> ` + player.pos.x + `<br><b>y</b>: ` + player.pos.y + `<br><b>z</b>: ` + player.pos.z + `</td>
            </tr>`
        );


        $('#leoTable').append(
            `<tr id="` + player.name + `LEO">
                <td>` + player.name + `</td>
            </tr>`
        );

    } else {
        var info = document.getElementById(player.name).children;
        for (var i = 1; i < 6; i++) {
            $(info[i]).empty()
        }

        $(info[1]).append(player.Weapon);
        $(info[2]).append(player.Vehicle);
        $(info[3]).append(player['Licence Plate']);
        $(info[4]).append("<b>Street:</b> " + location[0] + "<br><b>County:</b> " + location[1]);
        $(info[5]).append("<b>x:</b> " + player.pos.x + "<br><b>y</b>: " + player.pos.y + "<br><b>z</b>: " + player.pos.z);

        // var info = document.getElementById(player.name + 'LEO').children;
        // $(info[0]).empty();
        // $(info[0]).append(player.name);
        // playerCount.leo -= 1;
        // playerCount.leo += 1;
    }
}

function renderCivTable(player) {
    if (!document.getElementById(player.name + 'CIV')) {
        $('#civTable').append(
            `<tr id="` + player.name + `CIV">
                <td>` + player.name + `</td>
            </tr>`
        );
    }
}

// websocket setup
function websocketWaiter() {
    setTimeout(() => {
        // TODO: Load from config file
        socket = new WebSocket("ws://172.83.159.155:30121");
        socket.onopen = socketOnOpen;
        socket.onclose = socketOnClose;
        socket.onmessage = socketOnMessage;
        socket.onerror = socketOnError;
    }, 1000)
}

var socketOnOpen = (msg) => {
    console.log("Websocket opened.");
}

var socketOnClose = (msg) => {
    console.log("Websocket disconnected - waiting for connection.");
}

var socketOnError = (msg) => {
    console.log(msg)
}

var socketOnMessage = (msg) => {
    playerCount.leo = 0;
    playerCount.civ = 0;
    var payload = JSON.parse(msg.data);
    var players = {};

    try {
        payload.payload.forEach(player => {
            players[player.name] = player;
            playerData[player.name] = player;
        });

        // filter out players, save active players
        curr_players = Object.keys(players)
            .concat(Object.keys(playerData))
            .sort()
            .reduce((r, a, i, aa) => {
                if (i && aa[i - 1] === a) {
                    r[a] = players[a];
                }
                return r;
            }, {});

        delete playerData['undefined'];

        for (curr in playerData) {
            if (!(curr in players)) {
                var c = document.getElementById(curr);

                if (c == null)
                    c = document.getElementById(curr + 'LEO');
                if (c == null)
                    c = document.getElementById(curr + 'CIV');

                c.remove();
            } else {

                var pd = curr.substring(0, 4);

                // check if theyre leo
                if (pd in playerDept) {
                    playerCount.leo += 1;
                    renderLeoTables(players[curr], playerDept[pd]);
                } else {
                    playerCount.civ += 1;
                    renderCivTable(players[curr]);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

    // set the player counts
    $('#leoTotal')[0].innerText = playerCount.leo;
    $('#civTotal')[0].innerText = playerCount.civ;
    $('#civLeoTotal')[0].innerText = playerCount.leo + playerCount.civ;

}

$(document).ready(function() {
    websocketWaiter();

    $("#txInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#txdpsTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#wcInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#wcsoTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#feInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#femsTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#civInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#civTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#leoInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#leoTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

});