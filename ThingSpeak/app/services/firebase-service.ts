declare const firebase: IFireBase;

interface IFireBase {
    database: any;
    auth: any;
    initializeApp: any;
}


module ThingSpeak.Services {
    export class FirebaseService {
        provider: any;
        loggedInUser: ViewModels.iUser;

        constructor(private $cookies: ng.cookies.ICookiesService) {
            var that: FirebaseService = this;

            that.init()
        }

        public init() {
            var that: FirebaseService = this;

            firebase.initializeApp(Configs.AppConfig.firebaseConfig);
            firebase.auth().useDeviceLanguage();

            that.provider = new firebase.auth.GoogleAuthProvider();
            that.provider.setCustomParameters({
                'login_hint': 'user@example.com'
            });

            that.loggedInUser = {};
        }

        public googleSignin(): JQueryDeferred<any> {
            var that: FirebaseService = this;
            var deferred = $.Deferred();

            //firebase.auth().signInWithRedirect(that.provider);
            //firebase.auth().getRedirectResult().then(function (result: any) {

            firebase.auth().signInWithPopup(that.provider)
                .then(function (result: any) {
                    var token = result.credential.accessToken;
                    var user = result.user;

                    that.loggedInUser = {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber,
                        photoURL: user.photoURL,
                        role: ViewModels.iUserRole.standard
                    };

                    that.$cookies.put(Configs.AppConfig.cookies.userToken, token);
                    that.$cookies.putObject(Configs.AppConfig.cookies.UserProfile, that.loggedInUser);

                    //Add user to Firebase DB
                    that.write(Configs.AppConfig.firebaseRefs.users, that.loggedInUser)
                        .done((response:any) => {
                            console.log(response);
                        })
                        .fail((error: any) => {
                            console.log(error);
                        });

                    deferred.resolve("User logged in successfuly");

                })
                .catch(function (error: any) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    deferred.reject(error.message);
                });

            return deferred;
        }

        public googleSignin_new(): JQueryDeferred<any> {
            var that: FirebaseService = this;
            var deferred = $.Deferred();

            //firebase.auth().signInWithRedirect(that.provider);
            //firebase.auth().getRedirectResult().then(function (result: any) {

            firebase.auth().signInWithPopup(that.provider).then(function (result: any) {
                if (result.credential) {
                    var token = result.credential.accessToken;
                }
                var user = result.user;
                deferred.resolve('Sign in was Succesfull');
            }).catch(function (error: any) {
                var errorOccured = {
                    errorCode: error.code,
                    errorMessage: error.message,
                    email: error.email,
                    credential: error.credential
                }
                deferred.reject(error);
            });

            return deferred;

        }

        public googleSignout(): JQueryDeferred<any> {
            var that: FirebaseService = this;
            var deferred = $.Deferred();

            firebase.auth().signOut()
                .then(function () {
                    deferred.resolve('Signout Succesfull');
                })
                .catch(function (error: any) {
                    deferred.reject(error);
                });

            that.$cookies.remove(Configs.AppConfig.cookies.userToken);
            that.$cookies.remove(Configs.AppConfig.cookies.UserProfile);

            return deferred;
        }

        public write(ref: string, data: any) {
            var that: FirebaseService = this;
            var deferred = $.Deferred();

            if (ref && data.id) {
                firebase.database().ref(ref + '/' + data.id).set(data).done(() => {
                    deferred.resolve("Data added successfuly");
                });
            }
            else {
                deferred.reject("The provided data or its intended location are invalid!");
            }

            return deferred;
        }

        public read(ObjectRef: string, objId?: string): JQueryDeferred<any> {
            var that: FirebaseService = this;
            var deferred = $.Deferred();

            var refPath = objId ? "/" + ObjectRef + "/" + objId : "/" + ObjectRef
            var ref = firebase.database().ref(refPath);

            ref.on("value",
                (snapshot: any) => {
                    deferred.resolve(snapshot.val());
                },
                (error: any) => {
                    deferred.reject(error.code);
                });

            return deferred;
        }

        public readList(ObjectRef: string): JQueryDeferred<any> {
            var that: FirebaseService = this;
            var deferred = $.Deferred();

            var ref = firebase.database().ref("/" + ObjectRef);

            ref.on("value",
                (snapshot: any) => {
                    var array: any = [];
                    snapshot.forEach(function (childSnapshot: any) {
                        array.push(childSnapshot.val());
                    });
                    deferred.resolve(array);
                },
                (error: any) => {
                    deferred.reject(error.code);
                });

            return deferred;
        }

        private snapshotToArray(snapshot: any) {
            var returnArr: any = [];

            snapshot.forEach(function (childSnapshot: any) {
                returnArr.push(childSnapshot.val());
            });

            return returnArr;
        }

        public read_old(ref: string, objId: any) {
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