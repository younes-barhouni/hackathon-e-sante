var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //saveDevice();
//        window.bluetooth.getUuids(onSuccess, onError, "18:E2:C2:7B:1E:5F");
//
//        function onSuccess(uuid) {
//            console.log(uuid);
//        }
//
//        function onError(code) {
//            console.log(code.message);
//        }

        //connect();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};
