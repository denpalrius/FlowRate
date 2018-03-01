var ThingSpeak;
(function (ThingSpeak) {
    var Configs;
    (function (Configs) {
        var ThemeConfig = (function () {
            function ThemeConfig($mdThemingProvider, $mdIconProvider) {
                $mdThemingProvider.theme('default')
                    .primaryPalette('cyan', {
                    'default': '400',
                    'hue-1': '100',
                    'hue-2': '600',
                    'hue-3': 'A100'
                })
                    .accentPalette('deep-orange', {
                    'default': '700'
                });
                $mdThemingProvider.enableBrowserColor({
                    theme: 'default',
                    palette: 'accent',
                    hue: '700'
                });
            }
            return ThemeConfig;
        }());
        Configs.ThemeConfig = ThemeConfig;
    })(Configs = ThingSpeak.Configs || (ThingSpeak.Configs = {}));
})(ThingSpeak || (ThingSpeak = {}));
