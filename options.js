// Saves options to chrome.storage
function save_options() {
    var interval = document.getElementById('interval').value;
    var step = document.getElementById('step').value;
    var storage_options = {
        interval: interval,
        step: step
    };
    for (var i = 1; i <= 21; i++) {
        storage_options['g' + i + 'min'] = document.getElementById('g' + i + 'min').value;
        // storage_options['g' + i + 'max'] = document.getElementById('g' + i + 'max').value;
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
        interval: 5,
        step: 100
    };
    for (var i = 1; i <= 21; i++) {
        default_options['g' + i + 'min'] = 10000;
        // default_options['g' + i + 'max'] = 100000;
    }
    chrome.storage.sync.get(default_options, function(items) {
        document.getElementById('interval').value = items.interval;
        document.getElementById('step').value = items.step;
        for (var i = 1; i <= 21; i++) {
            document.getElementById('g' + i + 'min').value = items['g' + i + 'min'];
            // document.getElementById('g' + i + 'max').value = items['g' + i + 'max'];
        }
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
