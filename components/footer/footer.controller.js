var footer = angular.module('footer', []);


footer.directive('footerBlock', function () {
   return{
       templateUrl:"components/footer/footer.component.html",
       restrict:'E'
   }
});
