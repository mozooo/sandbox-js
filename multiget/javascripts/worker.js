// worker
self.addEventListener('message', function(e) {
    var data = e.data;

    var status = [];
    var responseText = [];
    var responseTime = [];

    for (var i = 0; i < data.count; i++) {
        var startTime = new Date();

        var request = new XMLHttpRequest();
        request.open(data.method, data.url, false);
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                status[i] = request.status;
                if (request.status == 200) {
                    responseText[i] = request.responseText;
                }
            }
        }
        request.send();

        var currentTime = new Date();
        responseTime[i] = ((currentTime - startTime) / 1000);
    }

    self.postMessage({'status': status, 'responseText': responseText, 'responseTime': responseTime});
    self.close();
}, false);
