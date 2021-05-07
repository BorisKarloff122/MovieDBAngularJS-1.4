var account = angular.module('account', []);

angular.module('account').directive('accountList', function () {
   return{
       templateUrl:'pages/account/list.component.html',
       controller: accountController,
       controllerAs: 'accountCtrl',
       restrict: 'EA',
       bindToController: true
   } 
});

function accountController($scope) {
    var accountCtrl = this;
     accountCtrl.init = function init () {
         accountCtrl.favMovies = JSON.parse(localStorage.getItem('favs'));
     };

     accountCtrl.init();

    accountCtrl.removeFromFavs = function (index) {
        accountCtrl.favMovies.splice(index, 1);
        localStorage.setItem('favs', JSON.stringify(accountCtrl.favMovies));
    }
}
