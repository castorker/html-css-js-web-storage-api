var webStorageDataService = (function () {

    var _storage = window.localStorage;

    var _ds = {

        storageMechanismTypes: {
            localStorage: 0,
            sessionStorage: 1
        },

        setStorageMechanism: function (mechanism) {
            _storage = mechanism;
        },

        getStorageMechanism: function () {
            return _storage;
        },

        exists: function (key) {
            return _storage[key] !== undefined;
        },

        getByKey: function (key) {
            var returnValue = null,
                value;

            if (_ds.exists(key)) {
                value = _storage[key];

                try {
                    returnValue = JSON.parse(value);
                } catch (e) {
                    if (e.constructor.name === 'SyntaxError') {
                        returnValue = value;
                    }
                }
            }

            return returnValue;
        },

        getAll: function () {
            var dict = {};

            for (var i = 0, len = _storage.length; i < len; i++) {
                key = _storage.key(i);
                dict[key] = _storage[key];
            }

            return dict;
        },

        update: function(key, value) {
            _ds.del(key);
            _ds.save(key, value);
        },

        del: function(key) {
            var returnValue = null,
            value;

            if (_ds.exists(key)) {
                _storage.removeItem(key);
            }
        },

        delAll: function () {
            _storage.clear();
        },

        save: function (key, value) {
            try {
                if (typeof value === 'object') {
                    _storage[key] = JSON.stringify(value);
                } else {
                    _storage[key] = value;
                }
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Storage quota exceeded');
                }
            }
        }
    };

    return _ds;

})();