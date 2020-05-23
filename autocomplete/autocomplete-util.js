'use strict';

import {autocomplete} from './autocomplete.js';

function objectFlip(obj) {
    return Object.keys(obj).reduce((ret, key) => {
      ret[obj[key]] = key;
      return ret;
    }, {});
}

function getRealValue(input, label) {
    if(input._revMap) {
        return input._revMap[label];
    }
    return label;
}

export function attachAutoCompleteObjectAttributes(input, object) {
    let valueLabelArray = [];
    attachAutoComplete(input, Object.values(object));
    input._revMap=objectFlip(object);
}

export function attachAutoComplete(input, labels) {
    input._revMap = null;
    if(input._autoComp) {
        input._autoComp.destroy();
    }

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

    var items = labels.map(function (n) { return { label: n }});
    input._autoComp = autocomplete({
        input: input,
        minLength: 0,
        onSelect: function (item, inputField) {
            var value = item.label;
            if(labels.length==0 || labels.includes(value)) {
                inputField._value=getRealValue(inputField, value);
                inputField.placeholder = value;
                inputField.value="";
                var event = new Event('change');
                inputField.dispatchEvent(event);
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
