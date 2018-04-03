var Flux;
(function (Flux) {
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
                firebase.initializeApp(Flux.Configs.AppConfig.firebaseConfig);
                firebase.auth().useDeviceLanguage();
                that.provider = new firebase.auth.GoogleAuthProvider();
                that.provider.setCustomParameters({
                    'login_hint': 'user@example.com'
                });
                that.loggedInUser = {};
            };
            FirebaseService.prototype.signUp = function (newUser) {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                    .then(function (user) {
                    var loggedInUser = {
                        id: user.uid,
                        fullName: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber,
                        photoUrl: user.photoURL,
                        role: Flux.ViewModels.UserRole.standard
                    };
                    var isUserAdded = that.write(Flux.Configs.AppConfig.firebaseRefs.users, loggedInUser)
                        .done(function (response) {
                        console.log("New user: ", response);
                        return true;
                    })
                        .fail(function (error) {
                        console.log("Error: ", error);
                        return false;
                    });
                    console.log("isUserAdded: ", isUserAdded);
                    deferred.resolve(user);
                })
                    .catch(function (error) {
                    var errorMessage = "There was an error creating the new acccount. Kindly contact the owner";
                    if (error.code.match(/^(auth\/email-already-in-use| auth\/invalid-email| auth\/weak-password)$/)) {
                        errorMessage = error.message;
                    }
                    else if (error.code === "auth/operation-not-allowed") {
                        errorMessage = "Email sign up is not allowed";
                    }
                    deferred.reject(errorMessage);
                });
                return deferred;
            };
            FirebaseService.prototype.logIn = function (email, password) {
                var that = this;
                var deferred = $.Deferred();
                deferred.resolve("Denis Sigei");
                return deferred;
            };
            FirebaseService.prototype.signIn = function () {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().signInWithPopup(that.provider)
                    .then(function (result) {
                    if (result.credential) {
                        var token = result.credential.accessToken;
                    }
                    var user = result.user;
                    deferred.resolve('Sign in was Succesfull');
                })
                    .catch(function (error) {
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
            FirebaseService.prototype.signOut = function () {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().signOut()
                    .then(function () {
                    deferred.resolve('Signout Succesfull');
                })
                    .catch(function (error) {
                    deferred.reject(error);
                });
                return deferred;
            };
            FirebaseService.prototype.checkSignedInUser = function () {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        var signedInUser = {
                            fullName: user.displayName,
                            email: user.email,
                            photoUrl: user.photoURL,
                            emailVerified: user.emailVerified,
                            id: user.uid,
                            token: user.getIdToken
                        };
                        deferred.resolve(signedInUser);
                    }
                    else {
                        deferred.reject("There is no currently logged in user");
                    }
                });
                return deferred;
            };
            FirebaseService.prototype.updateUserProfile = function () {
                var user = firebase.auth().currentUser;
                var signedInUser = {
                    fullName: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL,
                    emailVerified: user.emailVerified,
                    id: user.uid
                };
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
                        fullName: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber,
                        photoUrl: user.photoURL,
                        role: Flux.ViewModels.UserRole.standard
                    };
                    that.write(Flux.Configs.AppConfig.firebaseRefs.users, that.loggedInUser)
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
            FirebaseService.prototype.write = function (ref, data) {
                var that = this;
                var deferred = $.Deferred();
                if (ref && data.id) {
                    firebase.database().ref(ref + '/' + data.id).set(data).then(function () {
                        deferred.resolve("Data added successfuly");
                    });
                }
                else {
                    deferred.reject("An error occured adding the new data!");
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
    })(Services = Flux.Services || (Flux.Services = {}));
})(Flux || (Flux = {}));
