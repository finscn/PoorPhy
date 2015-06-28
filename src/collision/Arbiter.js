"use strict";

var PP = PP || {};

(function(exports, undefined) {

    var Class = exports.Class;
    var BodyType = exports.BodyType;

    var Arbiter = function(bodyA, bodyB) {

        this.contacts = [];

    };


    var proto = {

        bodyA: null,
        bodyB: null,
        normal: null,

        restitution: 0,
        friction: 0,
        contacts: null,

        sensor: false,

        restitutionVelocity: 1,
        splittingFrame: 3,

        collisionSlop: 0.01,
        // collisionSlop: 0,

        set: function(bodyA, bodyB, normalA) {
            this.bodyA = bodyA;
            this.bodyB = bodyB;
            this.key = bodyA.id + "_&_" + bodyB.id;
            this.normal = normalA;
            this.tangent = [-normalA[1], normalA[0]];

            this.restitution = Math.max(bodyA.restitution, bodyB.restitution);
            this.friction = Math.sqrt(bodyA.friction * bodyB.friction)
            this.sensor = bodyA.sensor || bodyB.sensor;

            this.contactCount = this.contacts.length = 0;

            this.lastDataA = this.lastDataB = {};

            this.disabled = false;
        },


        addContact: function(contactOnA, contactOnB, depth) {

            var normal = this.normal;
            var tangent = this.tangent;
            var bodyA = this.bodyA,
                bodyB = this.bodyB;

            if (depth === undefined) {
                depth = (contactOnA[0] - contactOnB[0]) * normal[0] + (contactOnA[1] - contactOnB[1]) * normal[1];
            }

            depth -= this.collisionSlop;

            var armA = [contactOnA[0] - bodyA.x, contactOnA[1] - bodyA.y];
            var armB = [contactOnB[0] - bodyB.x, contactOnB[1] - bodyB.y];


            var armACrossN = armA[0] * normal[1] - armA[1] * normal[0];
            armACrossN *= armACrossN;
            var armBCrossN = armB[0] * normal[1] - armB[1] * normal[0];
            armBCrossN *= armBCrossN;


            var armACrossT = armA[0] * tangent[1] - armA[1] * tangent[0];
            armACrossT *= armACrossT;
            var armBCrossT = armB[0] * tangent[1] - armB[1] * tangent[0];
            armBCrossT *= armBCrossT;


            var denom = bodyA.invMass + bodyB.invMass + (armACrossN * bodyA.invInertia) + (armBCrossN * bodyB.invInertia);
            var normalMass = !denom ? 0 : 1 / denom;

            var denom = bodyA.invMass + bodyB.invMass + (armACrossT * bodyA.invInertia) + (armBCrossT * bodyB.invInertia);
            var tangentMass = !denom ? 0 : 1 / denom;

            // var denom = bodyA.mass * bodyA.invMass + bodyB.mass * bodyB.invMass + bodyA.mass * bodyA.invInertia * armACrossN + bodyB.mass * bodyB.invInertia * armBCrossN;
            // var equalizedMass = !denom ? 0 : 1 / denom;

            var velocityBias = null;

            var contact = {
                contactOnA: contactOnA,
                contactOnB: contactOnB,
                armA: armA,
                armB: armB,
                depth: depth,
                normalImpulse: 0,
                tangentImpulse: 0,
                normalMass: normalMass,
                tangentMass: tangentMass,
                velocityBias: velocityBias,
                // equalizedMass: equalizedMass,
            }
            this.contacts.push(contact);
            this.contactCount++;
        },

        isFirstContact: function() {

        },

        preSolve: function(timeStep) {
            if (this.isFirstContact()) return;

            var bodyA = this.bodyA;
            var bodyB = this.bodyB;
            var normal = this.normal;

            for (var i = 0; i < this.contacts.length; i++) {
                var con = this.contacts[i];

                var armA = con.armA;
                var armB = con.armB;
                // var nx = con.normal[0];
                // var ny = con.normal[1];
                var nx = normal[0],
                    ny = normal[1];
                var impX = nx * con.normalImpulse - ny * con.tangentImpulse,
                    impY = nx * con.tangentImpulse + ny * con.normalImpulse;

                bodyA.velX += (impX * bodyA.invMass);
                bodyA.velY += (impY * bodyA.invMass);
                bodyA.velAng += (armA[0] * impY - armA[1] * impX) * bodyA.invInertia;
                bodyB.velX -= (impX * bodyB.invMass);
                bodyB.velY -= (impY * bodyB.invMass);
                bodyB.velAng -= (armB[0] * impY - armB[1] * impX) * bodyB.invInertia;

            }
        },

        solve: function(timeStep, iterations, iter) {

            var bodyA = this.bodyA,
                bodyB = this.bodyB,
                normal = this.normal,
                tangent = this.tangent;
            var restitution = this.restitution,
                friction = this.friction,
                sensor = this.sensor;
            var lastDataA, lastDataB
            var solved = false;

            var contacts = this.contacts;
            var contactCount = contacts.length;

            // if (contactCount>1){
            //     var c0 = contacts[0];
            //     var c1 = contacts[1];
            //     // console.log(c0.depth>c1.depth)
            // }
            var rvN = null;
            for (var k = 0; k < contactCount; k++) {
                var contact = contacts[k];

                var contactOnA = contact.contactOnA;
                var contactOnB = contact.contactOnB;
                var armA = contact.armA,
                    armB = contact.armB;
                var depth = contact.depth,
                    normalMass = contact.normalMass,
                    tangentMass = contact.tangentMass;

                if (!solved) {
                    solved = true;
                    this.lastDataA = {
                        velX: bodyA.velX,
                        velY: bodyA.velY,
                        velAng: bodyA.velAng,
                    };
                    this.lastDataB = {
                        velX: bodyB.velX,
                        velY: bodyB.velY,
                        velAng: bodyB.velAng,
                    }
                }

                var relativeVel = [
                    (bodyA.velX - bodyA.velAng * armA[1]) - (bodyB.velX - bodyB.velAng * armB[1]), (bodyA.velY + bodyA.velAng * armA[0]) - (bodyB.velY + bodyB.velAng * armB[0])
                ];
                var normalRelativeVel = relativeVel[0] * normal[0] + relativeVel[1] * normal[1];

                // TODO velocityBias
                // if (contactCount==1){
                if (contact.velocityBias === null) {
                    contact.velocityBias = -restitution * normalRelativeVel / iterations / contactCount;
                } else {

                }
                // }else{
                //     contact.velocityBias=0;
                // }

                if (depth > 0) {

                    // TODO : awake or not ?
                    if (bodyA.bodyType !== BodyType.Static && bodyB.bodyType !== BodyType.Static) {
                        // bodyA.awake();
                        // bodyB.awake();
                    }
                    // TODO :  improve stability
                    var dt = timeStep;
                    var dd = depth;
                    normalRelativeVel += dd / dt; // ( (dd/iterations) / (dt/iterations) )
                    contact.depth -= dd / iterations;

                    // var dt = timeStep;
                    // var dd = depth / this.splittingFrame;
                    // normalRelativeVel += dd / dt;
                    // contact.depth -= dd/iterations;

                }


                var impN = normalMass * -(normalRelativeVel + contact.velocityBias);
                var normalImpulse = contact.normalImpulse;
                contact.normalImpulse = Math.min(impN + normalImpulse, 0)
                impN = contact.normalImpulse - normalImpulse;
                // var impX = normal[0] * impN,
                //     impY = normal[1] * impN;
                // bodyA.velX += (impX * bodyA.invMass);
                // bodyA.velY += (impY * bodyA.invMass);
                // bodyA.velAng += (armA[0] * impY - armA[1] * impX) * bodyA.invInertia;
                // bodyB.velX -= (impX * bodyB.invMass);
                // bodyB.velY -= (impY * bodyB.invMass);
                // bodyB.velAng -= (armB[0] * impY - armB[1] * impX) * bodyB.invInertia;

                // var relativeVel = [
                //     (bodyA.velX - bodyA.velAng * armA[1]) - (bodyB.velX - bodyB.velAng * armB[1]), (bodyA.velY + bodyA.velAng * armA[0]) - (bodyB.velY + bodyB.velAng * armB[0])
                // ]

                var tangentRelativeVel = relativeVel[0] * tangent[0] + relativeVel[1] * tangent[1];

                var impT = tangentMass * -tangentRelativeVel;
                var frictionImp = Math.abs(contact.normalImpulse * friction);
                var tangentImpulse = contact.tangentImpulse;
                contact.tangentImpulse = Math.max(-frictionImp, Math.min(impT + tangentImpulse, frictionImp));
                impT = contact.tangentImpulse - tangentImpulse;

                // var impX = -normal[1] * impT,
                //     impY = normal[0] * impT;
                // bodyA.velX += (impX * bodyA.invMass);
                // bodyA.velY += (impY * bodyA.invMass);
                // bodyA.velAng += (armA[0] * impY - armA[1] * impX) * bodyA.invInertia;
                // bodyB.velX -= (impX * bodyB.invMass);
                // bodyB.velY -= (impY * bodyB.invMass);
                // bodyB.velAng -= (armB[0] * impY - armB[1] * impX) * bodyB.invInertia;


                // console.log(normal[0]==0,impT==0)


                var impX = normal[0] * impN - normal[1] * impT,
                    impY = normal[0] * impT + normal[1] * impN;
                bodyA.velX += (impX * bodyA.invMass);
                bodyA.velY += (impY * bodyA.invMass);
                bodyA.velAng += (armA[0] * impY - armA[1] * impX) * bodyA.invInertia;
                bodyB.velX -= (impX * bodyB.invMass);
                bodyB.velY -= (impY * bodyB.invMass);
                bodyB.velAng -= (armB[0] * impY - armB[1] * impX) * bodyB.invInertia;

            }

            return solved;
        },

    };


    exports.Arbiter = Class.create(Arbiter, proto);

}(PP));
