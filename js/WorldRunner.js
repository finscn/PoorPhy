"use strict";
(function(exports, undefined) {


    var WorldRunner = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    }

    var proto = {

        world: null,
        canvasId: "canvas",
        width: 800,
        height: 480,

        canvas: null,
        context: null,

        frameCount: 0,
        staticTimeStep: null,
        FPS: 60,

        init: function(world) {
            this.world = world || this.world;

            this.canvas = document.getElementById(this.canvasId);
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.context = this.canvas.getContext("2d");
            this.timeout = 1000 / this.FPS >> 0;


            var Me = this;
            this._callRun = function() {
                Me.run();
            }
        },


        start: function() {

            this.lastNow = Date.now();
            this.paused = false;
            this.stopped = false;
            this.frameCount = 0;
            this.run();
        },

        run: function() {
            if (this.stopped) {
                clearTimeout(this.loopId);
                return;
            }
            this.loopId = setTimeout(this._callRun, this.timeout);

            var now = Date.now();
            var timeStep = now - this.lastNow;
            this.lastNow = now;
            if (timeStep > 1 && !this.paused) {
                this.frameCount++;
                if (this.staticTimeStep) {
                    timeStep = this.staticTimeStep;
                }

                this.enterFrame(timeStep, now);

                this.clear(this.context, timeStep, now);
                this.update(timeStep, now);
                this.render(this.context, timeStep, now);

                this.exitFrame(timeStep, now);
            }

        },
        enterFrame: function(timeStep) {

        },
        exitFrame: function(timeStep) {

        },

        update: function(timeStep) {
            this.world.step(timeStep);
        },

        render: function(context, timeStep) {

        },

        clear: function(context, timeStep) {
            context.clearRect(0, 0, this.width, this.height);
        },
        pause: function() {
            this.paused = true;
        },
        resume: function() {
            this.paused = false;
        },
        stop: function() {
            this.stopped = true;
        }
    }

    exports.WorldRunner = Class(WorldRunner,proto);

}(exports));

