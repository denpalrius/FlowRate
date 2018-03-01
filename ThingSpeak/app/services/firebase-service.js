var ThingSpeak;
(function (ThingSpeak) {
    var Services;
    (function (Services) {
        var FirebaseService = (function () {
            function FirebaseService($cookies) {
                this.$cookies = $cookies;
                var that = this;
                that.init();
            }
            FirebaseService.prototype.init = function () {
                var that = this;
                firebase.initializeApp(ThingSpeak.Configs.AppConfig.firebaseConfig);
                firebase.auth().useDeviceLanguage();
                that.provider = new firebase.auth.GoogleAuthProvider();
                that.provider.setCustomParameters({
                    'login_hint': 'user@example.com'
                });
                that.loggedInUser = {};
            };
            FirebaseService.prototype.googleSignin = function () {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().signInWithPopup(that.provider)
                    .then(function (result) {
                    var token = result.credential.accessToken;
                    var user = result.user;
                    that.loggedInUser = {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber,
                        photoURL: user.photoURL,
                        role: ThingSpeak.ViewModels.iuserRole.standard
                    };
                    that.$cookies.put(ThingSpeak.Configs.AppConfig.cookies.userToken, token);
                    that.$cookies.putObject(ThingSpeak.Configs.AppConfig.cookies.UserProfile, that.loggedInUser);
                    that.write(ThingSpeak.Configs.AppConfig.firebaseRefs.users, that.loggedInUser)
                        .done(function (response) {
                        console.log(response);
                    })
                        .fail(function (error) {
                        console.log(error);
                    });
                    deferred.resolve("User logged in successfuly");
                })
                    .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    deferred.reject(error.message);
                });
                return deferred;
            };
            FirebaseService.prototype.googleSignin_new = function () {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().signInWithPopup(that.provider).then(function (result) {
                    if (result.credential) {
                        var token = result.credential.accessToken;
                    }
                    var user = result.user;
                    deferred.resolve('Sign in was Succesfull');
                }).catch(function (error) {
                    var errorOccured = {
                        errorCode: error.code,
                        errorMessage: error.message,
                        email: error.email,
                        credential: error.credential
                    };
                    deferred.reject(error);
                });
                return deferred;
            };
            FirebaseService.prototype.googleSignout = function () {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().signOut()
                    .then(function () {
                    deferred.resolve('Signout Succesfull');
                })
                    .catch(function (error) {
                    deferred.reject(error);
                });
                that.$cookies.remove(ThingSpeak.Configs.AppConfig.cookies.userToken);
                that.$cookies.remove(ThingSpeak.Configs.AppConfig.cookies.UserProfile);
                return deferred;
            };
            FirebaseService.prototype.write = function (ref, data) {
                var that = this;
                var deferred = $.Deferred();
                if (ref && data.id) {
                    firebase.database().ref(ref + '/' + data.id).set(data).done(function () {
                        deferred.resolve("Data added successfuly");
                    });
                }
                else {
                    deferred.reject("The provided data or its intended location are invalid!");
                }
                return deferred;
            };
            FirebaseService.prototype.read = function (ObjectRef, objId) {
                var that = this;
                var deferred = $.Deferred();
                var refPath = objId ? "/" + ObjectRef + "/" + objId : "/" + ObjectRef;
                var ref = firebase.database().ref(refPath);
                ref.on("value", function (snapshot) {
                    deferred.resolve(snapshot.val());
                }, function (error) {
                    deferred.reject(error.code);
                });
                return deferred;
            };
            FirebaseService.prototype.readList = function (ObjectRef) {
                var that = this;
                var deferred = $.Deferred();
                var ref = firebase.database().ref("/" + ObjectRef);
                ref.on("value", function (snapshot) {
                    var array = [];
                    snapshot.forEach(function (childSnapshot) {
                        array.push(childSnapshot.val());
                    });
                    deferred.resolve(array);
                }, function (error) {
                    deferred.reject(error.code);
                });
                return deferred;
            };
            FirebaseService.prototype.snapshotToArray = function (snapshot) {
                var returnArr = [];
                snapshot.forEach(function (childSnapshot) {
                    returnArr.push(childSnapshot.val());
                });
                return returnArr;
            };
            FirebaseService.prototype.read_old = function (ref, objId) {
                var userId = firebase.auth().currentUser.uid;
                return firebase.database().ref("/" + ref + "/" + objId).once('value').then(function (snapshot) {
                    var data = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                    console.log("username: ", data);
                });
            };
            FirebaseService.prototype.update = function (ref, data) {
                if (ref && data.id) {
                    var dataRef = firebase.database().ref(ref + "/" + data.id);
                    dataRef.update(data);
                }
            };
            return FirebaseService;
        }());
        Services.FirebaseService = FirebaseService;
    })(Services = ThingSpeak.Services || (ThingSpeak.Services = {}));
})(ThingSpeak || (ThingSpeak = {}));
