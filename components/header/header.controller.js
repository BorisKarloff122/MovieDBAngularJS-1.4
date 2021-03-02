angular.module('header', []);


angular.module('header').directive('headerBlock',function () {
        return {
            restrict:'E',
            templateUrl: 'components/header/header.component.html',
            controller: headerController,
            controllerAs:'headerCtrl',
            bindToController:true
        }
    }
);

function headerController() {
    var headerCtrl = this;

    headerCtrl.openMenu = function($mdMenu, ev) {
        $mdMenu.open(ev);
    };

    headerCtrl.closeMenu  = function ($mdMenu, ev) {
        $mdMenu.close(ev);
    }
}
