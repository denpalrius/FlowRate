var Flux;
(function (Flux) {
    var Configs;
    (function (Configs) {
        var ThemeConfig = (function () {
            function ThemeConfig($mdThemingProvider, $mdIconProvider) {
                $mdThemingProvider.theme('default')
                    .primaryPalette('blue', {
                    'default': '400',
                    'hue-1': '500',
                    'hue-2': '800',
                    'hue-3': 'A100'
                })
                    .accentPalette('deep-orange', {
                    'default': '700'
                });
                $mdThemingProvider.enableBrowserColor({
                    theme: 'default',
                    palette: 'primary',
                    hue: '700'
                });
            }
            return ThemeConfig;
        }());
        Configs.ThemeConfig = ThemeConfig;
    })(Configs = Flux.Configs || (Flux.Configs = {}));
})(Flux || (Flux = {}));
