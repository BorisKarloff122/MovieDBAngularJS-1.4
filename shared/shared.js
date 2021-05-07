var shared = angular.module('shared', []);


shared.directive('paginatorBlock', function () {
    return{
        templateUrl:'shared/components/paginator.component.html',
        controller: paginatorController,
        controllerAs:'vm',
        bindToController:true,
        scope:{
            page: '=',
            action: '@',
            paginationRange: '=',
            borderButtons: '=',
            total: '='
        }
    }
} );


function paginatorController($scope) {
    var self = this;
    self.point = self.page;
    self.paginate = paginate;
    self.goToFirst = goToFirst;
    self.goToLast = goToLast;

    if(!self.paginationRange){
         self.paginationRange = 5;
    }

    function init() {

        if (self.point === 1){
            self.startPoint = 1;
            self.endPoint = self.paginationRange;
        }
        else if( self.point > 1){
            self.startPoint = self.point -  Math.floor(self.paginationRange/2);
            self.endPoint = self.point + Math.floor(self.paginationRange/2);
        }
        else if(self.point === self.total){
            self.startPoint = self.total - self.paginationRange;
            self.endPoint = self.total;
        }
        generateArray();
    }

    function generateArray() {
        self.buttonsArray  = [];
        for(let i = self.startPoint; i <= self.endPoint; i++ ){
            self.buttonsArray.push(i);
        }
    }

    function goToFirst() {
        $scope.$emit(self.action, 1);
        self.point = 1;
        init();
    }
    
    function goToLast() {
        $scope.$emit(self.action, self.total);
        self.point = self.total;
        init();
    }

    function paginate(item) {
        $scope.$emit(self.action, item);
        self.point = item;
        init();
    }

    init();
}
