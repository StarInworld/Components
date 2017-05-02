    (function() {
        var ctor = function() {};
        var inherits = function(parent, protoProps) {
            var child;

            if (protoProps && protoProps.hasOwnProperty('constructor')) {
                child = protoProps.constructor;
            } else {
                child = function() {
                    return parent.apply(this, arguments);
                };
            }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor();

            if (protoProps) extend(child.prototype, protoProps);

            child.prototype.constructor = child;
            child.__super__ = parent.prototype;
            return child;
        };

        function extend(target, ref) {
            var name, value;
            for (name in ref) {
                value = ref[name];
                if (value !== undefined) {
                    target[name] = value;
                }
            }
            return target;
        }
        var Undo = {
            version: '1.0'
        };
        Undo.Stack = function() {
            this.commands = [];
            this.stackPosition = -1;
        };
        extend(Undo.Stack.prototype, {
            execute: function(command) {
                this._clearRedo();
                command.execute();
                this.commands.push(command);
                this.stackPosition++;
            },
            undo: function() {
                this.commands[this.stackPosition].undo();
                this.stackPosition--;
            },
            canUndo: function() {
                return this.stackPosition >= 0;
            },
            redo: function() {
                this.stackPosition++;
                this.commands[this.stackPosition].redo();
            },
            canRedo: function() {
                return this.stackPosition < this.commands.length - 1;
            },
            _clearRedo: function() {
                this.commands = this.commands.slice(0, this.stackPosition + 1);
            }
        });

        Undo.Command = function(name) {
            this.name = name;
        };

        var err = new Error("override me!");

        extend(Undo.Command.prototype, {
            execute: function() {
                throw err
            },
            undo: function() {
                throw err
            },
            redo: function() {
                this.execute();
            }
        });

        Undo.Command.extend = function(protoProps) {
            var child = inherits(this, protoProps);
            child.extend = Undo.Command.extend;
            return child;
        };

        this.Undo = Undo;
    }).call(window);
