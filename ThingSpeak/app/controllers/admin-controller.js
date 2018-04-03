var Flux;
(function (Flux) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var dateOptions;
        var AdminController = (function () {
            function AdminController($scope, $location, FirebaseService, HttpService, $mdToast) {
                this.$scope = $scope;
                this.$location = $location;
                this.FirebaseService = FirebaseService;
                this.HttpService = HttpService;
                this.$mdToast = $mdToast;
                var that = this;
                that.init();
            }
            AdminController.prototype.init = function () {
                var that = this;
                that.$scope.adminScope = {};
                that.$scope.adminScope.selectedChannel = {};
                that.$scope.adminScope.newUser = {};
                that.$scope.adminScope.loggedInUser = {};
                that.$scope.adminScope.selectedUser = {};
                that.$scope.adminScope.allUsers = [];
                that.$scope.adminScope.sensors = [];
                that.$scope.adminScope.newSensor = {};
                that.$scope.adminScope.selectedSensor = {};
                that.$scope.adminScope.status = "";
                that.$scope.adminScope.view = "";
                that.$scope.adminScope.visiblePanel = "dashboard";
                that.$scope.adminScope.showByEntries = false;
                that.$scope.adminScope.view = "'/app/views/templates/dashboard-template.html'";
                that.$scope.adminScope.userRoles = [
                    { role: "Administrator", value: Flux.ViewModels.UserRole.admin },
                    { role: "Manager", value: Flux.ViewModels.UserRole.manager },
                    { role: "Standard User", value: Flux.ViewModels.UserRole.standard }
                ];
                dateOptions = {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                };
                google.charts.load('current', { packages: ['corechart', 'line'] });
                that.getSensors();
                that.getUsers();
                that.loadSampleChannel();
            };
            AdminController.prototype.goTo = function (route) {
                var that = this;
                that.$location.path(route);
            };
            AdminController.prototype.addUser = function (isValid) {
                var that = this;
                if (isValid) {
                    that.$scope.adminScope.newUser.id = Flux.Helpers.AppHelpers.generateGUID();
                    that.FirebaseService.write(Flux.Configs.AppConfig.firebaseRefs.users, that.$scope.adminScope.newUser)
                        .done(function (response) {
                        Flux.Helpers.AppHelpers.showToast("User added successfully", true, that.$mdToast);
                    })
                        .fail(function (error) {
                        Flux.Helpers.AppHelpers.showToast("There was an error adding new user", false, that.$mdToast);
                    });
                }
            };
            AdminController.prototype.checkUSer = function () {
                var that = this;
                that.FirebaseService.checkSignedInUser()
                    .done(function (user) {
                    if (user) {
                        that.$scope.adminScope.loggedInUser = user;
                        console.log("User", that.$scope.adminScope.loggedInUser);
                    }
                    else {
                        that.$location.path("login");
                    }
                })
                    .fail(function (error) {
                    console.log("There is  no logged in user");
                });
            };
            AdminController.prototype.getSensors = function () {
                var that = this;
                that.FirebaseService.readList("sensors")
                    .done(function (sensors) {
                    that.$scope.adminScope.sensors = sensors;
                })
                    .fail(function (error) {
                    console.warn("Error: ", error);
                });
            };
            AdminController.prototype.getUsers = function () {
                var that = this;
                that.FirebaseService.readList("users")
                    .done(function (users) {
                    that.$scope.adminScope.allUsers = users;
                })
                    .fail(function (error) {
                    console.error("Error: ", error);
                });
            };
            AdminController.prototype.selectUser = function (selectedUser) {
                var that = this;
                that.$scope.adminScope.selectedUser = selectedUser;
                console.log(selectedUser);
            };
            AdminController.prototype.updateUser = function (selectedUser) {
                var that = this;
                console.warn("Should update user!");
            };
            AdminController.prototype.updateSensor = function (selectedUser) {
                var that = this;
                console.warn("Should update sensor!");
            };
            AdminController.prototype.signOut = function () {
                console.log("Signing out");
                var that = this;
                that.FirebaseService.signOut()
                    .done(function (response) {
                    console.log(response);
                }).fail(function (error) {
                    console.log(error);
                }).always(function () {
                    that.$location.path("login");
                });
            };
            AdminController.prototype.displaySensorDetails = function (sensor) {
                var that = this;
                if (sensor) {
                    that.$scope.adminScope.selectedSensor = sensor;
                }
                else {
                    that.$scope.adminScope.selectedSensor = {};
                }
            };
            AdminController.prototype.addSensor = function (isValid) {
                var that = this;
                if (isValid) {
                    var newSensor = that.$scope.adminScope.newSensor;
                    newSensor.id = newSensor.name.replace(/\s/g, '') + '+' + Flux.Helpers.AppHelpers.generateGUID();
                    that.FirebaseService.write(Flux.Configs.AppConfig.firebaseRefs.sensors, that.$scope.adminScope.newSensor)
                        .done(function (response) {
                        Flux.Helpers.AppHelpers.showToast("Sensor added successfully", true, that.$mdToast);
                    })
                        .fail(function (error) {
                        Flux.Helpers.AppHelpers.showToast("There was an error adding new sensor", false, that.$mdToast);
                    });
                }
            };
            AdminController.prototype.loadSampleChannel = function () {
                var that = this;
                that.HttpService.get("app/scripts/sample-channel.json")
                    .done(function (response) {
                    that.$scope.adminScope.selectedChannel = response.data;
                    var selectedChannel = response.data;
                    if (selectedChannel && selectedChannel.feeds) {
                        that.drawCumulativeChart(selectedChannel);
                        that.drawRealTimeChart(selectedChannel);
                        that.drawCumulativeChart_Data(selectedChannel);
                        that.drawRealTimeChart_Data(selectedChannel);
                    }
                    $(window).resize(function () {
                        if (selectedChannel && selectedChannel.feeds) {
                            that.drawCumulativeChart(selectedChannel);
                            that.drawRealTimeChart(selectedChannel);
                            that.drawCumulativeChart_Data(selectedChannel);
                            that.drawRealTimeChart_Data(selectedChannel);
                        }
                    });
                })
                    .fail(function (error) {
                    console.error(error);
                });
            };
            AdminController.prototype.drawCumulativeChart = function (channel) {
                var that = this;
                google.charts.setOnLoadCallback(function () { drawChart(); });
                function drawChart() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'Date');
                    data.addColumn('number', "Cumulative Flow");
                    data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
                    var rows = [];
                    channel.feeds.forEach(function (feed) {
                        var entry = feed.entry_id;
                        var date = new Date(feed.created_at);
                        var fieldNum = parseFloat(feed.field1);
                        var field = isNaN(fieldNum) ? 0 : fieldNum;
                        rows.push([date, field, that.createCustomHTMLContent(date, entry, field)]);
                    });
                    data.addRows(rows);
                    var options = {
                        chart: {
                            title: channel.name,
                            subtitle: channel.description
                        },
                        height: 400,
                        tooltip: { isHtml: true },
                        legend: { position: 'none' },
                        hAxis: {
                            title: 'Date',
                            titleTextStyle: {
                                italic: false,
                                fontStyle: "normal"
                            }
                        },
                        vAxis: {
                            title: 'Cumulative Flow',
                            titleTextStyle: {
                                italic: false,
                                fontStyle: "normal"
                            }
                        },
                        colors: ['Blue']
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('cumulativeChart'));
                    chart.draw(data, google.charts.Line.convertOptions(options));
                }
            };
            AdminController.prototype.drawRealTimeChart = function (channel) {
                var that = this;
                google.charts.setOnLoadCallback(function () { drawChart(); });
                function drawChart() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'Date');
                    data.addColumn('number', "Real Time Flow");
                    data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
                    var rows = [];
                    channel.feeds.forEach(function (feed) {
                        var entry = feed.entry_id;
                        var date = new Date(feed.created_at);
                        var fieldNum = parseFloat(feed.field2);
                        var field = isNaN(fieldNum) ? 0 : fieldNum;
                        rows.push([date, field, that.createCustomHTMLContent(date, entry, field)]);
                    });
                    data.addRows(rows);
                    var options = {
                        chart: {
                            title: channel.name,
                            subtitle: channel.description
                        },
                        height: 400,
                        tooltip: { isHtml: true },
                        legend: { position: 'none' },
                        hAxis: {
                            title: 'Date',
                            titleTextStyle: {
                                italic: false,
                                fontStyle: "normal"
                            }
                        },
                        vAxis: {
                            title: 'Real Time Flow',
                            titleTextStyle: {
                                italic: false,
                                fontStyle: "normal"
                            }
                        },
                        colors: ['Red']
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('realTimeChart'));
                    chart.draw(data, google.charts.Line.convertOptions(options));
                }
            };
            AdminController.prototype.drawCumulativeChart_Data = function (channel) {
                var that = this;
                google.charts.setOnLoadCallback(function () { drawChart(); });
                function drawChart() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('number', 'Entry');
                    data.addColumn('number', "Cumultive Flow");
                    data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
                    var rows = [];
                    channel.feeds.forEach(function (feed) {
                        var entry = feed.entry_id;
                        var date = new Date(feed.created_at);
                        var fieldNum = parseFloat(feed.field1);
                        var field = isNaN(fieldNum) ? 0 : fieldNum;
                        rows.push([entry, field, that.createCustomHTMLContent(date, entry, field)]);
                    });
                    data.addRows(rows);
                    var options = {
                        chart: {
                            title: channel.name,
                            subtitle: channel.description
                        },
                        tooltip: { isHtml: true },
                        legend: { position: 'none' },
                        height: 400,
                        hAxis: {
                            title: 'Entry',
                            titleTextStyle: {
                                italic: false,
                                fontStyle: "normal"
                            }
                        },
                        vAxis: {
                            title: 'Cumulative Flow',
                            titleTextStyle: {
                                italic: false,
                                fontStyle: "normal"
                            }
                        },
                        colors: ['Blue']
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('cumulativeChart_data'));
                    chart.draw(data, google.charts.Line.convertOptions(options));
                }
            };
            AdminController.prototype.drawRealTimeChart_Data = function (channel) {
                var that = this;
                google.charts.setOnLoadCallback(function () { drawChart(); });
                function drawChart() {
                    var data = new google.visualization.DataTable();
                    data.addColumn('number', 'Entry');
                    data.addColumn('number', "Real Time Flow");
                    data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
                    var rows = [];
                    channel.feeds.forEach(function (feed) {
                        var entry = feed.entry_id;
                        var date = new Date(feed.created_at);
                        var fieldNum = parseFloat(feed.field2);
                        var field = isNaN(fieldNum) ? 0 : fieldNum;
                        rows.push([entry, field, that.createCustomHTMLContent(date, entry, field)]);
                    });
                    data.addRows(rows);
                    var options = {
                        chart: {
                            title: channel.name,
                            subtitle: channel.description
                        },
                        tooltip: { isHtml: true },
                        legend: { position: 'none' },
                        height: 400,
                        hAxis: {
                            title: 'Entry',
                            titleTextStyle: {
                                italic: false,
                                fontStyle: "normal"
                            }
                        },
                        vAxis: {
                            title: 'Real Time Flow',
                            titleTextStyle: {
                                italic: false,
                                fontStyle: "normal"
                            }
                        },
                        colors: ['Red']
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('realTimeChart_data'));
                    chart.draw(data, google.charts.Line.convertOptions(options));
                }
            };
            AdminController.prototype.createCustomHTMLContent = function (date, entryId, flowRate) {
                return '<div style="padding:5px">' +
                    '<table>' +
                    '<tr>' +
                    '<td><b> Date </b></td>' +
                    '<td  style="min-width:171px">' + date.toLocaleTimeString("en-us", dateOptions) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td><b> Entry Id </b></td>' +
                    '<td>' + entryId + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="width:70px"><b>Flow Rate  </b></td>' +
                    '<td>' + flowRate + '</td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>';
            };
            return AdminController;
        }());
        Controllers.AdminController = AdminController;
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));
