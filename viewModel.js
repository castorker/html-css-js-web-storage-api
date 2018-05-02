var viewModel = (function () {

    var storageMechanismRadio,
        storageMechanismKey = 'storage-mechanism';

    var _vm = {

        storageMechanism: function () {

            var form = document.getElementById(storageMechanismKey),
                storageMechanismValue = form.elements[storageMechanismKey].value;

            webStorageDataService.setStorageMechanism(window.localStorage);
            webStorageDataService.save(storageMechanismKey, { value: storageMechanismValue });
            
            if (storageMechanismValue == webStorageDataService.storageMechanismTypes.sessionStorage) {
                mechanism = window.sessionStorage;
            } else {
                mechanism = window.localStorage;
            }

            webStorageDataService.setStorageMechanism(mechanism);
        },

        readAll: function () {

            _vm.reset();

            var notes = webStorageDataService.getAll(),
                count = Object.keys(notes).length,
                div = document.querySelector("#result"),
                message = '';
            
            if ( (count == 0) || (count == 1 && Object.keys(notes)[0] == 'storage-mechanism') ) {
                message = '<h3 class="info">No notes found!</h3>';
                div.innerHTML = message.trim();
            } else {
                message = '<h3 class="info">' + (count - 1) + ' notes found!</h3>';

                var frag = document.createDocumentFragment(),
                    select = document.createElement("select");
        
                select.options.add( new Option("Select a Key", "", true, true) );
            
                for (var i = 0, count; i < count; i++) {
                    key = Object.keys(notes)[i];
                    console.log(key, notes[key]);
                    // select.options.add( new Option(key, notes[key]) );
                    select.options.add( new Option(key, "") );
                }
        
                select.setAttribute("id", "keydll");
                //select.setAttribute("onchange", "viewModel.fillFormWithSavedData(this.options[this.selectedIndex].text, this.value)");
                select.setAttribute("onchange", "viewModel.fillFormWithSavedData(this.options[this.selectedIndex].text)");
        
                frag.appendChild(select);
                div.innerHTML = message.trim();
                div.appendChild(frag);

                // var result = JSON.stringify(notes, null, 4).replace(/\\/g, '');
                // div.innerHTML = '<h3 class="success">' + '<pre>' + result + '</pre>' + '</h3>';
            }
        },

        readByKey: function () {
    
            var key = window.prompt("Enter key");

            if (key === null || key == "") {
                _vm.showResultMessage('<h3 class="warning">No <b>Key</b> has been provided</h3>');
                _vm.reset();
                return; 
            }

            document.getElementById("result").innerHTML = '';

            document.getElementById('key').value = key;

            _vm.fillFormWithSavedData(key);
        },
        
        noteData: function (dateCreated) {
            return {
                name: document.getElementById('name').value,
                projectOrTask: document.getElementById('projectortask').value,
                workYesterday: document.getElementById('workyesterday').value,
                workToday: document.getElementById('worktoday').value,
                impediment: document.getElementById('impediment').value,
                created: dateCreated,
                modified: helperTools.dateTime2()
            };
        },

        createNote: function () {
            var dt = helperTools.dateTime2();
            return _vm.noteData(dt);
        },

        updateNote: function () {
            var dt = document.getElementById('created').value;
            return _vm.noteData(dt);
        },

        validateForm: function (note) {

            for (const key of Object.keys(note)) {
                if (note[key] == "" || note[key] == null || note[key] === undefined) {
                    return false;
                }
                // console.log(key, note[key]);
            }

            return true;
        },

        updateByKey: function () {
            
            var message = '',
                key = '',
                select = document.getElementById("keydll");

            key = document.getElementById('key').value;

            if (key == '') {
                if (select != null) {
                    key = select.options[select.selectedIndex].text;
                }    
            }

            var note = _vm.updateNote();

            if (_vm.validateForm(note)) {
                webStorageDataService.update(key, note);

                message = 'Note with key: ' + key + ' has been updated';
                alert(message);
                _vm.showResultMessage('<h3 class="success">' + message + '</h3>');
                _vm.reset();
            }
        },

        deleteByKey: function () {

            var message = '',
                key = '',
                select = document.getElementById("keydll");

            key = document.getElementById('key').value;

            if (key == '') {
                if (select != null) {
                    key = select.options[select.selectedIndex].text;
                }    
            }            

            if (key != "") {

                if (confirm("This will delete note with key: " + key + "\nAre you sure you want to proceed?")) {

                    if (confirm("You pressed OK!\nAre you sure?")) {

                        webStorageDataService.del(key);

                        message = 'Note with Key ' + key + ' has been removed';
                        alert(message);
                        _vm.showResultMessage('<h3 class="success">'  + message + '</h3>');
                        _vm.reset();
                    }
                }
            }
        },

        deleteAll: function () {
            
            var message = '',
                mechanism = '';

            webStorageDataService.setStorageMechanism(window.localStorage);

            if (webStorageDataService.exists(storageMechanismKey)) {

                var storageMechanismValue = webStorageDataService.getByKey(storageMechanismKey);

                if (storageMechanismValue.value == webStorageDataService.storageMechanismTypes.sessionStorage) {
                    mechanism = 'sessionStorage';
                } else {
                    mechanism = 'localStorage';
                }
            }

            if (confirm("This will delete all the notes saved in the Web Storage.\nAre you sure you want to proceed?")) {
                
                if (confirm("You pressed OK!\nAre you sure?")) {
                    webStorageDataService.delAll();

                    storageMechanismRadio[value="0"].checked = false;
                    storageMechanismRadio[value="1"].checked = false;
    
                    message = 'All notes deleted. Web Storage ' + mechanism + ' has been cleared.';
                    alert(message);
                    _vm.showResultMessage('<h3 class="info">'  + message + '</h3>');
                }
            } 
        },        

        save: function () {

            var note = _vm.createNote(),
                message = '';

            if (_vm.validateForm(note)) {
                var key = helperTools.uuidv4();
                console.log(key);

                webStorageDataService.save(key, note);
                
                document.getElementById('created').value = note.created;
                document.getElementById('modified').value = note.modified;

                message = 'New note has been created with key: ' + key;
                alert(message);
                document.getElementById("result")
                        .innerHTML = '<h2 class="default">Last result:</h2>' + '<h3 class="success">' + message + '</h3>';
                //vm.showResultMessage('<h3 class="success">' + message + '</h3>');

                _vm.reset();
            } else {
                _vm.showResultMessage('<h3 class="danger">All required fields must be filled out</h3>');
            }
        },

        //fillFormWithSavedData: function (key, value) {
        fillFormWithSavedData: function (key) {
            
            // We could have loaded the data into the dropdown-list and get it from there but ... performance ...
            // The idea is to fetch the data from Web Storage as if we were connected to a real database.
            // var note = JSON.parse(value);

            if (helperTools.isUUID(key)) {

                var note = webStorageDataService.getByKey(key);

                if (note !== null) {
                    document.getElementById('name').value = note.name;
                    document.getElementById('projectortask').value = note.projectOrTask;
                    document.getElementById('workyesterday').value = note.workYesterday;
                    document.getElementById('worktoday').value = note.workToday;
                    document.getElementById('impediment').value = note.impediment;
                    document.getElementById('created').value = note.created;
                    document.getElementById('modified').value = note.modified;
    
                    // enable updatebtn and deletebykeybtn, disable createbtn
                    document.getElementById('createbtn').disabled = true;
                    document.getElementById('updatebtn').disabled = false;
                    document.getElementById('deletebykeybtn').disabled = false;
                } else {
                    var message = '<h3 class="info">Key ' + key + ' not found!</h3>';
                    _vm.showResultMessage(message);
                    _vm.reset();
                }
            } else {
                var message = '<h3 class="warning">Key ' + key + ' is not valid!</h3>';
                _vm.showResultMessage(message);
                _vm.reset();
            }
        },
        
        showResultMessage: function (message) {
            var el = document.getElementById("result");
            el.innerHTML = '<h2 class="default">Last result:</h2>' + message;
            helperTools.fadeIn(el, 3000); //first argument is the element and second the animation duration in ms
        },

        scheduleAutoCheck: function () {
            var seconds = 10000,
                message = '';

            var interval = setInterval(function () {

                if(document.querySelector('input[name="storage-mechanism"]:checked') == null) {
                    message = "No Web Storage mechanism configured.\nYou have to select one.";
                    window.alert(message);
                    _vm.showResultMessage('<h3 class="danger">' + message + '</h3>');
                }

                // _vm.save();

            }, seconds);
        },

        changeClass: function (selectedElement) {

            var activeElement = document.querySelector(".active");

            if ( (activeElement != null) && (activeElement.className.match(/(?:^|\s)active(?!\S)/) ) ) {
                activeElement.className = activeElement.className.replace( /(?:^|\s)active(?!\S)/g , '' );
            }

            selectedElement.className = 'active';
        },

        reset: function  () {
            document.getElementById('new-note-form').reset();
            document.getElementById('key').value = '';

            var select = document.getElementById("keydll");
            if (select !== null) {
                select.selectedIndex = 0;
            }
            
            // disable updatebtn and deletebykeybtn, enable createbtn
            document.getElementById('createbtn').disabled = false;
            document.getElementById('updatebtn').disabled = true;
            document.getElementById('deletebykeybtn').disabled = true;
        },

        init: function () {
            
            storageMechanismRadio = document.getElementById('storage-mechanism')
                                            .elements['storage-mechanism'];
    
            webStorageDataService.setStorageMechanism(window.localStorage);

            if (webStorageDataService.exists(storageMechanismKey)) {

                var storageMechanismValue = webStorageDataService.getByKey(storageMechanismKey);

                if (storageMechanismValue.value == webStorageDataService.storageMechanismTypes.sessionStorage) {
                    mechanism = window.sessionStorage;
                } else {
                    mechanism = window.localStorage;
                }

                webStorageDataService.setStorageMechanism(mechanism);

                storageMechanismRadio[value=storageMechanismValue.value].checked = true;
            }

            _vm.scheduleAutoCheck();
        }
    };

   _vm.init();
   return _vm;

})();