$('#disconnect').on('click', function() {
    // Déconnecte tous les appareils liés à ce device
    disconnect();
});

$('#startDiscovery').on('click', function() {
    startDiscovery();
});

$('#pair').on('click', function() {
    //console.log($('#device').data('address'));
    pair($('#device').data('address'));
});

$('#connect').on('click', function() {
    getUuids($('#device').data('address'));
});

$('#connectManag').on('click', function() {
    startConnectionManager();
});

$('#write').on('click', function() {
    write();
});

function write() {
    var ssid = $('#ssid').val();
    var pass = $('#pass').val();
    var feed = $('#feed').val();

    var data = "A";
    bluetoothSerial.write(data, success, failure);

    function success() {
        console.log("success");
    }

    function failure() {
        console.log("failure");
    }
}

function pair(address) {
    window.bluetooth.pair(success, error, address);

    function success() {
        console.log('yes');
    }
    function error() {
        console.log('no');
    }
}

function disconnect() {
    window.bluetooth.disconnect(onDisconnect, onErrorDisconnect);

    function onDisconnect() {
        $('#listDevices').html('');
        $('#device').data('address', '');

        $('#onConnect').hide();
        $('#connect').show();
        history.back();
    }

    function onErrorDisconnect(error) {
        console.log(error.message);
    }
}

function startDiscovery() {
    window.bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onError, {"timeout": 10000});

    function onDeviceDiscovered(device) {
        $('#listDevices').append('<li><a href="#devicePage" data-transition="slide" class="ui-btn ui-btn-icon-right ui-icon-carat-r item-device" data-address="' + device.address + '">' + device.name + ' | ' + device.address + '</a></li>');
        if (device.name == "BTBee Pro") {
            // On ajoute l'appareil à la liste

            stopDiscovery();
        }
    }

    function onDiscoveryFinished() {
        // La recherche est terminée
        console.log('Recherche terminée');
    }

    function onError(error) {
        // Une erreur
        console.log(error.message);
    }
}

function stopDiscovery() {
    window.bluetooth.stopDiscovery(onSuccess, onError);

    function onSuccess() {
        console.log('Recherche arretée');
    }

    function onError(error) {
        console.log(error.message);
    }
}

// Au clic sur un appareil
$('#listDevices').on('click', '.item-device', function() {
    // On récupère son adresse MAC
    var address = $(this).data('address');

    $('#device').data('address', address);
});

function getUuids(address) {
    window.bluetooth.getUuids(onSuccessUuid, onErrorUuid, address);

    function onSuccessUuid(uuid) {
        // On les connecte
        console.log(uuid.uuids);
        connect(address, uuid.uuids[0]);
    }

    function onErrorUuid(code) {
        // Sinon on affiche le msg d'erreur
        console.log(code.message);
    }
}

function connect(address, uuid) {
    window.bluetooth.connect(onConnection, onFail, {
        uuid: uuid,
        address: address
    });

    function onConnection() {
        console.log('onConnection');

        $('#connect').hide();

        // On affiche le boutton de deconnexion et le boutton d'écriture
        $('#onConnect').show();
    }

    function onFail(code) {
        console.log(code.message);
    }
}
