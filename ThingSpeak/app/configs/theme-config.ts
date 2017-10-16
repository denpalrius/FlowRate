module ThingSpeak.Configs {
    export class ThemeConfig {
        constructor(
            private $mdThemingProvider: angular.material.IThemingProvider,
            private $mdIconProvider: angular.material.MDIconProvider) {

            $mdThemingProvider.theme('default')
                .primaryPalette('green', {
                    'default': '400', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                .accentPalette('orange');

            $mdIconProvider
                .iconSet('social', 'img/icons/sets/social-icons.svg', "24")
                .defaultIconSet('img/icons/sets/core-icons.svg', "24");
        }
    }
}