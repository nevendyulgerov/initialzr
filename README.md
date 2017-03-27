# Initialzr
## JavaScript front-end application construct
http://lambdabunker.com/initialzr-demo/

Initialzr is a light-weight JavaScript application construct plugin. This plugin exposes a simple API for building efficient, extensible, easy to maintain but most of all SANE JS front-end applications which run fast. Really fast.

Initialzr has been designed with performance in mind. The non-minified version of the plugin is 4 KB, while the minified is just 2 KB. The whole plugin spans on about 100 lines of code.

Under the hood Initialzr is an Object Oriented module, which has two primary tasks:
 
 - Exposing powerful methods for managing modules
 - Ensuring core functionality is protected from public misuse

# Requirements

Initialzr runs on the ES5 standard, so you just need a browser and a text editor. That's it, no external dependencies.


# Getting Started

You can clone or download Initialzr from this repository. The download includes a non-minified and minified version of the plugin.

To enable initialzr, simply add it to your page
```javascript
<script type="text/javascript" src="path-to-initialzr/initialzr.js"></script>
```

To include the minified version of the plugin on your page, simply add:

```javascript
<script type="text/javascript" src="path-to-initialzr/initialzr.min.js"></script>
```

Alternatively, if you use jQuery, you can include the plugin in an async manner, like this:

```javascript
<script type="text/javascript">

jQuery(document).ready(function() {

    // define path to jquery-notifier
    var pluginUrl = 'path-to-initialzr/initialzr.js';
    
    // get plugin asynchronously
    $.getScript(pluginUrl, function() {
        // the plugin is loaded and ready to use
        
        // your code goes here...
    });
});
	
</script>
```


# How to Use

You can use Initialzr like this:

```javascript
<script>

(function(init) {
    init({
        name: "myApp"
    });
})(initialzr);

</script>
```

The above code will initialize a new global application (object), with name "myApp". This app will become available from window[myApp] or directly from myApp (without var in front to ensure that you're getting a global variable).

Notice that you pass an object to Initialzr upon initialization. This is your application's config file. It can contain any information. For example, here's how we can initialize another app.


```javascript
<script>

(function(init) {
    init({
        name: "photoGallery",
        options: {
            users: [],
            images: [],
            urls: []
        }
    });
})(initialzr);

</script>
```

This time we initialized an application "photoGallery" with an options object, which will store app-specific data.

Keep in mind that the only REQUIRED param for initializing an initialzr app is name. Obviously, you'll need a name for your app. The string you provide will become a global space, once the app is ready.

You might be wondering, will the options data become publicly available. Will you be able to access or modify it from photoGallery.options for example? 

The answer is no. Initialzr creates "safe" applications, which mostly have read-only fields. These fields can be retrieved via the plugin's API in a safe way. This ensures that your app stays resilient throughout its life. It also ensures that issues, caused by script injections or other obtrusive attempts will fail. Having the peace of mind that your application is protected from uncaring hands was one of the main reasons for building Initialzr in the first place.

# API
 
Once your app is initialized, it will have access to the following methods:

```javascript
<script>

var app = photoGallery;

// augment the application by adding a new node family
// @param string nodeFamily
app.augment(nodeFamily);

// creates a new node in a node family
// @param string nodeFamily
// @param string nodeName
// @param function node
// @return mixed
app.addNode(nodeFamily, nodeName, node);

// retrieves a node from node family
// @param string nodeFamily
// @param string nodeName
// @return mixed
app.getNode(nodeFamily, nodeName);

// calls node, from the node families of the application
// @param string nodeFamily
// @param string nodeName
// @return mixed
add.callNode(nodeFamily, nodeName);

// get all nodes from node family
// @param string nodeFamily
// @return object
app.getNodes(nodeFamily);

// checks if node exists in node family
// @param string nodeFamily
// @param string nodeName
// @return boolean
app.nodeExists(nodeFamily, nodeName);

// get data from the config space of the application
// @param string name
// @return mixed
app.getConfig(name);

</script>
```

As seen above, the only way to add functionality to your app is through the node API. Node equals method. Nodes have node families. Here's a diagram of how an initialzr app looks on the inside:

```javascript
<script>

var app = {
    config: {...},
    nodes: {...}
};

</script>
```

You config file goes into the "config" space of the app. Your nodes are defined and stored in the "nodes" space of the app.

Now, let's play with some of the methods, which come with the Node API.

Let's create a new application.

```javascript
<script>

// create app "myApp"
(function(init) {
    init({
        name: "myApp"
    });
})(initialzr);

// add a new node family "helpers" to the app
myApp.augment("helpers");

// add a node to node family "helpers"
myApp.addNode("helpers", "myHelper", function(str) {
    console.log("helper methods [myHelper] says "+str);
};

// entrypoint
jQuery(document).ready(function($) {
    
    // get helper myHelper
    var myHelper = myApp.getNode("helpers", "myHelper");
    
    // call helper functionality and pass argument{string} "hello!"
    myHelper("hello!");
});

</script>
```

The above code creates a new application "myApp", augments the app with a new node family "helpers". Then it adds to this node family a helper method with name "myHelper" and client-provided functionality. So, basically you interact with initialzr in the following way:

- save your functionality as node in initialzr
- call your functionality through the initialzr's API

Please note that you do NOT have direct access to the app's properties, so if you try to do something funky like delete myApp.nodes or myApp.nodes = undefined, the operation will fail, returning a boolean literal.

Let's create another application.

```javascript
<script>

// create application "myApp"
(function(init) {
    init({
        name: "myApp"
    });
})(initialzr);

// add a node to node family "helpers"
myApp.augment("helpers");

// add a node to node family "helpers"
myApp.addNode("helpers", "toggleVisibility", function($el, callback) {
    var style = $el[0].style;
    style.opacity = 0;
    style.transition = "all 0.3s";
    
    callback();
};

// add a node to node family "helpers"
myApp.addNode("helpers", "toggleStyle", function($el) {
    var style = $el[0].style;
    style.backgroundColor = "tomato";
    style.color = "white";
    style.transition = "all 0.3s";
});

// entrypoint
jQuery(document).ready(function($) {
    var app = myApp;
    var $target = $('.target');
    
    var toggleVisibility = app.getNode("helpers", "toggleVisibility");
    var toggleStyle = app.getNode("helpers", "toggleStyle");
    
    toggleVisibility($target, function() {
        toggleStyle($target);
    });
});

</script>
```

This time we initialized an application with two helpers, which interact with each other neatly through a callback. There's nothing groundbreaking here, but hopefully you start to see how initialzr can eliminate the issue with organizing and managing your front-end functionality. 

The above code will first use the helper node toggleVisibility to... toggle the visibility of a given jQuery object and then in its callback, the other helper - toggleStyle - will perform style modification on the same jQuery object. 

Please note that jQuery is not required for initialzr to work. I'll just use it in some of the examples, mostly for accessing DOM elements.

# Building an actual app

Now, let's use Initialzr for something more meaningful. Let's create a simple data retrieving app, which performs an AJAX request - GET to an endpoint and retrieves JSON data. The app then displays the results in a fancy way to the DOM - it outputs a notification with a nice transition effect. On top of this each of these, notifications will be customized with a random background gradient generator method. This type of functionality can be easily achieved with initialzr. 

Let's make this a bit more interesting. Let's hook to https://ghibliapi.herokuapp.com/films, from where we can retrieve fun data, like all the movies Studio Ghibli produced. They are the makers of Princess Mononoke, Spirited Away and many other great movies.

First, we need to break down the app into a ground of methods - nodes. I personally identify the following nodes:

- ghibliService   - controls the AJAX requests to the https://ghibliapi.herokuapp.com/films
- iterateMovies   - controls the iteration over ghibli data
- notifier        - controls the notification mechanism
- randomGradient  - controls the randomization of gradients

Once again, we start off by creating an application:

```javascript
<script>

// create application via initialzr
(function(init) {
    init({
        name: "myApp"
    });
})(initialzr);
	
</script>
```

There's nothing unusual here. We simply initialize the app.

Next, we augment the app with a new node family:

```javascript
<script>

// augment app with a node family "ghibli"
myApp.augment("ghibli")

</script>
```

Next, we create the node "ghibliService":

```javascript
<script>

// Node: ghibliService
// retrieves data from an endpoint via AJAX
myApp.addNode("ghibli", "ghibliService", function(args) {
    var callback = args.callback;

    $.ajax({
        type: "GET",
        url: "https://ghibliapi.herokuapp.com/films",
        success: function(response) {
            callback(null, response);
        },
        error: function(error) {
            callback(error);
        }
    })
});
	
</script>
```

This node contains an AJAX call through the jQuery method .ajax(). Notice, the incoming param "args" is an object, which must contain a callback.

Next, we create node "iterateMovies":

```javascript
<script>

// Node: iterateMovies
// iterate movies, provided as a param
myApp.addNode("ghibli", "iterateMovies", function(args) {
    var interval = args.interval;
    var movies   = args.movies;
    var callback = args.callback;

    var display = function(index, movies) {
        index = index || 0;

        if ( index >= movies.length ) {
            return true;
        }

        // get current movie
        var movie = movies[index];

        // call client callback
        callback(movie);

        setTimeout(function() {

            // recursive call
            display(++index, movies);
        }, interval);
    };

    display(0, movies);
});
	
</script>
```

This node is a bit more complicated. It contains an inner recursive function display. This function is called for each result. We need it to be recursive because this allows us to safely call the next result, only after the presentation of the previous has been fully executed. Also, notice that we execute a callback with the retrieved data.

Next, let's create the node, controlling DOM notifications:

```javascript
<script>

// Node: notifier
// outputs data to the DOM
myApp.addNode("ghibli", "notifier", function(args) {
    var type      = args.type;
    var title     = args.title;
    var subtitle  = args.subtitle;
    var fade      = args.fade;
    var hideAfter = args.hideAfter;
    var $wrapper  = $('.notifications');
    var notification = '<div class="notification bg '+type+'"><span class="title">'+title+'</span><span class="subtitle">'+subtitle+'</span></div>';

    $wrapper.append(notification);
    var $target = $('.notification').last().hide().fadeIn(fade);

    setTimeout(function() {
        $target.fadeOut(fade);
    }, hideAfter);
});

</script>
```

This node contains a simple notification mechanism - it appends a div, containing a message to the DOM. Then it fades in the notification and after a timeout, it fades it out.

Next, comes the randomGradient node:

```javascript
<script>

// add helper for random gradients
myApp.addNode("ghibli", "randomGradient", function($el) {
    var randomGradient = function() {
        var c1 = {
            r: Math.floor(Math.random()*255),
            g: Math.floor(Math.random()*255),
            b: Math.floor(Math.random()*255)
        };
        var c2 = {
            r: Math.floor(Math.random()*255),
            g: Math.floor(Math.random()*255),
            b: Math.floor(Math.random()*255)
        };
        c1.rgb = 'rgb('+c1.r+','+c1.g+','+c1.b+')';
        c2.rgb = 'rgb('+c2.r+','+c2.g+','+c2.b+')';
        return 'radial-gradient(at top left, '+c1.rgb+', '+c2.rgb+')';
    };

    $el.css({
        background: randomGradient()
    });
});

</script>
```

This node applies a randomized gradient to a provided jQuery object. Let's not focus on how it gets the random gradient for now.

To get these four nodes hooked, we need an entrypoint:

```javascript
<script>

// entrypoint
jQuery(document).ready(function() {
    var app = myApp;
    var ghibliService = app.getNode("ghibli", "ghibliService");
    var iterateMovies = app.getNode("ghibli", "iterateMovies");
    var notifier      = app.getNode("ghibli", "notifier");
    var rGradient     = app.getNode("ghibli", "randomGradient");

    // 1. hook to ghibli service ...
    ghibliService({
        callback: function(err, response) {

            // ... if we got a response
            if ( response ) {

                // 2. iterate movies ...
                iterateMovies({
                    interval: 1000,
                    movies: response,
                    callback: function(movie) {

                        // 3. notify for movie ...
                        notifier({
                            type: "success",
                            title: movie.title,
                            subtitle: "Release date: "+movie.release_date+"<br/>Director: "+movie.director+", <br/>Producer: "+movie.producer,
                            fade: 2000,
                            hideAfter: 10000
                        });

                        // get newly added notification
                        var $targetNotification = $('.notification').last();

                        // 4. apply random gradient on target
                        rGradient($targetNotification);
                    }
                });
            }
        }
    });
});

</script>
```

Our entrypoint is the safe jQuery "document ready" event. It is up to you how you build your entrypoint script. If you don't depend on jQuery, you can execute the above code, right after your node definitions.

So, first we call ghibliService with a callback. ghibliService calls the endpoint, gets the ghibli data and executes the callback, passing it the data. Internally, the callback delegates responsibility to iterateMovies. iterateMovies iterates the movies data and on each movie calls calls node notifier and randomGradient through a callback.

That's it. Your app is ready for testing.

Please note that this repository contains this application as a demo project. To start it up run a http server in the repo's directory. For example, via python, run in the root of the project:

```terminal
python -m http.server
```

You can then view the app on localhost:8000

# Another app - Locations

Let's create another app, this time something a bit more practical. Let's create an app which displays a google map with a form for adding markers to the map. The form will contains two fields - latitude and longitude of the marker. Upon submission, a new marker must be added to the map.

I identify 3 nodes for this app:

- createMap - controls the creation of the map
- addMarker - controls the adding of marker
- handleInput - handlers user input

Let's first initialize our app:

```javascript
<script>

// create application via shorthand syntax
(function(i){ i({name:"locations"}); })(initialzr);

</script>
```

We create our app, this time using the shorthand syntax.

Next, we create node "createMap":

```javascript
<script>

// Node: mapCreator
// creates map
locations.addNode("map", "createMap", function(args) {

    var map = new google.maps.Map(document.getElementById(args.selector), {
        zoom: args.zoom,
        center: {
            lat: args.lat,
            lng: args.lng
        }
    });

    return map;
});

</script>
```

This node creates a map and returns it.

Next, we create node "addMarker":

```javascript
<script>

// Node: addMarker
// adds marker to a map
locations.addNode("map", "addMarker", function(args) {

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(args.lat,args.lng)
    });

    marker.setMap(args.map);
    return marker;
});

</script>
```

This node creates a marker, adds it to a map (provided as a parameter) and then it returns the marker;

The last node we need to create is "handleInput":

```javascript
<script>

// Node: handleInput
// handlers user input
locations.addNode("map", "handleInput", function(args) {

    // intercept submit event
    args.$submit.on("click", function(e) {

        // stop the default submission of the form
        e.preventDefault();

        // gather data
        var data = {
            lat: parseFloat(args.$lat.val()),
            lng: parseFloat(args.$lng.val())
        };

        // execute client callback with data
        args.callback(data)
    });
});

</script>
```

This node handles the retrieval of user data, inserted in the form.

The last thing we need is an entrypoint for our app:

```javascript
<script>

// entrypoint
jQuery(document).ready(function($) {

    // get map box from DOM
    var $mapBox = $(".map-box");

    // set coordinates for New York
    var newYorkCoordinates = {
        lat: 40.705311,
        lng: -74.258188
    };

    // 1. create map
    var map = locations.getNode("map", "createMap")({
        selector: "map",
        lat: newYorkCoordinates.lat,
        lng: newYorkCoordinates.lng,
        zoom: 3
    });

    // 2. intercept input
    locations.callNode("map", "handleInput", {
        $submit: $mapBox.find('.trigger.submit'),
        $lat: $mapBox.find('.lat'),
        $lng: $mapBox.find('.lng'),
        callback: function(data) {

            // 3. add marker to map
            locations.getNode("map", "addMarker")({
                map: map,
                lat: data.lat,
                lng: data.lng
            });
        }
    });
});

</script>
```

In our entrypoint, we get the DOM wrapper of the map. Then we define an initial position for our map (New York looks like a good spot for this). After that we create our map through the node "createMap". Next, we call node "handleInput", which starts listening for submit events. Once the user submits data, this node intercepts it, processes it and returns it through a callback. In this callback we call node "addMarker" which uses the data returned by node "handleInput" to create and add a new marker to the map.

That's it, this app is ready for testing and deployment.

Please note that this repository contains this application as a demo project. To start it up run a http server in the repo's directory. For example, via python, run in the root of the project:

```terminal
python -m http.server
```

You can then view the app on localhost:8000\locations.html

# Conventions

To stay light-weight, Initialzr follows few strict conventions:

- Every public method, either performs its action and returns the expected value or returns false. That's it. There's no extensive validation. If you provide the right arguments, you'll get the expected values. If something goes wrong - you attempt to overwrite an existing node or retrieve a non existing node, you'll simply get false. You can intercept this behavior of initialzr and use it to validate more thoroughly what comes out of the app. Here's how:

```javascript
<script>

// create an app
(function(init) {
    init({
        name: "myApp"
    });
})(initialzr);

// add node family "extras"
myApp.augment("extras");

// add a helper node
myApp.addNode("extras", "sayHi", function(str) {
    console.log("Hey there, "+str); 
});

// retrieve a non existing helper
var myHelper = myApp.getNode("extras", "myHekdkasdERROR");

if ( ! myHelper ) {
    // intercept and handle the error
} else {
    // call the helper
    myHelper("stranger");
}

</script>
```

So, if you attempt to retrieve a non-existing node, you'll get false. If you attempt to overwrite an existing node, you'll get false. If you try to retrieve the list of nodes for a non existing node family, you'll get false. If you try to pass a non-functional node, a value of different from "function" you'll get false.

- Another thing to note. Initialzr does NOT like when you mess with defined nodes. Once you add a node, you can only read and execute it. You cannot overwrite it, nor delete it. Client coders must decide on their node schema early and never try to overwrite it. Rather than trying to overwrite an already defined node, just add a new one and call the new instead of the old. Here's how:

```javascript
<script>

// shorthand initialzr app
(function(i){i({name:"myApp"})})(initialzr);

// add node family "extras"
myApp.augment("extras");

// define a node to node family "extras"
myApp.addNode("extras", "hey", function(str) {
    console.log("Hey, "+str);
});

// you decide that you no longer like node "hey"
// sorry, but you cannot delete it
// Initialzr protects its nodes

// well, ok then, I'll create a new node
myApp.addNode("extras", "anotherHey", function(str) {
    console.log("How is it going, "+str+"?");
});

// call my new helper node
myApp.getNode("extras", "anotherHey")("stranger");

// that was easy

</script>
```

The above code demonstrates how to maintain flexibility in your app by including new nodes. You don't need and you cannot delete previously defined nodes.

# Node Families

Node families are the heart of Initialzr. They provide separation of concept, when organizing your app's functionality. Through node families you can organize your application in a meaningful, logical way.

```javascript

<script>

// shorthand initialzr app
(function(i){i({name:"myApp"})})(initialzr);

// create a new node family
myApp.augment("core");

// add node to node family "core"
myApp.addNode("core", "loadDependencies", function(args) {
    var index = args.index || 0;
    var dependencies = args.dependencies;
    var callback = args.callback;

    if ( index >= dependencies.length ) {
        callback();
        return true;
    }

    // get current movie
    var dependency = dependencies[index];

    // get dependency
    $.getScript(dependency, function() {
        myApp.callNode("core", "loadDependencies", {
            index: ++index,
            dependencies: dependencies
        });
    });
});

// call node "core" and execute it directly
myApp.callNode("core", "loadDependencies", {
    dependencies: [
        "jquery-script-url",
        "validation-script-url"
    ],
    callback: function() {
        console.log("all dependencies loaded");
    }
});

</script>
```

Your app now has a new node family "core". This node family is concerned with the bootstrapping of your app. It contains a node "loadDependencies" which internally loads all your dependencies in an async manner. This node also communicates with other nodes through a callback.

You can now use Initialzr to create expressive node schemas which match your app requirements. These nodes will be safely stored and references via the Node API, exposed by Initialzr. All create, read and execute operations are performed in a memory-efficient manner so once a node is initialized and stored, you can quickly reference it globally or locally, from any location.

# Scoping

Initialzr has one more really cool ability. You can use it as your app wrapper on global and local scale. What does this mean really?

```javascript
<script>

// create an app
(function(i){i({name:"myApp"})})(initialzr);

// create a node family
myApp.augment("helpers");

// create node
myApp.addNode("helpers", "myHelper", function() {

    // create a local app via initialzr
    var innerApp = initialzr({name:"innerApp", isGlobal:false});

    // augment local app
    innerApp.augment("monitors");

    // add node to local app
    innerApp.addNode("monitors", "monitorTrigger", function($trigger) {
        $trigger.on("click", function(e) {
            // capture click ...
        });
    });
});

// call node
myApp.callNode("helpers", "myHelper");

</script>
```

The code above demonstrates that Initialzr works exactly the same way on local level. First we create a global app "myApp" then we augment and add a node to it. In the nodes definition we create a local app. This app will be accessible only from within the node "myHelper". The local "innerApp" has access to the same API.

To initialize a local Initialzr app, simply pass the param isGlobal: false at initialization. Also, notice the way we initialize a local app. The syntax is a bit different. When we initialize a local app, we do not need a self-executing function like with global apps.