var app = angular.module('appModule', ['ngRoute','header','footer']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/',
            {
                template:'<list-block></list-block>',
            }).when('/account',
            {
                template:'<account></account>',
            });
}]);

app.directive('listBlock', function () {
    return {
        templateUrl:"pages/main/components/list/list.component.html",
        restrict:'E',
        controller: listController,
        controllerAs: 'listCtrl',
        bindToController: true,
    }
});

app.directive('modalBlock', function () {
    return {
        templateUrl:"pages/main/components/modal/modal.component.html",
        restrict:"EA",
        controller:modalController,
        controllerAs:'modalCtrl',
        bindToController: true,
        bindings: {
            'movies': '='
        }
    }
});

function listController ($http, dataTransfer, $scope) {
    var baseURLAddress = 'https://api.themoviedb.org/3/movie/now_playing';
    var key = 'ebea8cfca72fdff8d2624ad7bbf78e4c';
    var listCtrl = this;

    listCtrl.getMovies = function () {
        $http({
            method: 'GET',
            url: baseURLAddress + '?api_key=' + key + '&language=ru_RU' + 'page=' + 1
        }).then(function success(response) {
            listCtrl.resp = (response.data.results);
            dataTransfer.movies = listCtrl.resp;
            $scope.$broadcast('moviesChange', dataTransfer.movies);
        });
    };

    listCtrl.getMovies();

    $scope.$on('moviesChange', function () {
        listCtrl.openPopup = function openPopup(index) {
            dataTransfer.movie = listCtrl.resp[index];

            $scope.$broadcast('openModal', dataTransfer.movie);
        };
    });
}

function modalController ($scope, dataTransfer) {
    var modalCtrl = this;
    modalCtrl.openModal = false;

    $scope.$on('openModal', function (event, data) {
        modalCtrl.openModal = true;
        modalCtrl.movie = data;
        console.log(data)
    });
    
    modalCtrl.closeModal = function closeModal (){
        modalCtrl.openModal = false;
    }
}

app.controller('switchController', function () {
    var switchCtrl = this;
});
