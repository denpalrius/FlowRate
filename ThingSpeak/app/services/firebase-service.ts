declare const firebase: IFireBase;

interface IFireBase {
    database: any;
    auth: any;
    initializeApp: any;
}

module ThingSpeak.Services {
    export class FirebaseService {

        constructor(private $firebaseObject: any) {
            var that: FirebaseService = this;

            that.init()
        }

        public init() {
            firebase.initializeApp(Configs.AppConfig.firebaseConfig);
        }

        public write(ref: string, data: any, identifier:string) {
            if (ref && data.id && identifier) {
                //firebase.database().ref('users/' + data.id).set(data);
                var dataRef = firebase.database().ref(ref + "/" + identifier);
                dataRef.set(data);
            }
        }

        public read(ref: string, objId: any) {
            var userId = firebase.auth().currentUser.uid;

            return firebase.database().ref("/" + ref + "/" + objId).once('value').then(function (snapshot: any) {
                var data = (snapshot.val() && snapshot.val().username) || 'Anonymous';

                console.log("username: ", data);
            });
        }

        public update(ref: string, data: any) {
            if (ref && data.id) {
                var dataRef = firebase.database().ref(ref + "/" + data.id);
                dataRef.update(data);

                //johnRef.update({
                //    "number": 10
                //});
            }
        }

    }
}