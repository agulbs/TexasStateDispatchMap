var playerData = {}

// TODO: automate this list
var playerDept = {
    // Texas DPS
    '[1D-14] Jango': '#txdpsTable',
    '[1D-23] Cy': '#txdpsTable',
    '[1D-56] Townly': '#txdpsTable',
    '[1D-96] J.Mcflint': '#txdpsTable',
    '[1D-13] Ashton.M': '#txdpsTable',
    '[1D-18] Porter': '#txdpsTable',
    '[1D-21] Silva': '#txdpsTable',
    '[1D-22] Northrup': '#txdpsTable',
    '[1D-24] New': '#txdpsTable',
    '[1D-28] James': '#txdpsTable',
    '[1D-33] Warren.J': '#txdpsTable',
    '[1D-36] Scott': '#txdpsTable',
    '[1D-40] Bako': '#txdpsTable',
    '[1D-41] Benson': '#txdpsTable',
    '[1D-53] Christian': '#txdpsTable',
    '[1D-70] Manuel': '#txdpsTable',
    '[1D-72] Mayhem': '#txdpsTable',
    '[1D-72] Polo': '#txdpsTable',

    // Webb County Sherrifs Office
    '[1C-01] Carson': '#wcsoTable',
    '[1C-03] Jacob': '#wcsoTable',
    '[1C-13] Holder': '#wcsoTable',
    '[1C-16] Brown': '#wcsoTable',
    '[1C-38] Miller': '#wcsoTable',
    '[1C-51] Evans': '#wcsoTable',
    '[1C-63] Brian': '#wcsoTable',
    '[1C-75] R. Johnson': '#wcsoTable',
    '[1C-76] Zack': '#wcsoTable',
    '[1C-85] J. Favio': '#wcsoTable',
    '[1C-13] Holder': '#wcsoTable',
    '[1C-77] Ace': '#wcsoTable',
    '[1C-77] Cling': '#wcsoTable',
    '[1C-83] Chestbrench': '#wcsoTable',
    '[1K-42] Ryan': '#wcsoTable',
    '[1C-35] S. Valdes': '#wcsoTable',

    // Fire EMS
    '<LT> [1A-26] Hervey': '#femsTable',
    '[1A-12] Ramirez': '#femsTable',
    '[1A-29] Caraker': '#femsTable',
    '[1A-34] Park': '#femsTable',
    '[1A-63] Ricky Phantom': '#femsTable',
    '[1A-93] Morris': '#femsTable',
    '[1A-30] Waldo Ableton': '#femsTable',
    '[1A-64] Shades': '#femsTable',
    '[1A-65] Coopy': '#femsTable',
    '[1A-77] Allen': '#femsTable',
}

function renderTables(player, id) {
    var location = player.Location.split(',');

    if (!document.getElementById(player.name)) {
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
    var payload = JSON.parse(msg.data);
    var players = {};

    try {
        payload.payload.forEach(player => {
            players[player.name] = player;
            playerData[player.name] = player;
        });



        curr_players = Object.keys(players)
            .concat(Object.keys(playerData))
            .sort()
            .reduce((r, a, i, aa) => {
                if (i && aa[i - 1] === a) {
                    r[a] = players[a];
                }
                return r;
            }, {});

        for (curr in curr_players) {
            if (!(curr in players)) {
                var c = document.getElementById(curr);
                c.remove();
            }

            renderTables(players[curr], playerDept[curr])
        }
    } catch (error) {
        console.log(error);
    }
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

});
