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
    }
});

app.directive('modalBlock', function () {
    return {
        templateUrl:"pages/main/components/modal/modal.component.html",
        restrict:"EA",
    }
});

app.controller('listController', function listController ($http, dataTransfer, $scope) {
    var baseURLAddress = 'https://api.themoviedb.org/3/movie/now_playing';
    var key = 'ebea8cfca72fdff8d2624ad7bbf78e4c';
    var listCtrl = this;
    listCtrl.getMovies = function () {
        $http({method: 'GET', url: baseURLAddress + '?api_key=' + key  + '&language=ru_RU' + 'page=' + 1 }).
        then(function success(response) {
            listCtrl.resp = (response.data.results);
            dataTransfer.movies = listCtrl.resp;

            setTimeout(function (){ $scope.$broadcast('moviesChange', dataTransfer.movies)}, 1);
        });
    };

    listCtrl.getMovies();

    listCtrl.openPopup = function openPopup() {
       dataTransfer.openModal = true;
       $scope.$on('openModal', function () {
            $scope.$broadcast('openModal', true);
       });

    };

});

app.controller('modalController',function ($scope) {
    var modalCtrl = this;


    $scope.$emit('init', null);
    $scope.$on('openModal',function (event, data) {
        console.log(data);
    });

});

app.controller('switchController', function () {
    var switchCtrl = this;
});
