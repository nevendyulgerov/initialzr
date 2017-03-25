# Initialzr
## JavaScript front-end application construct
http://lambdabunker.com/initialzr-demo/

Initialzr is a light-weight JavaScript application construct plugin. This plugin exposes a simple API for building efficient, extensible, easy to maintain but most of all SANE JS front-end applications which run fast. Really fast.

Initialzr has been designed with performance in mind. The non-minified version of the plugin is 5 KB, while the minified is just 2 KB. The whole plugin spans on about 130 lines of code.

Under the hood Initialzr is an Object Oriented module, which has two primary tasks:
 
 - exposing powerful methods for manipulating application data
 - ensuring core functionality is protected from public use.

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

The above code will initialize a new global application (object), with name "myApp". This app will become available from window[myApp] or directly from myApp (without var in front to ensure that you're getting a global variable.

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
 
Once your app is initialized, it will have access to the following methods:

```javascript
<script>

var app = photoGallery;

// creates a new node (function), in the node families of the application
// @param string
// @param string
// @param function
// @return mixed
app.addNode("nodeFamily", "nodeName", function);

// calls node, from the node families of the application
// @param string
// @param string
// @return mixed
add.callNode("nodeFamily", "nodeName");

// retrieves the names of all defined node items from node family "components"
// @param string
// @return array
app.getNodeItems("nodeFamily");

// retrieves a node, from the node family "components"
// @param string
// @param string
// @return mixed
app.getNode("nodeFamily", "nodeName");

// checkes if given node family exists
// @param string
// @return boolean
app.nodeExists("components");

// get data from the config space of the application
// @param string
// @param string
app.getData("data", "name");

// augment the application by adding a new node family
// @param string
// @param string
app.augment("node", "name");

// add a new helper node in the node family "helpers"
// @param string
// @param function
app.addHelper("helperName", function);

// add a new component node in the node family "components"
// @param string
// @param function
app.addComponent("componentName", function);

// add a new module node in the node family "modules"
// @param string
// @param function
app.addModule("moduleName", function);

// get helper node
// @param string
app.getHelper("helperName");

// get module node
// @param string
app.getModule("moduleName");

// get component node
// @param string
app.getComponent("componentName");

</script>
```

As seen above, the only way to add functionality to your app is through the node API. Node equals method. Nodes have node families. Here's a diagram of how the nodes look inside an initialzr app:

```javascript
<script>

var app = {
    config: {...},
    nodes: {
        helpers: {},
        modules: {},
        components: {}
    }
};

</script>
```

An initialzr app has 3 default node families - helpers, modules, components. Whether you'll use these spaces or define your own node families is up to you. The Node API supports creation of new node families through the augment() method.

I personally use the default node families in the following way:

- helpers: contain global helper methods, which need to be available to all nodes from other node families
- modules: contain core functionality for managing the application
- components: contain DOM-related functionality, which is tightly coupled with html templates

Please note the sequence as it matters, especially if you are concatenating your javascripts using build tools like gulp or grunt.

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

// create a helper node
myApp.addHelper("myHelper", function(str) {
    console.log("helper methods [myHelper] says "+str);
};

// entrypoint
jQuery(document).ready(function($) {
    
    // get helper myHelper
    var myHelper = myApp.getHelper("myHelper");
    
    // call helper functionality and pass argument{string} "hello!"
    myHelper("hello!");
});

</script>
```

The above code creates a new application "myApp", then it adds to its "helpers" node family a helper method with name "myHelper" and client-provided functionality. So, basically you interact with initialzr in the following way:

- save your functionality as node in initialzr
- call your functionality through the plugin's API

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

// create a helper node for controlling visibility
myApp.addHelper("toggleVisibility", function($el, callback) {
    var style = $el[0].style;
    style.opacity = 0;
    style.transition = "all 0.3s";
    
    callback();
};

// create a helper node for controlling style updates
myApp.addHelper("toggleStyle", function($el) {
    var style = $el[0].style;
    style.backgroundColor = "tomato";
    style.color = "white";
    style.transition = "all 0.3s";
});

// entrypoint
jQuery(document).ready(function($) {
    var app = myApp;
    var $target = $('.target');
    
    var toggleVisibility = app.getHelper("toggleVisibility");
    var toggleStyle = app.getHelper("toggleStyle");
    
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
- displayMovies   - controls the data retrieval method
- randomGradient  - controls the randomization of gradients
- notifier        - controls the notification mechanism

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

Next, we create the node "ghibliService":

```javascript
<script>

// add helper for ajax operations
myApp.addHelper("ghibliService", function(args) {
    var callback = args.callback;

    $.ajax({
        type: "GET",
        data: {},
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

Next, we create node "displayMovies":

```javascript
<script>

// add helper for displaying movies
myApp.addHelper("displayMovies", function(args) {
    var interval = args.interval;
    var movies   = args.movies;
    var app      = myApp;
    var notifier = app.getHelper("notifier");
    var rGradient = app.getHelper("randomGradient");

    var display = function(index, movies) {
        index = index || 0;

        if ( index >= movies.length ) {
            return true;
        }

        var movie = movies[index];

        // delegate display of movie to node notifier
        notifier({
            type: "success",
            title: movie.title,
            subtitle: "Director: "+movie.director+", <br/>Producer: "+movie.producer,
            fade: 2000,
            hideAfter: 10000
        });

        // delegate gradient update to node randomGradient
        var $target = $('.notification').last();
        rGradient($target);
        
        // recursive call
        setTimeout(function() {
            display(++index, movies);
        }, interval);
    };

    // start recursive display
    display(0, movies);
});
	
</script>
```

This node is a bit more complicated. It contains an inner recursive function display. This function is called for each result. We need it to be recursive because this allows us to safely call the next result, only after the presentation of the previous has been fully executed. Also, notice that we retrieve two nodes - notifier and rGradient and delegate the presentation for each result to them.

Next, comes the randomGradient node:

```javascript
<script>

// add helper for random gradients
myApp.addHelper("randomGradient", function($el) {
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

Finally, let's create the node, controlling DOM notifications:

```javascript
<script>

// add helper for DOM notifications
myApp.addHelper("notifier", function(args) {
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

To get these four nodes hooked, we need an entrypoint:

```javascript
<script>

// entrypoint
jQuery(document).ready(function() {
    var app = myApp;
    
    var ghibliService = app.getHelper("ghibliService");
    var displayMovies = app.getHelper("displayMovies");
    var notifier      = app.getHelper("notifier");

    ghibliService({
        callback: function(err, response) {

            if ( response ) {
                displayMovies({
                    interval: 1000,
                    movies: response
                });
            }
        }
    });
});

</script>
```

Our entrypoint is the safe jQuery "document ready" event. It is up to you how you build your entrypoint script. If you don't depend on jQuery, you can execute the above code, right after your node definitions.

So, first we call ghibliService with a callback. ghibliService calls the endpoint, gets the ghibli data and executes the callback, passing it the data. Internally, the callback delegates responsibility to displayMovies. Internally, displayMovies calls node notifier and randomGradient.

That's it. Your app is ready for testing.

Please note that this repository contains this application as a demo project. To start it up run a http server in the repo's directory. For example, via python, run in the root of the project:

```terminal
python -m http.server
```

You can then view the app on localhost:8000

# Conventions

To stay light-weight, Initialzr follows few strict conventions:

- Every public method, which returns value, either returns the expected value or returns false. That's it. There's no extensive validation. If you provide the right arguments, you'll get the expected values. If something goes wrong - you attempt to overwrite an existing node or retrieve a non existing node, you'll simply get false. You can intercept this behavior of initialzr and use it to validate more thoroughly what comes out of the app. Here's how:

```javascript
<script>

// create an app
(function(init) {
    init({
        name: "myApp"
    });
})(initialzr);

// add a helper node
myApp.addHelper("sayHi", function(str) {
    console.log("Hey there, "+str); 
});

// retrieve a non existing helper
var myHelper = myApp.getHelper("myHekdkasdERROR");

if ( ! myHelper ) {
    // intercept and handle the error
} else {
    // call the helper
    myHelper("stranger");
}

</script>
```

So, if you attempt to retrieve a non-existing node, you'll get false. If you attempt to overwrite an existing node, you'll get false. If you try to retrieve the list of nodes for a non existing node family, you'll get false.

Another thing to note. Initialzr does NOT like when you mess with define nodes. Once you add a node, you can only read and execute it. You cannot overwrite it, nor delete it.  