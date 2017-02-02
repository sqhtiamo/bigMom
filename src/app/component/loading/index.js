module.exports = {

    show: function () {

        document.getElementById('page').style.display = 'none';
        document.getElementById('loading').style.display = 'block';

    },

    hide: function () {
        document.getElementById('page').style.display = 'block';
        document.getElementById('loading').style.display = 'none';

    }

};
