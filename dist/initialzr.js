
// Plugin: Initialzr
// Creates applications

(function() {
    initialzr = function(config) {
        if ( typeof config !== "object" || typeof config.name !== "string" ) {
            console.warn("Invalid initialization for construct [initialzr]. Make sure to provide a valid config object on initialization, containing at least a property 'name' {string}.");
            return false;
        }

        var app = {
            config: config,
            nodes: {}
        };

        var isGlobal = typeof config.isGlobal === "boolean" ? config.isGlobal : true;

        var init = function() {
            var augment = function(nodeFamily) {
                var nodes = app.nodes;

                if ( ! nodes.hasOwnProperty(nodeFamily) ) {
                    nodes[nodeFamily] = {};
                } else {
                    return false;
                }
            };

            var addNode = function(nodeFamily, nodeName, func) {
                var nodes = app.nodes;

                if ( nodes.hasOwnProperty(nodeFamily) && ! nodes[nodeFamily].hasOwnProperty(nodeName) && typeof func === "function" ) {
                    nodes[nodeFamily][nodeName] = func;
                } else {
                    return false;
                }
            };

            var getNode = function(nodeFamily, nodeName) {
                var nodes = app.nodes;
                if ( nodes.hasOwnProperty(nodeFamily) && nodes[nodeFamily].hasOwnProperty(nodeName) && typeof nodes[nodeFamily][nodeName] === "function" ) {
                    return nodes[nodeFamily][nodeName];
                } else {
                    return false;
                }
            };

            var callNode = function(nodeFamily, nodeName, params) {
                var nodeParams = typeof params !== "undefined" ? params : {};
                var node = getNode(nodeFamily, nodeName);

                if ( node ) {
                    node(nodeParams);
                } else {
                    return false;
                }
            };

            var getNodes = function(nodeFamily) {
                var nodes = app.nodes;

                if ( nodes.hasOwnProperty(nodeFamily) ) {
                    return nodes[nodeFamily];
                } else {
                    return false;
                }
            };

            var nodeExists = function(nodeFamily, nodeName) {
                return typeof getNode(nodeFamily, nodeName) === "function";
            };

            var getConfig = function(name) {
                var config = app.config;

                if ( config.hasOwnProperty(name) ) {
                    return config[name];
                } else {
                    return false;
                }
            };

            var createInstance = function() {
                return {
                    augment: augment,
                    addNode: addNode,
                    getNode: getNode,
                    callNode: callNode,
                    nodeExists: nodeExists,
                    getNodes: getNodes,
                    getConfig: getConfig
                };
            };

            return createInstance();
        };

        var setGlobal = function(instance) {
            window[app.config.name] = instance;
        };

        if ( isGlobal ) {
            setGlobal(init());
        } else {
            return init();
        }
    };
})();