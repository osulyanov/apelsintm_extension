console.log('Starting Apelsintm balancer');

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://code.jquery.com/jquery-2.2.4.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

var cities = {
    1: {n: 1051, min: null, max: null},
    2: {n: 1052, min: null, max: null},
    3: {n: 1053, min: null, max: null},
    4: {n: 1054, min: null, max: null},
    5: {n: 1055, min: null, max: null},
    6: {n: 1056, min: null, max: null},
    7: {n: 1057, min: null, max: null},
    8: {n: 1058, min: null, max: null},
    9: {n: 1059, min: null, max: null},
    10: {n: 1060, min: null, max: null},
    11: {n: 1061, min: null, max: null},
    12: {n: 1069, min: null, max: null},
    13: {n: 1213, min: null, max: null},
    14: {n: 1345, min: null, max: null},
    15: {n: 1373, min: null, max: null},
    16: {n: 1384, min: null, max: null},
    17: {n: 1392, min: null, max: null},
    18: {n: 1393, min: null, max: null},
    19: {n: 1394, min: null, max: null},
    20: {n: 1395, min: null, max: null},
    21: {n: 1421, min: null, max: null},
    22: {n: 1438, min: null, max: null}
};

var options = {};

function restore_options() {
    var default_options = {
        interval: 5,
        step: 100
    };
    for (var i = 0; i <= 21; i++) {
        default_options['g' + i + 'min'] = 10000;
    }
    chrome.storage.sync.get(default_options, function (items) {
        console.log(items);
        options['interval'] = items.interval;
        options['step'] = items.step;
        for (var i = 0; i <= 21; i++) {
            options['g' + i + 'min'] = items['g' + i + 'min'];
            if(i > 0) {
                cities[i]['min'] = items['g' + i + 'min'];
            }
        }
        console.log('Options updated:');
        console.log(options)
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
restore_options();

$(function () {
    if($('a:contains("Группа 0. Супергруппа")').is('a')) {
        checkSupergroup();
        checkGroups();
    }
});

function checkSupergroup() {
    console.log('Start balancing at ' + currentTime());
    console.group('Check group 0');
    var current_amount = getCityAmount(0);
    console.log(current_amount);
    var minAmount = options['g0min'];
    if (current_amount <= minAmount) {
        var desired_amount = (minAmount * 100 - current_amount * 100 + options['step'] * 100) / 100;
        console.warn('Fix: add ' + desired_amount);
        // addAmount(city_options['n'], desired_amount);
    } else {
        console.log('Ok');
    }
    console.groupEnd();
}

function checkGroups() {
    $.each(cities, function (num, city_options) {
        console.group('Check group ' + num);
        console.log(city_options);
        if (city_options['min'] <= 0) {
            console.log('Off');
            console.groupEnd();
            return true;
        }

        var current_amount = getCityAmount(num);
        console.log(current_amount);
        if (current_amount <= city_options['min']) {
            var desired_amount = (city_options['min'] * 100 - current_amount * 100 + options['step'] * 100) / 100;
            console.warn('Fix: add ' + desired_amount);
            addAmount(city_options['n'], desired_amount);
        } else {
            console.log('Ok');
        }
        console.groupEnd();
    });

    $('b:contains("Список групп")').text('Список групп (Последняя балансировка завершена в ' + currentTime() + ')');

    var interval = options['interval'] * 60 * 1000;
    console.log('Retry in ' + interval + ' milliseconds');
    setTimeout(function () {
        location.reload();
    }, interval);
}

function addAmount(n, amount) {
    var url = '?actionName=add_balance_subdealer&sub=' + n;
    var data = {
        comment: '',
        amount_add: amount,
        type_pay: 'bank',
        balance_add: ''
    };

    $.ajax({
        type: "POST",
        url: url,
        cache: false,
        data: data,
        complete: function (xhr, status) {
            console.log('Completed with status: ' + status);
        }
    });
}

function getCityAmount(num) {
    var line = $("table table table tr:contains('Группа " + num + ". ')");
    return parseFloat($("td:nth-child(2)", line).text());
}

function currentTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    return h + ":" + m + ":" + s;
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
