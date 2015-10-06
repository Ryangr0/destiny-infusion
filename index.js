var args = process.argv;

var MIN_LIGHT = 0;
var MAX_LIGHT = 310;

var PENALTIES = [];
PENALTIES['r'] = 0.8;
PENALTIES['l'] = 0.8;
PENALTIES['e'] = 0.7;

var THRESHOLD = [];
THRESHOLD['main'] = [];
THRESHOLD['fodder'] = [];

THRESHOLD['main']['r'] = 5;
THRESHOLD['main']['l'] = 5;
THRESHOLD['main']['e'] = 3;

THRESHOLD['fodder']['r'] = 1;
THRESHOLD['fodder']['l'] = 1;
THRESHOLD['fodder']['e'] = 2;

var MARKS = 3;
var SHARDS = 1;

var totalCosts = {
    'marks' : 0,
    'shards': 0
}

validateArgs(args);
var weapons = getWeapons(args);
infuse(weapons);

console.log('Total costs: Marks: ' + totalCosts.marks + ', Shards: ' + totalCosts.shards);


/**
 * Simulates infusion of all weapons
 * @param weapons
 */
function infuse(weapons) {
    var mainWeapon = weapons[0];
    weapons.shift();
    weapons.forEach(function (fodder, index, array) {
        var diff = fodder.light - mainWeapon.light;
        if (diff > 0) {
            var threshold = THRESHOLD['main'][mainWeapon.rarity] + THRESHOLD['fodder'][fodder.rarity];
            var oldLight = mainWeapon.light;
            var increasedLight = diff;
            if (diff > threshold) {
                increasedLight = Math.round(diff * PENALTIES[mainWeapon.rarity]);
            }
            mainWeapon.light += increasedLight;
            var costShards = fodder.rarity === 'e' ? SHARDS : 0;
            var costMarks = (fodder.rarity === 'e' || fodder.rarity === 'l') ? MARKS : 0;

            totalCosts.marks += costMarks;
            totalCosts.shards += costShards;
            console.log('Main weapon has gone from ' + oldLight + ' to ' + mainWeapon.light + '. Marks: ' + costMarks + ', Shards: ' + costShards);
        } else {
            console.log('Max light of ' + mainWeapon.light + ' reached after infusing ' + fodder.rarity + fodder.light);
            return;
        }
    });
}

/**
 * Makes sure the given arguments are valid.
 * @param args
 */
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

/**
 * Formats the arguments into a workable format.
 * @returns {Array}
 */
function getWeapons() {
    var result = [];
    for (var i = 2; i < args.length; i++) {
        var rarity = args[i].substring(0, 1);
        var light = parseInt(args[i].substring(1, args[i].length));

        if (light < MIN_LIGHT || light > MAX_LIGHT) {
            console.error(light + ' does not fall within set light constraints of ' + MIN_LIGHT + ' and ' + MAX_LIGHT);
            process.exit(1);
        } else {
            result.push({
                'rarity': rarity,
                'light' : light
            });
        }
    }
    return result;
}

