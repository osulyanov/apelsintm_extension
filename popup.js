// сохранённые в настройках опции
var options = {};
// если настройки расширения меняются, получим их
document.addEventListener('DOMContentLoaded', restore_options);
// получим настройк ирасширения
restore_options();

// получим настройки расширения
function restore_options() {
    // настройки по умолчанию
    var default_options = {
        is_on: false
    };
    // получим настройки расширения из хранилища Хрома
    chrome.storage.sync.get(default_options, function (items) {
        options['is_on'] = items.is_on;

        document.getElementById('is_on_1').checked = options['is_on'];
        document.getElementById('is_on_0').checked = !options['is_on'];
    });
}

document.getElementById("is_on_1").onchange = function(){
    changed();
};
document.getElementById("is_on_0").onchange = function(){
    changed();
};

function changed() {
    var is_on = document.getElementById('is_on_1').checked;
    var storage_options = {
        is_on: is_on
    };
    chrome.storage.sync.set(storage_options, function() {});

}
