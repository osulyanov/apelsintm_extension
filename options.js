// Saves options to chrome.storage
function save_options() {
    var is_on = document.getElementById('is_on').checked;
    var interval = document.getElementById('interval').value;
    var step = document.getElementById('step').value;
    var storage_options = {
        is_on: is_on,
        interval: interval,
        step: step
    };
    for (var i = 0; i <= 22; i++) {
        storage_options['g' + i + 'min'] = document.getElementById('g' + i + 'min').value;
    }
    chrome.storage.sync.set(storage_options, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Настройки сохранены';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    var default_options = {
        is_on: false,
        interval: 5,
        step: 0
    };
    for (var i = 0; i <= 22; i++) {
        default_options['g' + i + 'min'] = 0;
    }
    chrome.storage.sync.get(default_options, function(items) {
        document.getElementById('is_on').checked = items.is_on;
        document.getElementById('interval').value = items.interval;
        document.getElementById('step').value = items.step;
        for (var i = 0; i <= 22; i++) {
            document.getElementById('g' + i + 'min').value = items['g' + i + 'min'];
        }
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
