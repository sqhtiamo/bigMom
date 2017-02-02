var app = require('angular').module('app');

app.directive('draggable', function () {
    return {

        link: function ($scope, $el, attrs, controller) {
            // this gives us the native JS object

            var el = $el[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function (ev) {
                    ev.dataTransfer.effectAllowed = 'move';
                    ev.dataTransfer.setData('Text', this.id);
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function (ev) {

                    this.classList.remove('drag');
                    return false;
                },
                false
            );
        }
    };
});

