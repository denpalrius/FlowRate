module ThingSpeak.Services {
    export class CouchDbService {
        constructor(private $http: ng.IHttpService) {
            var that: CouchDbService = this;
        }

        public get<T>(url: string): JQueryDeferred<T> {
            var that: CouchDbService = this;
            var deferred = $.Deferred();
            that.$http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((successresponse) => {
                deferred.resolve(successresponse);
                },
                (errorResponse) => {
                    deferred.reject(errorResponse);
                });
            return deferred;
        }
    }
}