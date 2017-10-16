module ThingSpeak.Services {
    export class CouchDbService {
        constructor(
            private $http: ng.IHttpService,
            private httpService: Services.HttpService) {
            var that: CouchDbService = this;
        }

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

        public getPouchExpenses(): Models.Row[] {
            var that: CouchDbService = this;

            var docs: Models.Row[] = [];

            // Create a PouchDB instance
            var db = new PouchDB("expenses");
            var doc = {
                "_id":new Date().toISOString(),
                "name": "Mittens",
                "occupation": "kitten",
                "age": 3,
                "hobbies": [
                    "playing with balls of yarn",
                    "chasing laser pointers",
                    "lookin' hella cute"
                ]
            };
            db.put(doc);

            db.allDocs({ include_docs: true })
                .then(function (dc: Models.couchDbModel) {
                    console.log("Pouch Object: ", dc.rows);
                    docs = dc.rows;
                })
                .catch(function (err: any) {
                    console.log(err);
                });

            return docs;
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