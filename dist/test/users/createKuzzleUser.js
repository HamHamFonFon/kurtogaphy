var Kuzzle = require('kuzzle-sdk');
var uuid = require('node-uuid');

var kuzzle = new Kuzzle('http://kurtography.challenge.kuzzle.io:7512', function() {

    var userContent = {
        "pictureId": "",
        "password": "kuzzle",
        "email": "kzzle@kuzzle.io",
        "profile": "user"
    };

    var options = {
        replaceIfExist: true
    };

    var idUser = "kuzzleteam"; //uuid.v1();

    kuzzle
        .security
        .createUser(idUser, userContent, options, function(error, response) {
            // result is a KuzzleUser object
            if (!error) {
                console.log("User created");
                console.log(response);
            } else {
                console.log("Error from kuzzle : " + error.message);
            }
        });

    kuzzle.disconnect();
});

