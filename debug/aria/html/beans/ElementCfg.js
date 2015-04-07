/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.beanDefinitions({
    $package : "aria.html.beans.ElementCfg",
    $description : "Base configuration for Element widget.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "html" : "aria.templates.CfgBeans"
    },
    $beans : {
        "Properties" : {
            $type : "json:Object",
            $description : "All properties that can be used in Element widget.",
            $properties : {
                "id" : {
                    $type : "json:String",
                    $description : "Unique id (within the template) to associate to the widget - if not provided, a unique id will automatically be generated by the framework",
                    $mandatory : false
                },
                "tagName" : {
                    $type : "json:String",
                    $description : "Qualified name of the Element node",
                    $sample : "div",
                    $mandatory : true
                },
                "attributes" : {
                    $type : "html:HtmlAttribute",
                    $default : {}
                },
                "bind" : {
                    $type : "json:Object",
                    $description : "List of properties that can be bound to this widget. Values should match bean aria.widgetLibs.CommonBeans.BindRef",
                    $default : {},
                    $restricted : false
                },
                "on" : {
                    $type : "json:Object",
                    $description : "List of registered events and their callbacks. Values can be single objects that match the bean aria.widgetLibs.CommonBeans.Callback or an array of them.",
                    $default : {},
                    $restricted : false
                }
            },
            $restricted : false
        }
    }
});
