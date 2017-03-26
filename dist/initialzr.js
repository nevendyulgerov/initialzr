
// Plugin: Initialzr
// Creates applications

(function() {
    initialzr = function(config) {
        if ( typeof config !== "object" ) {
            console.warn("Invalid initialization for plugin [initialzr]. Make sure to provide a valid config object on initialization.");
            return false;
        }

        var app = {
            config: config,
            nodes: {
                helpers: {},
                modules: {},
                components: {}
            }
        };

        var init = function() {
            var addNode = function(nodeFamily, nodeName, func) {
                var nodes = app.nodes;

                if ( nodes.hasOwnProperty(nodeFamily) && ! nodes[nodeFamily].hasOwnProperty(nodeName) && typeof func === "function" ) {
                    nodes[nodeFamily][nodeName] = func;
                } else {
                    return false;
                }
            };

            var augment = function(nodeFamily) {
                var nodes = app.nodes;

                if ( ! nodes.hasOwnProperty(nodeFamily) ) {
                    nodes[nodeFamily] = {}
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

            var getNode = function(nodeFamily, nodeName) {
                var nodes = app.nodes;
                if ( nodes.hasOwnProperty(nodeFamily) && nodes[nodeFamily].hasOwnProperty(nodeName) && typeof nodes[nodeFamily][nodeName] === "function" ) {
                    return nodes[nodeFamily][nodeName];
                } else {
                    return false;
                }
            };

            var getNodeItems = function(nodeFamily) {
                var nodes = app.nodes;
                var items = [];

                if ( nodes.hasOwnProperty(nodeFamily) ) {
                    for ( var i in nodes[nodeFamily] ) {
                        items.push(i);
                    }
                    return items;
                } else {
                    return false;
                }
            };

            var nodeExists = function(nodeFamily, nodeName) {
                return typeof getNode(nodeFamily, nodeName) === "function";
            };

            var getData = function(prop, name) {
                var data = app.config;

                if ( data.hasOwnProperty(prop) && data[prop].hasOwnProperty(name) ) {
                    return data[prop][name];
                } else {
                    return false;
                }
            };

            var addHelper = function(nodeName, func) {
                addNode("helpers", nodeName, func);
            };

            var addComponent = function(nodeName, func) {
                addNode("components", nodeName, func);
            };

            var addModule = function(nodeName, func) {
                addNode("modules", nodeName, func);
            };

            var getHelper = function(nodeName) {
                return getNode("helpers", nodeName);
            };

            var getComponent = function(nodeName) {
                return getNode("components", nodeName);
            };

            var getModule = function(nodeName) {
                return getNode("modules", nodeName);
            };

            var setGlobal = (function() {
                window[app.config.name] = (function() {
                    return {
                        addHelper: addHelper,
                        getHelper: getHelper,
                        addComponent: addComponent,
                        getComponent: getComponent,
                        addModule: addModule,
                        getModule: getModule,
                        addNode: addNode,
                        callNode: callNode,
                        getNodeItems: getNodeItems,
                        getNode: getNode,
                        nodeExists: nodeExists,
                        getData: getData,
                        augment: augment
                    };
                })();
            })();
        };

        init();
    };
})();