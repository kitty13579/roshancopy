/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Bean definitions associated to the aria.modules.RequestMgr
 */
Aria.beanDefinitions({
    $package : "aria.modules.RequestBeans",
    $description : "Definition of the JSON beans used to set application variables",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "env" : "aria.modules.requestHandler.environment.RequestHandlerCfgBeans"
    },
    $beans : {
        "RequestObject" : {
            $type : "json:Object",
            $description : "Request Object passed to submitJsonRequest",
            $restricted : false,
            $properties : {
                "moduleName" : {
                    $type : "json:String",
                    $description : "The classpath of the enclosing module, i.e. myApp.moduleName",
                    $mandatory : true
                },
                "actionName" : {
                    $type : "json:String",
                    $description : "The name of the target action, including an optional HTTP Query String",
                    $mandatory : false
                },
                "serviceSpec" : {
                    $type : "json:ObjectRef",
                    $description : "specification of target service; structure depends on particular UrlService implementation",
                    $mandatory : false
                },
                "session" : {
                    $type : "json:ObjectRef",
                    $description : "Session details"
                },
                "actionQueuing" : {
                    $type : "json:ObjectRef",
                    $description : "It creates an queue for all request"
                },
                "requestHandler" : {
                    $type : "json:ObjectRef",
                    $description : "Default request handler configuration"
                },
                "urlService" : {
                    $type : "json:ObjectRef",
                    $description : "Store the reference of Url Service class implementation"
                },
                "requestJsonSerializer" : {
                    $type : "env:RequestJsonSerializerCfg",
                    $description : "JSON serializer settings that have to be used for this request"
                },
                "timeout" : {
                    $type : "json:Integer",
                    $description : "Timeout in milliseconds (after which the request is canceled if no answer was received before). If this parameter is not set, the default timeout applies (specified in aria.core.IO.defaultTimeout). This property can be changed by filters."
                },
                /* BACKWARD-COMPATIBILITY-BEGIN GH-1044 HEADERS */
                "postHeader" : {
                    $type : "json:String",
                    $description : "[DEPRECATED, use 'headers' object] Header 'Content-type' to be used for POST requests"
                },
                /* BACKWARD-COMPATIBILITY-END GH-1044 HEADERS */
                "headers" : {
                    $type : "json:Map",
                    $contentType : {
                        $type : "json:String",
                        $description : "HTTP request header"
                    },
                    $description : "Request Headers to be used.",
                    $sample : {
                        "Content-Type" : "text/plain",
                        "Connection" : "keep-alive"
                    }
                }
            }
        },
        "RequestDetails" : {
            $type : "json:Object",
            $description : "Request details, as returned by URLService implementations",
            $restricted : false,
            $properties : {
                "url" : {
                    $type : "json:String",
                    $description : "Final url for the call",
                    $mandatory : true
                },
                "method" : {
                    $type : "json:String",
                    $description : "HTTP Method in use for the call"
                }
            }
        },
        "SuccessResponse" : {
            $type : "json:Object",
            $description : "Describe the response from the server if no communication error happened.",
            $properties : {
                "responseText" : {
                    $type : "json:String",
                    $description : "Response from the server as a string."
                },
                "responseXML" : {
                    $type : "json:ObjectRef",
                    $description : "If available, response as an XML tree."
                },
                "responseJSON" : {
                    $type : "json:ObjectRef",
                    $description : "If available, response as a javascript object."
                }
            }
        },
        "FailureResponse" : {
            $type : "json:Object",
            $description : "Describe error that happened during the call to the server.",
            $properties : {
                "status" : {
                    $type : "json:Integer",
                    $description : "Status of the server response: 200, 404, 503, ...",
                    $mandatory : true
                },
                "error" : {
                    $type : "json:String",
                    $description : "Error message from the framework"
                },
                "responseText" : {
                    $type : "json:String",
                    $description : "Response from the server as a string."
                },
                "responseXML" : {
                    $type : "json:ObjectRef",
                    $description : "If available, response as an XML tree."
                },
                "responseJSON" : {
                    $type : "json:ObjectRef",
                    $description : "If available, response as a javascript object."
                }
            }
        },
        "Request" : {
            $type : "json:Object",
            $description : "Details on the original request.",
            $properties : {
                "url" : {
                    $type : "json:String",
                    $description : "Final url for the call"
                },
                "session" : {
                    $type : "json:ObjectRef",
                    $description : "Session details"
                },
                "requestObject" : {
                    $type : "RequestObject",
                    $description : "Request Object passed to submitJsonRequest"
                }
            }
        },
        "ProcessedResponse" : {
            $type : "json:Object",
            $description : "Response after processing, containing data ready to be used by the requester. Other properties can be defined by the handler if needed.",
            $restricted : false,
            $properties : {
                "response" : {
                    $type : "json:ObjectRef",
                    $description : "Processed data from the response"
                },
                "error" : {
                    $type : "json:Boolean",
                    $description : "Indicates if this server response contains error (HTTP errors, server side errors, parsing errors,...)"
                },
                "errorData" : {
                    $type : "json:ObjectRef",
                    $description : "Details regarding the error that occured, including a messageBean property with the error message."
                }
            }
        }
    }
});
