console.log('Apelsintm');

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://code.jquery.com/jquery-2.2.4.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

console.log('jQuery added');

var cities = {
    1: { n: 1051, min: 60531.05, max: 60531.05 },
    2: { n: 1052, min: 126005.63, max: 126005.63 }
}

$(function() {
    $.each(cities, function (num, min_amount) {
        console.log(num);
        console.log('min: ' + min_amount);

        var current_amount = getCityAmount(num);
        console.log(current_amount);
    });

});

function getCityAmount(num) {
    var line = $("#minbody > table table table tbody tr:contains('Группа " + num + ". ')");
    return parseFloat($("td:nth-child(2)", line).text());
}
