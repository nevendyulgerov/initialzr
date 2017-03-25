
// Plugin: Initialzr
// Provides core application functionality

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

        var init = function(config) {
            app.config = config;

            var addNode = function(node, name, func) {
                var nodes = app.nodes;

                if ( nodes.hasOwnProperty(node) && ! nodes[node].hasOwnProperty(name) && typeof func === "function" ) {
                    nodes[node][name] = func;
                } else {
                    return false;
                }
            };

            var augment = function(node) {
                var nodes = app.nodes;

                if ( ! nodes.hasOwnProperty(node) ) {
                    nodes[node] = {}
                } else {
                    return false;
                }
            };

            var callNode = function(prop, name, params) {
                var nodeParams = typeof params !== "undefined" ? params : {};
                var node = getNode(prop, name);

                if ( node ) {
                    node(nodeParams);
                } else {
                    return false;
                }
            };

            var getNode = function(node, name) {
                var nodes = app.nodes;
                if ( nodes.hasOwnProperty(node) && nodes[node].hasOwnProperty(name) && typeof nodes[node][name] === "function" ) {
                    return nodes[node][name];
                } else {
                    return false;
                }
            };

            var getNodeItems = function(node) {
                var nodes = app.nodes;
                var items = [];

                if ( nodes.hasOwnProperty(node) ) {
                    for ( var i in nodes[node] ) {
                        items.push(i);
                    }
                    return items;
                } else {
                    return false;
                }
            };

            var nodeExists = function(node, name) {
                return typeof getNode(node, name) === "function";
            };

            var getData = function(prop, name) {
                var data = app.config;

                if ( data.hasOwnProperty(prop) && data[prop].hasOwnProperty(name) ) {
                    return data[prop][name];
                } else {
                    return false;
                }
            };

            var addHelper = function(name, func) {
                addNode("helpers", name, func);
            };

            var addComponent = function(name, func) {
                addNode("components", name, func);
            };

            var addModule = function(name, func) {
                addNode("modules", name, func);
            };

            var getHelper = function(name) {
                return getNode("helpers", name);
            };

            var getComponent = function(name) {
                return getNode("components", name);
            };

            var getModule = function(name) {
                return getNode("modules", name);
            };

            var setGlobal = (function() {
                window[app.config.name] = (function() {
                    return {
                        addHelper: addHelper,
                        addComponent: addComponent,
                        addModule: addModule,
                        getHelper: getHelper,
                        getComponent: getComponent,
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

        init(config);
    };
})();