var app = angular.module('appModule',
    ['ngRoute',
     'header',
     'footer',
     'account',
     'ngMessages',
     'ngSanitize',
     'ngMaterial',
     'shared'
    ]);


angular.module('appModule').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/', {template:'<list-block></list-block>',})
            .when('/account', {template:'<account-list></account-list>',});
}]);




angular.module('appModule').directive('listBlock', function () {
    return {
        templateUrl:"pages/main/list.component.html",
        restrict:'E',
        controller: listController,
        controllerAs: 'listCtrl',
        bindToController: true,
    }
});

angular.module('appModule').directive('modalBlock', function () {
    return {
        templateUrl:"pages/main/modal.component.html",
        restrict:"EA",
        controller: modalController,
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
    listCtrl.currentPage = 1;
    listCtrl.init = function(){
        listCtrl.getMovies(listCtrl.currentPage);
    };

    $scope.$on('paginateMovies', function (event, data) {
        listCtrl.getMovies(data);
    });
    
    listCtrl.getMovies = function (page) {
        listCtrl.currentPage = page;
        $http.get(baseURLAddress + '?api_key=' + key + '&language=ru_RU&' + 'page=' + page).then(function (response) {
            listCtrl.resp = (response.data);
            listCtrl.totalPages = response.data.total_pages;
            dataTransfer.movies = listCtrl.resp.results;
            $scope.$broadcast('moviesChange', dataTransfer.movies);
        });
    };

    listCtrl.init();

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

    function changeButton() {
        var index = checkFavorites();
        if (!JSON.parse(localStorage.getItem('favorites')) || index === -1){
            modalCtrl.favor = 'Add to favorites';
        }
        else{
            modalCtrl.favor = 'Remove from favorites';
        }
    }

    function checkFavorites(){
        var title = dataTransfer.movie.title;
        return favorMovies.indexOf(favorMovies.find((entry) => entry.title === title));
    }

    $scope.$on('buttonChange', function (data, event) {
        modalCtrl.favor = event;
    });

}

angular.module('appModule').controller('switchController', function ($scope, dataTransfer) {
    var switchCtrl = this;
    var favorMovies = getFavorites();
    switchCtrl.favor = 'Add to favorites';

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
            switchCtrl.favor = 'Remove from favorites';
            favorMovies.push(dataTransfer.movie);
            localStorage.setItem('favs', JSON.stringify(favorMovies));
            $scope.$emit('buttonChange', switchCtrl.favor);
        }
        else if(checkFavorites() !== -1){
            switchCtrl.favor = 'Add to favorites';
            favorMovies.splice(checkFavorites(), 1);
            localStorage.setItem('favs', JSON.stringify(favorMovies));
            $scope.$emit('buttonChange', switchCtrl.favor);
        }
    };

    function sendPack (data, event) {
        dataTransfer.movie = data;
        $scope.$emit(event, data);
    }
});
