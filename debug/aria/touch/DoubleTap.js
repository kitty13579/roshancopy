/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Contains delegated handler for a double tap event
 */
Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.DoubleTap",
    $extends : "aria.touch.Gesture",
    $statics : {
        /**
         * The move tolerance to validate the gesture.
         * @type Integer
         */
        MARGIN : 10,
        /**
         * The delay between the taps.
         * @type Integer
         */
        BETWEEN_DELAY: 200
    },
    $prototype : {
        /**
         * Initial listeners for the DoubleTap gesture.
         * @protected
         */
        _getInitialListenersList: function() {
            return [{evt: this.touchEventMap.touchstart, cb: {fn : this._doubleTapStart, scope : this}}];
        },

        /**
         * Additional listeners for the DoubleTap gesture.
         * @protected
         */
        _getAdditionalListenersList: function() {
            return [{evt: this.touchEventMap.touchmove, cb: {fn : this._doubleTapMove, scope : this}},
                    {evt: this.touchEventMap.touchend, cb: {fn : this._doubleTapEnd, scope : this}}];
        },

        /**
         * The fake events raised during the DoubleTap lifecycle.
         * @protected
         */
        _getFakeEventsMap : function() {
            return {doubletapstart: "doubletapstart", cancel: "doubletapcancel", finalize: "doubletap"};
        },

        /**
         * DoubleTap start mgmt: gesture is started if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleTapStart : function (event) {
            var status = this._gestureStart(event);
            if (status == null) {
                if (this.timerId) {
                    //Gesture already started so it has to be cancelled if multi-touch.
                    return this._doubleTapCancel(event);
                }
                else {
                    return (event.returnValue != null)? event.returnValue: !event.defaultPrevented;
                }
            }
            if (this.timerId) {
                //Second tap starting
                aria.core.Timer.cancelCallback(this.timerId);
                return status;
            }
            else {
                //First tap starting
                return this._raiseFakeEvent(event, this._getFakeEventsMap().doubletapstart);
            }
        },

        /**
         * DoubleTap move mgmt: gesture continues if only one touch and if the move is within margins.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleTapMove : function(event) {
            var position = aria.touch.Event.getPositions(event);
            if (this.MARGIN >= this._calculateDistance(this.startData.positions[0].x, this.startData.positions[0].y, position[0].x, position[0].y)) {
                var status = this._gestureMove(event);
                return (status == null)? this._doubleTapCancel(event): status;
            }
            else {
                return this._doubleTapCancel(event);
            }
        },

        /**
         * DoubleTap end mgmt: gesture ends if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleTapEnd : function (event) {
            var status = this._gestureEnd(event);
            if (status == null) {
                return this._doubleTapCancel(event);
            }
            else if (this.timerId) {
                //Second tap ending, fake event raised
                this.timerId = null;
                return this._raiseFakeEvent(event, this._getFakeEventsMap().finalize);
            }
            else {
                //First tap ending, timer created to wait for second tap
                this.timerId = aria.core.Timer.addCallback({
                    fn : this._doubleTapFinalCancel,
                    scope : this,
                    delay : this.BETWEEN_DELAY,
                    args: event
                });
                return status;
            }
        },

        /**
         * doubleTap cancellation.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleTapCancel : function (event) {
            if (this.timerId) {
                aria.core.Timer.cancelCallback(this.timerId);
                this.timerId = null;
            }
            return this._gestureCancel(event);
        },

        /**
         * DoubleTap cancellation outside the lifecycle window, used if timer expires between the two taps.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleTapFinalCancel: function(event) {
            if (this.timerId) {
                aria.core.Timer.cancelCallback(this.timerId);
                this.timerId = null;
            }
            return this._raiseFakeEvent(event, this._getFakeEventsMap().cancel);
        }
    }
});
