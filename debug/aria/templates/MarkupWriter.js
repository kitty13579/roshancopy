/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
(function () {
    /**
     * Writer object used to manage the HTML output generated by a template
     * @class aria.templates.MarkupWriter
     */
    Aria.classDefinition({
        $classpath : 'aria.templates.MarkupWriter',
        $dependencies : ['aria.templates.Section', 'aria.utils.Delegate', 'aria.templates.DomEventWrapper',
                'aria.utils.Type'],
        $constructor : function (tplCtxt, options) {

            /**
             * list of markup chunks added during the template processing
             * @type Array
             */
            this._out = [];

            /**
             * stack of containers
             * @type Array
             */
            this._ctrlStack = [];

            /**
             * Template object
             */
            this.tplCtxt = tplCtxt;

            /**
             * A root section is always created. It will be used either to just get its generated HTML or as the main
             * section, when the section being refreshed is the main one.
             * @protected
             * @type aria.templates.Section
             */
            this._topSection = new aria.templates.Section(this.tplCtxt, null, {
                isRoot : true,
                ownIdMap : options && options.ownIdMap
            });

            /**
             * Current containing section.
             * @protected
             * @type aria.templates.Section
             */
            this._currentSection = this._topSection;

            /**
             * Map of event delegation for "on" event. Event delegation have to be grouped to have only one property in
             * the markup. Delegation will be performed when '>' is written
             * @type Object
             */
            this._delegateMap = null;
        },
        $destructor : function () {
            this._currentSection = null;
            this._delegateMap = null;
            if (this._topSection) {
                // if there are still behaviors dispose them cleanly
                this._topSection.$dispose();
                this._topSection = null;
            }
        },
        $prototype : {
            /**
             * If a container widget sets skipContent to true, the container's content will be skipped.
             * @type Boolean
             */
            skipContent : false,

            /**
             * Begin a new standard section, or a repeater section (depending on the second parameter).
             * @param {aria.templates.CfgBeans:SectionCfg|aria.templates.CfgBeans:RepeaterCfg} sectionParam section
             * @param {Function} sectionConstructor may be either aria.templates.Section or aria.templates.Repeater
             */
            _beginSectionOrRepeater : function (sectionParam, sectionConstructor) {

                var newSection = new sectionConstructor(this.tplCtxt, sectionParam);

                if (!newSection.cfgOk) {
                    // TODO: log error
                    newSection.$dispose();
                    newSection = new aria.templates.Section(this.tplCtxt, {});
                }

                if (this._currentSection) {
                    this._currentSection.addSubSection(newSection); // add the section to its parent
                }
                // only set the id after the section has been added to its parent
                newSection.writeBegin(this);
                // Update current section with new created section
                this._currentSection = newSection;
                newSection.writeContent(this);
            },

            /**
             * Process a repeater statement. Note that before calling this method, the Repeater class must already be
             * loaded (templates which use the repeater automatically have a dependency on the Repeater, anyway).
             * @param {aria.templates.CfgBeans:RepeaterCfg} sectionParam section configuration object
             */
            repeater : function (repeaterParam) {
                this._beginSectionOrRepeater(repeaterParam, aria.templates.Repeater);
                this.endSection();
            },

            /**
             * Begin a new typed section
             * @param {aria.templates.CfgBeans:SectionCfg} sectionParam section configuration object
             */
            beginSection : function (sectionParam) {
                this._beginSectionOrRepeater(sectionParam, aria.templates.Section);
            },

            /**
             * End the current section
             */
            endSection : function () {
                var section = this._currentSection;
                section.writeEnd(this);
                this._currentSection = section.parent;
                this.$assert(99, !!this._currentSection);
            },

            /**
             * Add the given object to the stack. Used to track containers in the markup structure.
             * @param {Object} ctrl object to add to the stack
             */
            addToCtrlStack : function (ctrl) {
                this._ctrlStack.push(ctrl);
            },

            /**
             * Remove the object last added to the stack and returns it. If there is no object, do nothing and return
             * undefined.
             * @return {Object} the object last added to the stack or undefined if there is no object
             */
            removeFromCtrlStack : function () {
                return this._ctrlStack.pop();
            },

            /**
             * Put markup in current output stream
             * @param {String} m the HTML markup to write in the current output
             */
            write : function (m) {
                if (this._delegateMap) {
                    if (m || m === 0) {
                        // String cast
                        m = '' + m;
                        var closingIndex = m.indexOf(">");
                        if (closingIndex != -1) {
                            var delegateMap = this._delegateMap;
                            this._delegateMap = null;
                            // delegate function that will call the good callback for the good event
                            var handler = function (event) {
                                var eventWrapper = new aria.templates.DomEventWrapper(event), result = true;
                                var targetCallback = delegateMap[event.type];
                                if (targetCallback) {
                                    result = targetCallback.call(eventWrapper);
                                }
                                eventWrapper.$dispose();
                                return result;
                            };
                            var delegateId = aria.utils.Delegate.add(handler);
                            this._currentSection.delegateIds.push(delegateId);
                            this._out.push(m.substring(0, closingIndex));
                            this._out.push(" " + aria.utils.Delegate.getMarkup(delegateId));
                            this._out.push(m.substring(closingIndex));

                            return;
                        }
                    }
                }
                this._out.push(m);

            },

            /**
             * Add a delegate function on current markup
             * @param {String} eventName
             * @param {aria.core.CfgBeans:Callback} callback
             */
            pushDelegate : function (eventName, callback) {

                // do nothing if no section is defined (partial refresh usecase)
                if (!this._currentSection) {
                    return;
                }

                var delegate = aria.utils.Delegate;

                // Fallback mechanism for event that can not be delegated
                if (!delegate.isDelegated(eventName)) {
                    var delegateId = delegate.add(callback);
                    this._currentSection.delegateIds.push(delegateId);
                    this.write(delegate.getFallbackMarkup(eventName, delegateId, true));
                    return;
                }

                // transform callback description into a new callback that will be use by the function doing dispatch
                callback = new aria.utils.Callback(callback);
                this._currentSection.delegateCallbacks.push(callback);

                if (!this._delegateMap) {
                    this._delegateMap = {};
                }

                this._delegateMap[eventName] = callback;

            },

            /**
             * Register widget behavior in current stack so that it will be automatically initialized when markup is
             * inserted
             * @param {Array} array of behaviors to register
             */
            registerBehavior : function (bhv) {
                if (this._currentSection) {
                    this._currentSection.addBehavior(bhv);
                }
            },

            /**
             * Call a macro of the current template.
             */
            callMacro : function (macro) {
                this.tplCtxt._callMacro(this, macro);
            },

            /**
             * Return the top section. In the context of a partial refresh, this will be the section to refresh only
             * @return {aria.templates.Section}
             */
            getSection : function () {
                var res = this._topSection;
                res.html = this._out.join("");
                this._delegate = null;
                this._out = null;
                this._topSection = null; // so that the section is not disposed in the MarkupWriter destructor
                return res;
            }
        }
    });
})();
