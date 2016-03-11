﻿"use strict";

/* Controllers */
(function (ng) {
var comicsApp = angular.module("emplApp", ['smart-table', 'ui.bootstrap']);

comicsApp

    .controller("EmployeeCtrl", ["$scope", '$filter', "$http", function ($scope, $filter, $http) {
    $scope.collection = [];
    $scope.displayed = [].concat($scope.collection);
    
    $http.get("EmployeeList").success(function (data) {
        $scope.collection = data;
        $scope.displayed = [].concat($scope.collection);
    });

    $http.get("EmployeeTypeList").success(function (data) {
        $scope.employeeTypes = data;
    });

    $scope.orderProp = "age";
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
                            })
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
                            //number range
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
                        //etc

                        return true;

                    }
                    return standardComparator(actual, expected);
                }

                var output = filterFilter(array, expression, customComparator);
                return output;
            };
        }])

;
})(angular);