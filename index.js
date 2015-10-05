var args = process.argv;

var MIN_LIGHT = 0;
var MAX_LIGHT = 310;

validateArgs(args);

var weapons = getWeapons(args);



console.log(weapons);

function validateArgs(args) {
    if (args.length <= 3) {
        console.error('Please enter the apropriate amount of arguments.');
        process.exit(1);
    }
    var regex = new RegExp("^[elr][1-9][0-9]{0,2}$");
    for (var i = 2; i < args.length; i++) {
        if (regex.test(args[i]) === false) {
            console.error('The argument \'' + args[i] + '\' is malformed.');
            process.exit(1);
        }
    }
}

function getWeapons() {
    var result = [];
    for (var i = 2; i < args.length; i++) {
        var rarity = args[i].substring(0, 1);
        var light = parseInt(args[i].substring(1, args[i].length));

        if (light < MIN_LIGHT || light > MAX_LIGHT) {
            console.error(light + ' does not fall within set light constraints of ' + MIN_LIGHT + ' and ' + MAX_LIGHT);
            process.exit(1);
        } else {
            result.push([rarity, light]);
        }
    }
    return result;
}

