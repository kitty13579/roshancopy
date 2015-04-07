/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Bean definition containing default settings for the Number environment.
 */
Aria.beanDefinitions({
    $package : "aria.utils.environment.NumberCfgBeans",
    $description : "A definition of the JSON beans used to set the environment settings.",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "environmentBase" : "aria.core.environment.EnvironmentBaseCfgBeans"
    },
    $beans : {
        "AppCfg" : {
            $type : "json:Object",
            $description : "Application environment variables",
            $restricted : false,
            $properties : {
                "decimalFormatSymbols" : {
                    $type : "DecimalFormatSymbols",
                    $description : "Represents the set of symbols used to interpret and format numbers.",
                    $default : {}
                },

                "currencyFormats" : {
                    $type : "CurrencyFormatsCfg",
                    $description : "Default currency formatting for the application.",
                    $default : {}
                }
            }
        },
        "DecimalFormatSymbols" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "decimalSeparator" : {
                    $type : "json:String",
                    $description : "Character used for decimal sign. (e.g. '.' dot in en_US or ',' comma in fr_FR.",
                    $default : "."
                },
                "groupingSeparator" : {
                    $type : "json:String",
                    $description : "Character used for grouping separator. (e.g. ',' dot in en_US or ' ' space in fr_FR.",
                    $default : ","
                },
                "strictGrouping" : {
                    $type : "json:Boolean",
                    $description : "Enforce strict group validation. If true, a grouping separation will be checked against the pattern.",
                    $default : false
                }
            }
        },
        "CurrencyFormatsCfg" : {
            $type : "json:Object",
            $description : "",
            $properties : {
                "currencyFormat" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Pattern for number formatting.",
                    $default : "#.######"
                },
                "currencySymbol" : {
                    $type : "environmentBase:FormatTypes",
                    $description : "Currency symbol.",
                    $default : "USD"
                }
            }
        }
    }
});
