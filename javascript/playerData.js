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
                <td>` + player.Vehicle + `</td>
                <td><b>Street:</b> ` + location[0] + `<br><b>County:</b> ` + location[1] + `</td>
            </tr>`
        );


        $('#leoTable').append(
            `<tr id="` + player.name + `LEO">
                <td>` + player.name + `</td>
            </tr>`
        );

    } else {
        var info = document.getElementById(player.name).children;
        for (var i = 1; i < 3; i++) {
            $(info[i]).empty()
        }

        $(info[1]).append(player.Vehicle);
        $(info[2]).append("<b>Street:</b> " + location[0] + "<br><b>County:</b> " + location[1]);

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

function handleSocketData(data) {
    playerCount.leo = 0;
    playerCount.civ = 0;
    var payload = JSON.parse(data);
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
                var cases = ['', 'LEO', 'CIV'];

                for (var i = 0; i < 3; i++) {
                    var c = document.getElementById(curr + cases[i]);

                    if (c != null) {
                        c.remove();
                        break;
                    }
                }
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