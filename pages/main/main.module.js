angular.module('appModule', ['header','footer']);
var app = angular.module('appModule');

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


app.controller('ctrler', function ($http) {

        var ctrl = this;
        var baseURLAddress = 'https://api.themoviedb.org/3/movie/now_playing';
        var idPath = 'https://api.themoviedb.org/3/movie/';
        var key = 'ebea8cfca72fdff8d2624ad7bbf78e4c';
        var loaded = false;



        function getMovies() {
            $http({method: 'GET', url: baseURLAddress + '?api_key=' + key  + '&language=ru_RU' + 'page=' + 1 }).
            then(function success(response) {
                loaded = true;
                var resp =(response.data.results);
            });
            console.log(resp);
        }

        getMovies();

});
