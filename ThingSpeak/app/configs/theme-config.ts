module Flux.Configs {
    export class ThemeConfig {
        constructor($mdThemingProvider: any, $mdIconProvider: any) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue', {
                    'default': '400', // by default use shade 400 from the Cyan palette for primary intentions
                    'hue-1': '500', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '800', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                // If you specify less than all of the keys, it will inherit from the
                // default shades
                .accentPalette('deep-orange', {
                    'default': '700' // use shade 200 for default, and keep all other shades the same
                });
                

            // Enable browser color
            $mdThemingProvider.enableBrowserColor({
                theme: 'default', // Default is 'default'
                palette: 'primary', // Default is 'primary', any basic material palette and extended palettes are available
                hue: '700' // Default is '800'
            });
        }
    }
}