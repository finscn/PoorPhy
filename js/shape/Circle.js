"use strict";

(function(exports, undefined) {


    var Circle = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Circle.superclass = exports.Shape;

    var proto = {

        shapeType: ShapeType.Circle,

        radius: 0,
        radiusSq: 0,


        init: function() {

            this.radiusSq = this.radius * this.radius;
            this.initMassData();

            if (!this.centre){
                this.centre=[this.x||0,this.y||0];
            }
            if (this.x===null){
                this.x=this.centre[0];
            }
            if (this.y===null){
                this.y=this.centre[1];
            }
            this.originalX=this.x;
            this.originalY=this.y;

            this.setAngle(this.angle||0);

            this.last={};
            this.aabb = [0,0,0,0];
            this.initLocalData();



        },

        initLocalData : function(){
            this.localCentre=[this.centre[0]-this.x,this.centre[1]-this.y];
        },

        initMassData: function() {

            this.density = this.density || 1;
            this.area = Math.PI * this.radiusSq;

            this.setMass(this.mass);
            this.originalInertia=this.mass * this.radiusSq /2 ;
            this.setInertia(this.inertia!==null?this.inertia:this.originalInertia);

        },

        translateCentroid : function(x,y){
            this.x+=x;
            this.y+=y;
            var localCentre=this.localCentre;
            localCentre[0]-=x;
            localCentre[1]-=y;
        },
        


        updateVertices: function() {
            this.updateCentre();
            this.updateAABB();
        },

        updateCentre: function() {
            var ox = this.localCentre[0],
                oy = this.localCentre[1];
            if (ox!==0||oy!==0){
                var x = ox * this.cos - oy * this.sin;
                oy = ox * this.sin + oy * this.cos;
                ox=x;
            }
            this.centre[0] = ox + this.x;
            this.centre[1] = oy + this.y;
        },


        setAngle: function(angle) {
            this.angle = angle;
            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);
        },


        update: function() {
            this._updatedCount++;

            // this.setPos(this.x,this.y);
            this.setAngle(this.angle);
            this.updateCentre();
            this.updateAABB();

        },

        updateAABB: function() {
            var b=this.radius + this.aabbExtension;
            var x=this.centre[0], y=this.centre[1];
            this.aabb[0] = x - b;
            this.aabb[1] = y - b;
            this.aabb[2] = x + b;
            this.aabb[3] = y + b;
        },
        
        containPoint : function(x, y) {
            var dx=x-this.centre[0],
                dy=y-this.center[1];

            return (dx*dx+dy*dy)<this.radiusSq;
        },
    };




    exports.Circle = Class.create(Circle,proto);

}(exports));

