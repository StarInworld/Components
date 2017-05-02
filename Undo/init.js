var EditCommand = Undo.Command.extend({
    constructor: function(textarea, oldValue, newValue) {
        this.textarea = textarea;
        this.oldValue = oldValue;
        this.newValue = newValue;
    },
    execute: function() {},
    undo: function() {
        this.textarea.innerText = this.oldValue;
    },
    redo: function() {
        this.textarea.innerText = this.newValue;
    }
});
var text = document.getElementById('text'),
    startValue = text.innerText,
    timer;
document.onkeyup = function(event) {
    clearTimeout(timer);
    timer = setTimeout(function() {
        var newValue = text.innerText;
        if (newValue != startValue) {
            // console.log(new EditCommand(text, startValue, newValue));
            stack.execute(new EditCommand(text, startValue, newValue));
            startValue = newValue;
        }
    }, 250);
};
