
'use strict';


function PrenomsBySexeController($scope, $http, $routeParams) {


    var sexe = $routeParams.sexe;

    var nombrePrenoms = 5;

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

    
    $http.get('prenoms.json', {}).success(function(data) {

        $scope.prenoms = [];

        var nbLook = 0;

        while ($scope.prenoms.length < nombrePrenoms && nbLook < 10000) {

            var prenom = data[Math.floor(Math.random()*data.length)];

            if (prenom.sexe === sexe) {

                var found = false;

                for (var i in $scope.prenoms) {
                    if ($scope.prenoms[i].prenom === prenom.prenom) {
                        found = true;
                    }
                }

                if (!found) {
                    $scope.prenoms.push(prenom);
                }
            }

            nbLook = nbLook + 1;
        }

    })
}

angular.module('Prenoms', []).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/prenoms/:sexe', {templateUrl: 'partial/prenoms.html', controller: PrenomsBySexeController});
    $routeProvider.otherwise({redirectTo: '/prenoms/GARCON'});

}]);


