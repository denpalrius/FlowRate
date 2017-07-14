module ThingSpeak.Services {
    export class HttpService {
        constructor(
            private $http: ng.IHttpService) {
            var that: HttpService = this;
        }

        public get<T>(url: string): JQueryDeferred<T> {
            var that: HttpService = this;
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