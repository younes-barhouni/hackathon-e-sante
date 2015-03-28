function saveDevice() {
    // On déconnecte toute connexion existante
    disconnect();

    // On recherche les appareils à proximité
    startDiscovery();
}

function disconnect() {
    window.bluetooth.disconnect(onDisconnect, onErrorDisconnect);

    function onDisconnect() {
        console.log('Recherche arretée');
    }

    function onErrorDisconnect(error) {
        console.log('Erreur de déconnexion ' + error.message);
    }
}

function startDiscovery() {
    window.bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onError, {"timeout": 5000});

    function onDeviceDiscovered(device) {
        // On ajoute l'appareil à la liste
        $('#listDevices').append('<li><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r item-device" data-address="' + device.address + '">' + device.name + ' | ' + device.address + '</a></li>');
        // On arrete la recherche
        stopDiscovery();
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

    // On vérifie si les appareils sont déjà associés
    //isPaired(address);
    
    getUuids(address);
});

function isPaired(address) {
    window.bluetooth.isPaired(onSuccess, onError, address);

    function onSuccess() {
        // Si ils sont déjà associés
        //getUuids(address);

        console.log('ils sont associés');
        //startConnectionManager();
        getUuids(address);
    }

    function onError() {
        // Sinon on les associe
        //pair(address);

        console.log('ils ne sont pas associés');
    }
}

function getUuids(address) {
    window.bluetooth.getUuids(onSuccessUuid, onErrorUuid, address);

    function onSuccessUuid(uuid) {
        // On les connecte
        console.log(uuid.uuids);
        connect(address, uuid.uuids[1]);
    }

    function onErrorUuid(code) {
        // Sinon on affiche le msg d'erreur
        console.log(code.message);
    }
}

function pair(address) {
    window.bluetooth.pair(success, error, address);

    function success() {
        // On essaye d'ecrire
        var data = "test chaine";
        window.bluetooth.write(success, error, data);

        function success() {
            console.log('connect');
        }
        function error(error) {
            console.log('noConnect' + error.message);
        }
    }
    function error() {
        console.log('no');
    }
}

function connect(address, uuid) {
    window.bluetooth.connect(onConnection, onFail, {
        uuid: uuid,
        address: address
    });

    function onConnection() {
        console.log('connect');
        console.log('ondataread');
        window.bluetooth.startConnectionManager(onDataRead, onError);

        function onDataRead(data) {
            console.log('connection yes');

        }

        function onError(error) {
            console.log('startConnectionManagerERRROR' + error.message);
        }

    }

    function onFail(code) {
        console.log('connect Fail ' + code.message);
        //pair(address);
    }
}



function startConnectionManager() {
    var data = "test chaine";

    window.bluetooth.startConnectionManager(onDataRead, onError);

    function onDataRead(data) {
        console.log('connection yes');
//        console.log('ondataread');
//        window.bluetooth.write(success, error, data);
//
//        function success() {
//            console.log('connect');
//        }
//        function error(error) {
//            console.log('noConnect' + error.message);
//        }
    }

    function onError(error) {
        console.log('startConnectionManagerERRROR' + error.message);
    }
}

