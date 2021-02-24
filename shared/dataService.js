app.filter('imgNameRectifier', function () {
    return function (text) {
        return 'http://image.tmdb.org/t/p/w342' + text;
    };
});

app.service('dataTransfer', function () {
    return {
        movie:{},
        movies:{},
    }
});


//
// account.filter('imgNameRectifier', function () {
//     return function (text) {
//         return 'http://image.tmdb.org/t/p/w342' + text;
//     };
// });

