module ThingSpeak.Helpers {
    export class AppHelpers {
        constructor() {
        }

        public static generateGUID(): string {
            let d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }

        public static encryptPassword(password: string): string {
            if (password) {
                return password + new Date();
            }
            return password;
        }

        public static arrayHasData(array: any): boolean {
            if (array === undefined || array === null || array.length === undefined || array.length === null) {
                return false;
            }
            else {
                return true;
            }
        }
    }
}