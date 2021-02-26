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
            dataTransfer.movie = dataTransfer.movies[index];
            $scope.$broadcast('openModal', dataTransfer.movie);
        };
    });
}

function modalController ($scope, dataTransfer) {
    var modalCtrl = this;
    var favorMovies = getFavorites();

    function getFavorites(){
        if(JSON.parse(localStorage.getItem('favs')) === null){
            return [];
        }
        else{
            return JSON.parse(localStorage.getItem('favs'));
        }
    }

    modalCtrl.favor = 'Add to favorites';
    $scope.$on('openModal', function (event, data) {
        modalCtrl.openModal = true;
        modalCtrl.movie = data;
    });

    $scope.$on('nextMovie', function (event, data) {
        modalCtrl.movieSet(data);
        changeButton();
    });

    $scope.$on('prevMovie', function (event, data) {
        modalCtrl.movie = data;
        changeButton();
    });

    modalCtrl.closeModal = function closeModal (){
        modalCtrl.openModal = false;
    };

    modalCtrl.movieSet = function (data) {
        modalCtrl.movie = data
    };

    function checkFavorites(){
        var title = dataTransfer.movie.title;
        return favorMovies.indexOf(favorMovies.find((entry) => entry.title === title));
    }

    function changeButton() {
        var index = checkFavorites();
        if (index === -1){
            modalCtrl.favor = 'Add to favorites';
        }
        else{
            modalCtrl.favor = 'Remove from favorites';
        }

    }

}

app.controller('switchController', function ($scope, dataTransfer) {


    var switchCtrl = this;
    var favorMovies = getFavorites();

     function getFavorites(){
        if(JSON.parse(localStorage.getItem('favs')) === null){
            return [];
        }
        else{
           return JSON.parse(localStorage.getItem('favs'));
        }
    }

    switchCtrl.getIndex = function(){
        var title = dataTransfer.movie.title;
        var movies = dataTransfer.movies;
        return movies.indexOf(movies.find((entry) => entry.title === title));
    };

    function checkFavorites (){
        var title = dataTransfer.movie.title;
        return favorMovies.indexOf(favorMovies.find((entry) => entry.title === title));
    }

    switchCtrl.nextMovie = function nextMovie() {
        var index = switchCtrl.getIndex();
        if (index < dataTransfer.movies.length - 1){
            sendPack(dataTransfer.movies[index + 1], 'nextMovie');
        }
        else{
            sendPack(dataTransfer.movies[0], 'nextMovie');
        }

    };

    switchCtrl.prevMovie = function prevMovie() {
        var index = switchCtrl.getIndex();
        if (index > 0 ){
            sendPack(dataTransfer.movies[index - 1], 'prevMovie');
        }
        else{
            sendPack(dataTransfer.movies[dataTransfer.movies.length - 1], 'prevMovie');
        }
    };

    switchCtrl.favorites = function favorites () {
        if(favorMovies === [] || checkFavorites() === -1){
            favorMovies.push(dataTransfer.movie);
            localStorage.setItem('favs', JSON.stringify(favorMovies));

        }
        else{
            favorMovies.splice(checkFavorites(), 1);
            localStorage.setItem('favs', JSON.stringify(favorMovies));
        }
    };

    function sendPack (data, event) {
        dataTransfer.movie = data;
        $scope.$emit(event, data);
    }
});
