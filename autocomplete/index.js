'use strict';

import {autocomplete} from './autocomplete.js';

export function attachAutoComplete(input, values) {
    function fireKeyDown(el) {
        var key = 40;
        if(document.createEventObject) {
            var eventObj = document.createEventObject();
            eventObj.keyCode = key;
            el.fireEvent("onkeyup", eventObj);
        } else if(document.createEvent) {
            var eventObj = document.createEvent("Events");
            eventObj.initEvent("keyup", true, true);
            eventObj.which = key;
            el.dispatchEvent(eventObj);
        }
    }

    input.addEventListener("mouseup", function() { fireKeyDown(this); });
    input.addEventListener("change", function () {
        console.log("Change");
        if(countries.length==0 || countries.includes(this.value)) {
            this.placeholder = this.value;
            this.value="";
        }
    });

    var items = values.map(function (n) { return { label: n }});
    autocomplete({
        input: input,
        minLength: 0,
        onSelect: function (item, inputField) {
            console.log("Change");
            var value = item.label;
            if(values.length==0 || values.includes(value)) {
                inputField.placeholder = value;
                inputField.value="";
            }
        },
        fetch: function (text, callback) {
            var match = text.toLowerCase();
            callback(items.filter(function(n) {
                return n.label.toLowerCase().indexOf(match) !== -1;
            }));
        },
    });
}
