console.log('Starting Apelsintm balancer');

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://code.jquery.com/jquery-2.2.4.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

var cities = {
    1: { n: 1051, min: null, max: null },
    2: { n: 1052, min: null, max: null },
    3: { n: 1053, min: null, max: null },
    4: { n: 1054, min: null, max: null },
    5: { n: 1055, min: null, max: null },
    6: { n: 1056, min: null, max: null },
    7: { n: 1057, min: null, max: null },
    8: { n: 1058, min: null, max: null },
    9: { n: 1059, min: null, max: null },
    10: { n: 1060, min: null, max: null },
    11: { n: 1061, min: null, max: null },
    12: { n: 1069, min: null, max: null },
    13: { n: 1213, min: null, max: null },
    14: { n: 1345, min: null, max: null },
    15: { n: 1373, min: null, max: null },
    16: { n: 1384, min: null, max: null },
    17: { n: 1392, min: null, max: null },
    18: { n: 1393, min: null, max: null },
    19: { n: 1394, min: null, max: null },
    20: { n: 1395, min: null, max: null },
    21: { n: 1421, min: null, max: null },
    22: { n: 1438, min: null, max: null }
};

var options = {};
function restore_options() {
    var default_options = {
        interval: 5,
        step: 100
    };
    for (var i = 1; i <= 21; i++) {
        default_options['g' + i + 'min'] = 10000;
        // default_options['g' + i + 'max'] = 100000;
    }
    chrome.storage.sync.get(default_options, function(items) {
        options['interval'] = items.interval;
        options['step'] = items.step;
        for (var i = 1; i <= 21; i++) {
            options['g' + i + 'min'] = items['g' + i + 'min'];
            // options['g' + i + 'max'] = items['g' + i + 'max'];

            cities[i]['min'] = items['g' + i + 'min'];
            cities[i]['max'] = items['g' + i + 'max'];
        }
        console.log('Options updated:');
        console.log(options)
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
restore_options();


console.log(cities);


$(function() {
    $.each(cities, function (num, city_options) {
        console.log('Check group ' + num);
        console.log(city_options);

        var current_amount = getCityAmount(num);
        console.log(current_amount);
        if(current_amount <= city_options['min']) {
            console.log('Fix');
        } else {
            console.log('Ok');
        }
    });

});

function getCityAmount(num) {
    var line = $("tr:contains('Группа " + num + ". ')");
    return parseFloat($("td:nth-child(2)", line).text());
}
