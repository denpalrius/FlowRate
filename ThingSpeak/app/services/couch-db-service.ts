module ThingSpeak.Services {
    export class CouchDbService {

        db: any = {};

        constructor( private $http: ng.IHttpService, private httpService: Services.HttpService) {

            var that: CouchDbService = this;

            that.db = new PouchDB("dmm-kenya");

            that.SyncDb();
        }
        
        private  SyncDb() {
            var that: CouchDbService = this;

            //Update online Db
            that.db.replicate.to(Configs.AppConfig.couchDbPath)
                .then(function (result: any) {
                    console.log("Comletion Message: ", result);
                })
                .catch(function (err: any) {
                    console.log("Sync Error: ", err);
                });

            //Update offline Db
            that.db.replicate.from(Configs.AppConfig.couchDbPath)
                .then(function (result: any) {
                    console.log("Comletion Message: ", result);
                })
                .catch(function (err: any) {
                    console.log("Sync Error: ", err);
                });
        }

        public loadSalesData(): Models.SalesForm[] {
            var that: CouchDbService = this;

            var salesData: Models.SalesForm[] = [];
            var salesDocs: Models.Doc[] = [];

            that.db.allDocs({
                include_docs: true,
                attachments: true
            }).then(function (response: Models.PuchDbObject) {
                var rows = response.rows;

                rows.forEach((row: Models.Row) => {
                    salesDocs.push(row.doc);
                    salesData.push(row.doc.salesData);
                });

                console.log("Sales Data: ", salesData);
                console.log("Sales Documents: ", salesDocs);
                return salesData;
            })
            .catch(function (err: any) {
                console.log(err);
            });
            return [];
        }

        public addSalesData(salesData: Models.SalesForm) {
            var that: CouchDbService = this;

            var newGuid = Helpers.GuidHelper.getNewGUIDString();
            var newSalesDoc: Models.Doc = {
                salesData,
                _id: newGuid
            };
            that.db.put(newSalesDoc)
                .then(function () {
                    console.log("Doc saved successfully");
                }).catch(function (err: any) {
                    console.log("Something happened: ", err);
                });
        }

        public submitOrderData(salesData: Models.SalesForm) {
            var that: CouchDbService = this;

            var newGuid = Helpers.GuidHelper.getNewGUIDString();
            var newSalesDoc: Models.Doc = {
                salesData,
                _id: newGuid
            };
            that.db.put(newSalesDoc)
                .then(function () {
                    console.log("Doc saved successfully");
                }).catch(function (err: any) {
                    console.log("Something happened: ", err);
                });
        }

        public updateSalesData(salesDoc: Models.Doc) {
            var that: CouchDbService = this;
            that.db.get(salesDoc).then(function (doc:any) {
                    doc.stuff = "Stuff";
                    return that.db.put(doc);
                }).then(function () {
                    return that.db.get(salesDoc);
                }).then(function (doc: any) {
                    console.log(doc);
                }).catch(function (err: any) {
                    console.log("Something happened: ", err);
                });;
        }


        //CouchDb stuff using $resource
        public getItems(): Models.couchDbModel{
            var that: CouchDbService = this;
            that.$http.get(Configs.AppConfig.couchDbPath + '/_design/expenses/_view/byName')
                .then(function (response) {
                    return response.data;
                });
            return {};
        }

        public getExpenses(): JQueryDeferred<Models.couchDbModel> {
            var that: CouchDbService = this;

            var deferred = $.Deferred();

            that.httpService.get(Configs.AppConfig.couchDbPath + '/_design/expenses/_view/byName')
                .done((response: Models.IHttpResponse) => {
                    var expenses = response.data;
                    deferred.resolve(expenses);
                })
                .fail(() => {
                    console.log("Failed to get the data from Couch Db");
                });
            return deferred;
        }

        private createItem(data: any) {
            var that: CouchDbService = this;

        var req = {
            method: 'PUT',
            url: '/portfolioapp/' + data._id,
            data: data,
        };
        return that.$http(req);
    }

        private getAllItems() {
            var that: CouchDbService = this;

        var req = {
            method: 'GET',
            url: '/portfolioapp/_design/app/_view/show_all'
        };
        return that.$http(req);
    }

        private deleteItem(data: any) {
            var that: CouchDbService = this;

        var req = {
            method: 'DELETE',
            url: '/portfolioapp/' + data._id + '?rev=' + data._rev
        };
        return that.$http(req);
    }

    }
}