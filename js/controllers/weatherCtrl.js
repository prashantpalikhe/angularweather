app.controller('WeatherController', ["$scope", "$http", function ($scope, $http) {
        'use strict';

        var WEATHER_API  = 'http://api.openweathermap.org/data/2.5/weather?q=';
        var FORECAST_API = 'http://api.openweathermap.org/data/2.5/forecast/daily?count=7&q=';

        $scope.units   = "metric";
        $scope.city    = "";
        $scope.options = {types: '(cities)'};
        $scope.details = "";
        $scope.data    = {};

        $scope.resetData = function () {
            $scope.data.weather = $scope.data.forecasts = $scope.data.error = undefined;
            return $scope;
        };

        $scope.fetchData = function () {
            var comma = $scope.city.indexOf(',');

            if (comma > 0) {
                var city = $scope.city.substring(0, $scope.city.indexOf(','));
            }  else {
                var city = $scope.city;
            }

            if (!city) {
                return;
            }

            $scope.resetData().fetchWeather(city).fetchForecast(city);
        };

        $scope.fetchWeather = function (city) {
            var url = WEATHER_API + city + '&units=' + $scope.units;

            $http
                .get(url)
                .success(function (data) {
                    if (data.cod === "404") {
                        $scope.data.error = "No data found for " + $scope.city;
                    } else {
                        $scope.data.period = (data.dt > data.sys.sunset || data.dt < data.sys.sunrise) ? "night" : "day";
                        $scope.data.weather = data.main;
                        $scope.data.weather.icon = data.weather[0].icon;
                    }
                });

            return $scope;
        };

        $scope.fetchForecast = function (city) {
            var url = FORECAST_API + city + '&units=' + $scope.units;

            $http
                .get(url)
                .success(function (data) {
                    if (data.cnt) {
                        $scope.data.forecasts = data.list;
                    }
                });

            return $scope;
        };

        $scope.toC = function () {
            $scope.units = "metric";
            $scope.fetchData();
        };

        $scope.toF = function () {
            $scope.units = "imperial";
            $scope.fetchData();
        };
    }]);