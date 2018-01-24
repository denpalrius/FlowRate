module ThingSpeak.Helpers {
    export class PasswordEncriptionHelper {
        constructor() {
        }

        public static encrypt(password:string): string {
            if (password) {
                return password + new Date();
            }
            return password;
        }
    }
}