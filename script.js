// подключаем jQuery
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://code.jquery.com/jquery-2.2.4.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

// массив всех групп
var cities = {
    0: {min: null},
    1: {n: 1051, min: null, current: null},
    2: {n: 1052, min: null, current: null},
    3: {n: 1053, min: null, current: null},
    4: {n: 1054, min: null, current: null},
    5: {n: 1055, min: null, current: null},
    6: {n: 1056, min: null, current: null},
    7: {n: 1057, min: null, current: null},
    8: {n: 1058, min: null, current: null},
    9: {n: 1059, min: null, current: null},
    10: {n: 1060, min: null, current: null},
    11: {n: 1061, min: null, current: null},
    12: {n: 1069, min: null, current: null},
    13: {n: 1213, min: null, current: null},
    14: {n: 1345, min: null, current: null},
    15: {n: 1373, min: null, current: null},
    16: {n: 1384, min: null, current: null},
    17: {n: 1392, min: null, current: null},
    18: {n: 1393, min: null, current: null},
    19: {n: 1394, min: null, current: null},
    20: {n: 1395, min: null, current: null},
    21: {n: 1421, min: null, current: null},
    22: {n: 1438, min: null, current: null}
};

// сохранённые в настройках опции
var options = {};
// если настройки расширения меняются, получим их
document.addEventListener('DOMContentLoaded', restore_options);
// получим настройк ирасширения
restore_options();

$(function () {
    // исли мы на странице с группами ,проведём балансировку
    if ($('a:contains("Группа 0. Супергруппа")').is('a')) {
        console.log('Cities data: ', cities);
        checkGroups();
    }
});

// получим настройки расширения и заполним массив групп
function restore_options() {
    // настройки по умолчанию
    var default_options = {
        interval: 5,
        step: 0
    };
    // добавим настройки по умолчанию для групп
    for (var i = 0; i <= 22; i++) { default_options['g' + i + 'min'] = 0; }
    // получим настройки расширения из хранилища Хрома
    chrome.storage.sync.get(default_options, function (items) {
        console.log('Saved options: ', items);
        options['interval'] = items.interval;
        options['step'] = items.step;
        for (var i = 0; i <= 22; i++) {
            options['g' + i + 'min'] = items['g' + i + 'min'];
            cities[i]['min'] = items['g' + i + 'min'];
            cities[i]['current'] = getCityAmount(i);
        }
        console.log('Options updated: ', options);
    });
}

// пройдёмся по всем группам и отбалансируем, если нужно
function checkGroups() {
    // пройдёмся по всем группам
    $.each(cities, function (i, city_options) {
        console.group('Check group ' + i + ' with options: ', city_options);

        // если группа выключена в настройках расширения, пропустим её
        if (city_options['min'] <= 0) {
            console.log('Off');
            console.groupEnd();
            return true;
        }

        // получим текущую сумму на счету группы
        var current_amount = city_options['current'];
        console.log('Current amount: ', current_amount);

        if (current_amount <= city_options['min']) {
            // текущая сумма меньше или равна неснижаемому остатку этой группы
            // посчитаем профицит группы + шаг балансировки
            var shortage_amount = (city_options['min'] * 100 - current_amount * 100 + options['step'] * 100) / 100;
            console.warn('Fix: add ' + shortage_amount);
            // отбалансируем группу
            var result = fixGroup(i, shortage_amount);
            // если отбалансировать не удалось
            // (нет профицита ни на одной из групп)
            // заершим процесс балансировки
            if (result === false) {
                return false;
            }
        } else {
            console.log('Ok');
        }
        console.groupEnd();
    });

    // покажем время завершения балансировки в заголовке
    $('b:contains("Список групп")').text('Список групп (Последняя балансировка завершена в ' + currentTime() + ')');

    // запустим таймер и перезагрузим страницу чтобы повторить балансировку
    var interval = options['interval'] * 60 * 1000;
    console.log('Retry in ' + interval + ' milliseconds');
    setTimeout(function () {
        location.reload();
    }, interval);
}

function fixGroup(i, amount) {
    // найдём группу с самым большим профицитом
    var overGroupIndex = findOverGroup();
    // если профицита нигде нет, то
    // пополнить неоткуда, закроем цикл,
    // ошибку показали уже в методе findOverGroup()
    if(overGroupIndex === false) return false;
    // если профицит в не в супергруппе,
    // то снимем его в супергруппу
    if(overGroupIndex > 0) {
        debitAmount(overGroupIndex, amount);
    }
    // если дефицит не в Супергруппе,
    // то пополним её из супергруппы
    if(i > 0) {
        addAmount(i, amount);
    }
}

function findOverGroup() {
    var n = null;
    var max = 0;
    console.groupCollapsed("Поиск группы с профицитом");
    for (var i = 0; i <= 22; i++) {
        // если у группы нет профицита,
        // пропустим её
        if (cities[i]['current'] <= cities[i]['min']) { continue; }
        // иначе посчитаем профицит
        var overAmount = (cities[i]['current'] * 100 - cities[i]['min'] * 100) / 100;
        console.log('Check group ' + i + ' (' + cities[i]['current'] + ' - ' + cities[i]['min'] + ') = ' + overAmount);
        // если это максимальный профицит,
        // сохраним его как максимальный
        if(overAmount > max) {
            n = i;
            max = overAmount;
        }
    }
    console.groupEnd();

    if(n != null) {
        // группа с профицитом найдена,
        // вернём её индекс
        console.log('Группа с самым большим избытком #' + n + ' (' + max + ')');
        return n;
    } else {
        // иначе выведем ошибку
        // и вернём false
        alert('Нет групп с избытком');
        return false;
    }
}

function debitAmount(i, amount) {
    console.log('Снимем с группы ' + i + ' ' + amount);

    cities[0]['current'] = cities[0]['current'] + amount;
    cities[i]['current'] = cities[i]['current'] - amount;

    var n = cities[i]['n'];

    var url = '?actionName=add_balance_subdealer&sub=' + n;
    var data = {
        vozvrat: 'on',
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

function addAmount(i, amount) {
    console.log('Добавим на группу ' + i + ' ' + amount);

    cities[0]['current'] = cities[0]['current'] - amount;
    cities[i]['current'] = cities[i]['current'] + amount;

    var n = cities[i]['n'];

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
