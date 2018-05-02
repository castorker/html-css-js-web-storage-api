var helperTools = (function () {

    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    };

    var _ht = {

        // RFC 4122 - A Universally Unique IDentifier (UUID) URN Namespace
        uuidv4: function() {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => 
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
        },

        // validate a UUID version 4
        isUUID: function (uuidv4){
            return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuidv4);
        },

        // date format in DD/MM/YYYY HH:MM:SS
        dateTime1: function () {
            var d = new Date(),
                cur_date = d.getDate(),
                cur_month = d.getMonth(),
                cur_year = d.getFullYear(),
                cur_hour = d.getHours(),
                cur_min = d.getMinutes(),
                cur_sec = d.getSeconds();
            cur_month++;
            return (cur_date + "/" + cur_month + "/" + cur_year + ' ' + cur_hour + ':' + cur_min + ':' + cur_sec);
        },

        // date format in DD/MM/YYYY HH:MM:SS
        dateTime2: function () {
            var d = new Date,
            dformat = [
                d.getDate().padLeft(),
                (d.getMonth() + 1).padLeft(),
                d.getFullYear()].join('/') + ' ' +
                [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
            return dformat; // 05/01/2018 02:59:45
        },

        fadeIn: function (el, time) {
            el.style.opacity = 0;
            
            var last = +new Date();
            var tick = function() {
                el.style.opacity = +el.style.opacity + (new Date() - last) / time;
                last = +new Date();
            
                if (+el.style.opacity < 1) {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
                }
            };
            
            tick();
        }
    };

    return _ht;

})();