module ThingSpeak.Services {
    export class FirebaseService {
        constructor(private $firebaseObject: AngularFireObject) {
            var that: FirebaseService = this;
        }

        public readFromFirebase() {
            var that: FirebaseService = this;
            //var deferred = $.Deferred();

            //const rootRef = firebase.database().ref().child('data-db');
            //const ref = rootRef.child('object');
            //var syncObject = that.$firebaseObject(ref);

            // synchronize the object with a three-way data binding
            // click on `index.html` above to see it used in the DOM!
            //syncObject.$bindTo($scope, "data");


            //return deferred;
        }
    }
}