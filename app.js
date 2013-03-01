
'use strict';


function PrenomsBySexeController($scope, $http, $routeParams, $log) {


    var sexe = $routeParams.sexe;

    $scope.nombrePrenoms = 5;
    $scope.naissancesMin = 0;
    $scope.naissancesMax = 9999999;

    if (sexe == "GARCON") {
        $scope.sexe = "garçon";
        $scope.autreSexe = "fille";
        $scope.autreSexeLink = "FILLE";
    } else if (sexe == "FILLE") {
        $scope.sexe = "fille";
        $scope.autreSexe = "garçon";
        $scope.autreSexeLink = "GARCON";
    } else {
        $scope.sexe = "bizare";
        $scope.autreSexe = "garçon";
        $scope.autreSexeLink = "GARCON";
    }

    $scope.showOrHide = function(id) {
        if ($(id).is(':visible')) {
            $(id).hide('fast');
        } else {
            $(id).show('fast');
        }
    }

    $scope.addPrenom = function(prenom) {
        var myPrenoms = new Array();
        if (typeof(localStorage[sexe]) !== "undefined") {
            myPrenoms = JSON.parse(localStorage[sexe]);
        }

        var found = false;
        for (var i in myPrenoms) {
            if (myPrenoms[i].prenom === prenom.prenom) {
                found = true;
            }
        }

        if (!found) {
            myPrenoms.push(prenom);
            localStorage[sexe] = JSON.stringify(myPrenoms);
            $scope.favoritePrenoms = myPrenoms;
        }
    };

    $scope.removePrenom = function(prenom) {
        var myPrenoms = new Array();
        if (typeof(localStorage[sexe]) !== "undefined") {
            myPrenoms = JSON.parse(localStorage[sexe]);
        }

        var positionToRemove = -1;

        for (var i in myPrenoms) {
            if (myPrenoms[i].prenom === prenom.prenom) {
                positionToRemove = i;
            }
        }

        if (positionToRemove !== -1) {
            myPrenoms.splice(positionToRemove, 1);
        }

        localStorage[sexe] = JSON.stringify(myPrenoms);
        $scope.favoritePrenoms = myPrenoms;
    }

    if (typeof(localStorage[sexe]) !== "undefined") {
        $scope.favoritePrenoms = JSON.parse(localStorage[sexe]);
    }

    $scope.refresh = function(data) {

        $scope.prenoms = [];

        var nbLook = 0;

        while ($scope.prenoms.length < $scope.nombrePrenoms && nbLook < 10000) {

            var index = Math.floor(Math.random()*data.length);

            var prenom = data[index];

            var found = false;

            for (var i in $scope.prenoms) {
                if ($scope.prenoms[i].prenom === prenom.prenom) {
                    found = true;
                }
            }

            var languageOk = false;

            if (typeof(prenom.languages) !== "undefined") {
                $.each(prenom.languages, function(index, language) {
                    $.each($scope.origines, function(index, origine) {
                        if (origine.choose === true && origine.language === language) {
                            languageOk = true;
                        }
                    });
                });
            }


            if (typeof(prenom.naissancesByYear) !== "undefined") {
                prenom.nbNaissances = 0;
                $.each(prenom.naissancesByYear, function(index, item) {
                    prenom.nbNaissances = prenom.nbNaissances + item;
                });
            }

            var naissancesOk = true;
            if ($scope.naissancesMin > 0 && ($scope.naissancesMin > prenom.nbNaissances || typeof(prenom.nbNaissances) === "undefined")) {
                naissancesOk = false;
            }
            if (typeof(prenom.nbNaissances) !== "undefined" && $scope.naissancesMax < prenom.nbNaissances) {
                naissancesOk = false;
            }

            if (!found && languageOk && naissancesOk) {
                $scope.prenoms.push(prenom);
            }
            
            nbLook = nbLook + 1;
        }
    }

    
    $http.get('prenoms' + sexe + '.json', {}).success(function(data) {

        $scope.allPrenoms = data;
        $scope.origines = [];  
        $.each(data, function(index, prenom){
            if (typeof(prenom.languages) !== "undefined") {
                $.each(prenom.languages, function(index, language){
                    var found = false;
                    $.each($scope.origines, function(index, origine) {
                        if (origine.language === language) {
                            found = true;
                        }
                    });
                    if (!found) {
                         var origine = {};
                         origine.language = language;
                         origine.choose = (language === "french");
                         $scope.origines.push(origine); 
                    }
                });
            }
        });
        $scope.nbPrenoms = data.length;

        $scope.refresh(data);

    })
}

angular.module('Prenoms', []).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/prenoms/:sexe', {templateUrl: 'partial/prenoms.html', controller: PrenomsBySexeController});
    $routeProvider.otherwise({redirectTo: '/prenoms/GARCON'});

}]);


