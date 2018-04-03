module Flux.Controllers {
    "use strict";

    declare const google: ViewModels.iGoogle;
    var dateOptions: Intl.DateTimeFormatOptions;

    interface ICurrentScope {
        selectedChannel?: ViewModels.iChannel;
        sensors?: ViewModels.iSensor[];
        newSensor?: ViewModels.iSensor;
        newUser?: ViewModels.newUser;
        selectedUser?: ViewModels.iUser;
        loggedInUser?: ViewModels.iUser;
        allUsers?: ViewModels.iUser[];
        currentNavItem?: string;
        selectedSensor?: ViewModels.iSensor;
        status?: string;
        view?: string;
        visiblePanel?: string;
        userRoles?: ViewModels.iUserRole[];
        showByEntries?: boolean;
    }

    interface IAdminScope extends ng.IScope {
        adminScope?: ICurrentScope;
    }

    export class AdminController {
        constructor(
            private $scope: IAdminScope,
            private $location: ng.ILocationService,
            private FirebaseService: Services.FirebaseService,
            private HttpService: Services.HttpService,
            private $mdToast: any) {

            var that: AdminController = this;
            that.init();
        }

        private init() {
            var that: AdminController = this;

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
            //that.$scope.adminScope.view = "dashboard";
            that.$scope.adminScope.view = "'/app/views/templates/dashboard-template.html'";

            that.$scope.adminScope.userRoles = [
                { role: "Administrator", value: ViewModels.UserRole.admin },
                { role: "Manager", value: ViewModels.UserRole.manager },
                { role: "Standard User", value: ViewModels.UserRole.standard }
            ];

            dateOptions = {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            };

            //Load Google visualization apis
            google.charts.load('current', { packages: ['corechart', 'line'] });

            that.getSensors();
            that.getUsers();

            that.loadSampleChannel();
        }

        private goTo(route: string) {
            var that: AdminController = this;

            that.$location.path(route);
        }

        private addUser(isValid: boolean) {
            var that: AdminController = this;

            if (isValid) {
                that.$scope.adminScope.newUser.id = Helpers.AppHelpers.generateGUID();
                that.FirebaseService.write(Configs.AppConfig.firebaseRefs.users, that.$scope.adminScope.newUser)
                    .done((response: any) => {
                        Helpers.AppHelpers.showToast("User added successfully", true, that.$mdToast);
                    })
                    .fail((error: any) => {
                        Helpers.AppHelpers.showToast("There was an error adding new user", false, that.$mdToast);
                    });
            }
        }

        private checkUSer() {
            var that: AdminController = this;
            that.FirebaseService.checkSignedInUser()
                .done((user: any) => {
                    if (user) {
                        that.$scope.adminScope.loggedInUser = user;

                        console.log("User", that.$scope.adminScope.loggedInUser);
                    } else {
                        that.$location.path("login");
                    }
                })
                .fail((error: any) => {
                    console.log("There is  no logged in user");
                });
        }

        private getSensors() {
            var that: AdminController = this;
            that.FirebaseService.readList("sensors")
                .done((sensors: ViewModels.iSensor[]) => {
                    that.$scope.adminScope.sensors = sensors;
                })
                .fail((error: any) => {
                    console.warn("Error: ", error);
                });
        }

        private getUsers() {
            var that: AdminController = this;
            that.FirebaseService.readList("users")
                .done((users: ViewModels.iUser[]) => {
                    that.$scope.adminScope.allUsers = users;
                })
                .fail((error: any) => {
                    console.error("Error: ", error);
                });
        }

        private selectUser(selectedUser: ViewModels.iUser) {
            var that: AdminController = this;
            that.$scope.adminScope.selectedUser = selectedUser;
            console.log(selectedUser);
        }

        private updateUser(selectedUser: ViewModels.iUser) {
            var that: AdminController = this;

            console.warn("Should update user!");
        }

        private updateSensor(selectedUser: ViewModels.iUser) {
            var that: AdminController = this;

            console.warn("Should update sensor!");
        }

        private signOut() {
            console.log("Signing out");

            var that: AdminController = this;
            that.FirebaseService.signOut()
                .done((response: any) => {
                    console.log(response);
                }).fail((error: any) => {
                    console.log(error);
                }).always(() => {
                    that.$location.path("login");
                });
        }

        private displaySensorDetails(sensor: ViewModels.iSensor) {
            var that: AdminController = this;

            if (sensor) {
                that.$scope.adminScope.selectedSensor = sensor;

            }
            else {
                that.$scope.adminScope.selectedSensor = {}
            }
        }

        private addSensor(isValid: boolean) {
            var that: AdminController = this;

            if (isValid) {
                var newSensor = that.$scope.adminScope.newSensor;
                newSensor.id = newSensor.name.replace(/\s/g, '') + '+' + Helpers.AppHelpers.generateGUID();

                that.FirebaseService.write(Configs.AppConfig.firebaseRefs.sensors, that.$scope.adminScope.newSensor)
                    .done((response: any) => {
                        Helpers.AppHelpers.showToast("Sensor added successfully", true, that.$mdToast);
                    })
                    .fail((error: any) => {
                        Helpers.AppHelpers.showToast("There was an error adding new sensor", false, that.$mdToast);
                    });
            }
        }

        private loadSampleChannel() {
            var that: AdminController = this;

            that.HttpService.get("app/scripts/sample-channel.json")
                .done((response: Models.IHttpResponse) => {
                    that.$scope.adminScope.selectedChannel = response.data;
                    var selectedChannel: ViewModels.iChannel = response.data;

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
                .fail((error: Models.IHttpResponse) => {
                    console.error(error);
                });
        }

        private drawCumulativeChart(channel: ViewModels.iChannel) {
            var that: AdminController = this;

            google.charts.setOnLoadCallback(function () { drawChart() });

            function drawChart() {
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', "Cumulative Flow");
                data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } })

                var rows: any[] = [];
                channel.feeds.forEach((feed: ViewModels.iFeed) => {
                    let entry = feed.entry_id;
                    let date = new Date(feed.created_at);
                    let fieldNum = parseFloat(feed.field1);
                    let field = isNaN(fieldNum) ? 0 : fieldNum
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
                        titleTextStyle:
                        {
                            italic: false,
                            fontStyle: "normal"
                        }
                    },
                    vAxis: {
                        title: 'Cumulative Flow',
                        titleTextStyle:
                        {
                            italic: false,
                            fontStyle: "normal"
                        }
                    },
                    colors: ['Blue']
                };

                var chart = new google.visualization.LineChart(document.getElementById('cumulativeChart'));
                chart.draw(data, google.charts.Line.convertOptions(options));
            }
        }


        private drawRealTimeChart(channel: ViewModels.iChannel) {
            var that: AdminController = this;

            google.charts.setOnLoadCallback(function () { drawChart() });

            function drawChart() {
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', "Real Time Flow");
                data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } })

                var rows: any[] = [];
                channel.feeds.forEach((feed: ViewModels.iFeed) => {
                    let entry = feed.entry_id;
                    let date = new Date(feed.created_at);
                    let fieldNum = parseFloat(feed.field2);
                    let field = isNaN(fieldNum) ? 0 : fieldNum
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
                        titleTextStyle:
                        {
                            italic: false,
                            fontStyle: "normal"
                        }
                    },
                    vAxis: {
                        title: 'Real Time Flow',
                        titleTextStyle:
                        {
                            italic: false,
                            fontStyle: "normal"
                        }
                    },
                    colors: ['Red']
                };

                var chart = new google.visualization.LineChart(document.getElementById('realTimeChart'));
                chart.draw(data, google.charts.Line.convertOptions(options));
            }
        }

        private drawCumulativeChart_Data(channel: ViewModels.iChannel) {
            var that: AdminController = this;

            google.charts.setOnLoadCallback(function () { drawChart() });

            function drawChart() {
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'Entry');
                data.addColumn('number', "Cumultive Flow");
                data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } })

                var rows: any[] = [];
                channel.feeds.forEach((feed: ViewModels.iFeed) => {
                    let entry = feed.entry_id;
                    let date = new Date(feed.created_at);
                    let fieldNum = parseFloat(feed.field1);
                    let field = isNaN(fieldNum) ? 0 : fieldNum
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
                        titleTextStyle:
                        {
                            italic: false,
                            fontStyle: "normal"
                        }
                    },
                    vAxis: {
                        title: 'Cumulative Flow',
                        titleTextStyle:
                        {
                            italic: false,
                            fontStyle: "normal"
                        }
                    },
                    colors: ['Blue']
                };

                var chart = new google.visualization.LineChart(document.getElementById('cumulativeChart_data'));
                chart.draw(data, google.charts.Line.convertOptions(options));
            }
        }

        private drawRealTimeChart_Data(channel: ViewModels.iChannel) {
            var that: AdminController = this;

            google.charts.setOnLoadCallback(function () { drawChart() });

            function drawChart() {
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'Entry');
                data.addColumn('number', "Real Time Flow");
                data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } })

                var rows: any[] = [];
                channel.feeds.forEach((feed: ViewModels.iFeed) => {
                    let entry = feed.entry_id;
                    let date = new Date(feed.created_at);
                    let fieldNum = parseFloat(feed.field2);
                    let field = isNaN(fieldNum) ? 0 : fieldNum
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
                        titleTextStyle:
                        {
                            italic: false,
                            fontStyle: "normal"
                        }
                    },
                    vAxis: {
                        title: 'Real Time Flow',
                        titleTextStyle:
                        {
                            italic: false,
                            fontStyle: "normal"
                        }
                    },
                    colors: ['Red']
                };

                var chart = new google.visualization.LineChart(document.getElementById('realTimeChart_data'));
                chart.draw(data, google.charts.Line.convertOptions(options));
            }
        }

        private createCustomHTMLContent(date: Date, entryId: any, flowRate: any) {
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
        }
    }
}