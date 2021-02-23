angular.module('header', []);


angular.module('header').directive('headerBlock',function () {
        return {
            restrict:'E',
            templateUrl: 'components/header/header.component.html'
        }
    }
);
