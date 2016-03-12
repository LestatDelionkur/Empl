"use strict";

/* Controllers */
(function (ng) {
    var emplApp = ng.module("emplApp", ['smart-table', 'ui.bootstrap', 'ngAnimate']);

    emplApp

        .controller("EmployeeCtrl", ["$scope", '$filter', "$http", "$uibModal", "$log", function ($scope, $filter, $http, $uibModal, $log) {
            $scope.isCollapsed = true;
            $scope.collection = [];
            //$scope.displayed = [];
            $scope.employeeTypes = ['Все'];
            $scope.employeeTypesList = [];
            $scope.animationsEnabled = true;

            //functions declare
            $scope.GetDate = function (jsondate) {
                var milli = jsondate.replace(/\/Date\((-?\d+)\)\//, '$1');
                return new Date(parseInt(milli)).toISOString();
            };

            $scope.LoadEmployeeTypes = function () {
                $http.get("/Employees/EmployeeTypeList").success(function (data) {
                    var list = data.map(function (item) {
                        return item.Title;
                    });
                    $scope.employeeTypes = ['Все'].concat(list);
                    $scope.employeeTypesList = data;
                });
            }

            $scope.LoadEmployees = function () {
                $http.get("/Employees/EmployeeList").success(function (data) {
                    $scope.collection = data;
                    $scope.collection.forEach(function (item, ind) {
                        item.Date = $scope.GetDate(item.Date);
                    });
                   // $scope.displayed = [].concat($scope.collection);
                });
            }

            $scope.GetItemById = function (itemId) {

                var resultItem = $scope.collection.filter(function (item) {
                    return item.EmployeeId == itemId;
                });
                return resultItem[0];
            }

            $scope.GetIndexById = function (itemId) {
                var index = -1;

                if (itemId)
                 $scope.collection.forEach(function (item, i) {
                    if (item.EmployeeId == itemId)
                        index = i;
                });
                   
                return index;
            }

            $scope.RefreshItemView = function (item) {
                if (item) {
                    var index = $scope.GetIndexById(item.EmployeeId);
                    console.log(item, index, !isNaN(index), index > 0);
                    
                    if (!isNaN(index) && index >= 0) {
                        $scope.collection[index] = item;
                        $scope.displayed[index] = item;
                    } else {
                        $scope.collection.push(item);

                    }

                  //  $scope.displayed = [].concat($scope.collection);
                  
                }
            }
            $scope.RemoveItem = function removeRow(employee) {
                var index = $scope.collection.indexOf(employee);
                if (index !== -1) {
                    var conf = {
                        withCredentials: true
                    };
                    $http.post("/Employees/Delete", { id: employee.EmployeeId }, conf).success(function (data) {
                        $scope.collection.splice(index, 1);
                    });
                    
                }
            }

         

            $scope.UpdateItem = function (employee) {
                var conf = {
                    withCredentials: true
                };

                $http.post("/Employees/Edit", { employee: employee }, conf).success(function (data) {
                    var item = data;
                    item.Date = $scope.GetDate(item.Date);
                    $scope.RefreshItemView(item);
                });
            }


            $scope.openModal = function (size, item) {
                $scope.LoadEmployeeTypes();
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/Content/templates/emplEditModal.html',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    resolve: {
                        employeeTypes: function () {
                            return $scope.employeeTypesList;
                        },
                        item: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    if (selectedItem) {
                        $scope.UpdateItem(selectedItem);
                    }
                }, function () {

                });
            };


            $scope.ExpandFilter = function () {
                if (!$scope.isCollapsed) {
                    console.log(this);
                    var row = ng.element(document.querySelector(".filter-row"));
                    console.log(row);
                    row.css('display', 'table-row');
                }

            };

            $scope.CollapseFilter = function () {
                if ($scope.isCollapsed) {
                    console.log(this);
                    var row = ng.element(document.querySelector(".filter-row"));
                    console.log(row);
                    row.css('display', 'none');
                }

            };



            //init
            $scope.LoadEmployeeTypes();
            $scope.LoadEmployees();

        }])


        .directive('stDateRange', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    before: '=',
                    after: '='
                },
                templateUrl: '/Content/templates/stDateRange.html',

                link: function (scope, element, attr, table) {

                    var inputs = element.find('input');
                    var inputBefore = ng.element(inputs[0]);
                    var inputAfter = ng.element(inputs[1]);
                    var predicateName = attr.predicate;

                    [inputBefore, inputAfter].forEach(function (input) {

                        input.bind('blur', function () {

                            var query = {};
                            if (!scope.isBeforeOpen && !scope.isAfterOpen) {

                                if (scope.before) {
                                    query.before = scope.before;
                                }

                                if (scope.after) {
                                    query.after = scope.after;
                                }

                                scope.$apply(function () {

                                    table.search(query, predicateName);
                                });
                            }
                        });
                    });

                    function open(before) {
                        return function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            if (before) {
                                scope.isBeforeOpen = true;
                            } else {
                                scope.isAfterOpen = true;
                            }
                        }
                    }

                    scope.openBefore = open(true);
                    scope.openAfter = open();
                }
            }
        }])

        .filter('customFilter', ['$filter', function ($filter) {
            var filterFilter = $filter('filter');
            var standardComparator = function standardComparator(obj, text) {
                text = ('' + text).toLowerCase();
                return ('' + obj).toLowerCase().indexOf(text) > -1;
            };

            return function customFilter(array, expression) {
                function customComparator(actual, expected) {

                    var isBeforeActivated = expected.before;
                    var isAfterActivated = expected.after;
                    var isLower = expected.lower;
                    var isHigher = expected.higher;
                    var higherLimit;
                    var lowerLimit;
                    var itemDate;
                    var queryDate;

                    if (ng.isObject(expected)) {

                        //date range
                        if (expected.before || expected.after) {
                            try {
                                if (isBeforeActivated) {
                                    higherLimit = expected.before;

                                    itemDate = new Date(actual);
                                    queryDate = new Date(higherLimit);

                                    console.log(actual);
                                    if (itemDate > queryDate) {
                                        return false;
                                    }
                                }
                                if (isAfterActivated) {
                                    lowerLimit = expected.after;


                                    itemDate = new Date(actual);
                                    queryDate = new Date(lowerLimit);

                                    if (itemDate < queryDate) {
                                        return false;
                                    }
                                }
                                return true;
                            } catch (e) {
                                return false;
                            }

                        } else if (isLower || isHigher) {

                            if (isLower) {
                                higherLimit = expected.lower;

                                if (actual > higherLimit) {
                                    return false;
                                }
                            }

                            if (isHigher) {
                                lowerLimit = expected.higher;
                                if (actual < lowerLimit) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        return true;
                    }
                    return standardComparator(actual, expected);
                }

                var output = filterFilter(array, expression, customComparator);
                return output;
            };
        }])

        .directive('stSelectFilter', [function () {

            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    collection: '=',
                    predicate: '@',
                    predicateExpression: '='

                },
                template: '<select ng-model="selectedOption" ng-change="optionChanged(selectedOption)" ng-options="opt for opt in collection" class="form-control"></select>',
                link: function (scope, element, attr, table) {
                    var getPredicate = function () {
                        var predicate = scope.predicate;
                        if (!predicate && scope.predicateExpression) {

                            predicate = scope.predicateExpression;

                        }

                        return predicate;
                    }

                    scope.$watch('collection', function (newValue) {

                        if (newValue) {
                            scope.selectedOption = scope.collection[0];
                            scope.optionChanged(scope.selectedOption);
                        }

                    }, true);

                    scope.optionChanged = function (selectedOption) {

                        var predicate = getPredicate();
                        var query;
                        query = selectedOption;

                        if (query === 'Все') {
                            query = '';
                        }

                        table.search(query, predicate);

                    };

                }

            }

        }])

        .directive('pageSelect', function () {
            return {
                restrict: 'E',
                template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
                link: function (scope, element, attrs) {
                    scope.$watch('currentPage', function (c) {
                        scope.inputPage = c;
                    });
                }
            }
        })

        .directive('stRatio', function () {
            return {
                link: function (scope, element, attr) {
                    var ratio = +(attr.stRatio);

                    element.css('width', ratio + '%');

                }
            };
        })
    ;

    angular.module("emplApp").controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, employeeTypes, item) {
        $scope.isDateOpen = false;
        $scope.items = employeeTypes;
        console.log(employeeTypes, item);
        $scope.selected = {};
        if (item) {
            $scope.selected.Name = item.Name;
            $scope.selected.EmployeeId = item.EmployeeId;
            $scope.selected.Date = new Date(item.Date);
            $scope.selected.EmployeeType = item.EmployeeType;
        } else {
            $scope.selected.EmployeeType = {};
        }

        $scope.openDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.isDateOpen = true;
        }


        $scope.ok = function () {
            console.log($scope.editEmployeeForm);
            if ($scope.editEmployeeForm.$valid) {
                var employee = {};
                employee.Name = $scope.selected.Name;
                employee.Date = $scope.selected.Date.toISOString();
                employee.EmployeeId = $scope.selected.EmployeeId || 0;
                employee.EmployeeTypeId = $scope.selected.EmployeeType.EmployeeTypeId;
                $uibModalInstance.close(employee);
            } else {
                $scope.editEmployeeForm.Name.$setDirty();
                $scope.editEmployeeForm.Date.$setDirty();
                $scope.editEmployeeForm.EmployeeType.$setDirty();
            }
       
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})(angular);