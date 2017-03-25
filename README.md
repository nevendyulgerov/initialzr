# Initialzr
## JavaScript front-end application construct

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

Alternatively, you can include the plugin in an async manner, like this:

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

// creates a new node (function), in the nodes space of the application
// @param string
// @param string
// @param function
// @return mixed
app.addNode("node", "name", function);

// calls node, from the nodes space of the application
// @param string
// @param string
// @return mixed
add.callNode("node", "name");

// retrieves the names of all defined node items from node space "components"
// @param string
// @return array
app.getNodeItems("components");

// retrieves a node, from the node space "components"
// @param string
// @param string
// @return mixed
app.getNode("components", "name");

// checkes if given node space exists
// @param string
// @return boolean
app.nodeExists("components");

// get data from the config space of the application
// @param string
// @param string
app.getData("data", "name");

// augment the application by adding a new node space
// @param string
// @param string
app.augment("node", "name");

// add a new helper node in the node space "helpers"
// @param string
// @param function
app.addHelper("helperName", function);

// add a new component node in the node space "components"
// @param string
// @param function
app.addComponent("componentName", function);

// add a new module node in the node space "modules"
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

As seen above, the only way to add functionality to your app is through the node API. Node equals method. Nodes have node spaces. Here's a diagram of how the nodes look inside an initialzr app:


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

An initialzr app has 3 default node spaces - helpers, modules, components. Whether you'll use these spaces or define your own node spaces is up to you. The Node API supports creation of new node spaces through the augment() method.

I personally use the default node spaces in the following way:

- helpers: contain global helper methods, which need to be available to all nodes from other node spaces
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

The above code creates a new application "myApp", then it adds to its "helpers" node space a helper method with name "myHelper" and client-provided functionality. So, basically you interact with initialzr in the following way:

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


Now, let's use Initialzr for something more meaningful. Let's create a simple data retrieving app, which performs an AJAX request - GET to an endpoint and retrieves JSON data. The app then displays the results in a fancy way to the DOM - it outputs a notification with a nice transition effect. On top of this each of these notifications will be customized with a random background gradient generator method. This type of functionality can be easily achieved with initialzr. 

Let's make this a bit more interesting. Let's hook to https://ghibliapi.herokuapp.com/films, from where we can retrieve fun data, like all the movies Studio Ghibli produced. They are the makers of Princess Mononoke, Spirited Away and many other great movies.

First, we need to break down the app into a ground of methods - nodes. I personally identify the following nodes:

- ghibliService   - controls the AJAX requests
- displayMovies         - controls the data retrieval method
- randomGradient        - controls the randomization of gradients
- notifier              - controls the notification mechanism

Once again, we start off by creating an application

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
    var app      = myApp;
    var interval = args.interval;
    var movies   = args.movies;
    var notifier = app.getHelper("notifier");

    var display = function(index, movies) {
        index = index || 0;

        if ( index >= movies.length ) {
            return true;
        }

        var movie = movies[index];

        notifier({
            type: "success",
            title: movie.title,
            subtitle: "Director: "+movie.director+", <br/>Producer: "+movie.producer,
            fade: 2000,
            hideAfter: 10000
        });

        // call helper
        app.getHelper("randomGradient")($('.notification').last());

        setTimeout(function() {
            display(++index, movies);
        }, interval);
    };

    display(0, movies);
});
	
</script>
```

This node is a bit more complicated. This node contains an inner recursive function, which



The above code will initialize a notification and show it on the page after 1 second.

The third and more advanced option is to show the notification upon event trigger. This can be done, using the 'showOnEvent' parameter:

```javascript
<script type="text/javascript">
	jQuery(document).ready(function($) {
	
		// cache notifier
		var $notifier = $('body').notifier;
		
		// initialize notifier
		$notifier.init();
		
		// display notification when event 'my_app.events.save' is triggered
		$notifier.notify({
			type: 'success',
			title: 'Save',
			subtitle: 'Your data has been successfully saved',
			showOnEvent: 'my_app.events.save'
		});
	});
</script>
```

The above code will initialize a notification and show it on the page, when the event 'my_app.events.save' gets triggered. This way of displaying a notification can be particularly useful if your application is event-driven.

The last example can be further enhanced by adding a delay, like this:

```javascript
<script type="text/javascript">
	jQuery(document).ready(function($) {
	
		// cache notifier
		var $notifier = $('body').notifier;
		
		// initialize notifier
		$notifier.init();
		
		// display notification when event 'my_app.events.save' is triggered
		$notifier.notify({
			type: 'success',
			title: 'Save',
			subtitle: 'Your data has been successfully saved',
			showOnEvent: 'my_app.events.save',
			delay: 1000
		});
	});
</script>
```

As you might have guessed, the above code will initialize a notification and when the event 'my_app.events.save' gets triggered, the notification will be shown with a delay of 1 second.

By default, $.notifier uses [Font Awesose icons](http://fontawesome.io/) for its icons. If your application doesn't support Font Awesome, you can pass your own icon classes to the plugin upon initialization, like this:

```javascript
<script type="text/javascript">
	jQuery(document).ready(function($) {
	
		// cache notifier
		var $notifier = $('body').notifier;
		
		// initialize notifier
		$notifier.init({
			icons: {
				success: 'class-for-success',
				info: 'class-for-info',
				warning: 'class-for-warning',
				failure: 'class-for-failure'
			}
		});
		
		// display notification
		$notifier.notify({
			type: 'success',
			title: 'Save',
			subtitle: 'Your data has been successfully saved'
		});
	});
</script>
```

The above code will initialize $.notifier with your custom icon classes.

# Examples

Here's a full-featured example of a success notification:

```javascript
<script type="text/javascript">
	jQuery(document).ready(function($) {
	
		// cache notifier
		var $notifier = $('body').notifier;
		
		// initialize notifier
		$notifier.init();
		
		// display notification
		$notifier.notify({
			type: 'success',
			title: 'Success',
			subtitle: 'Subtitle for the success message...',
			showOnEvent: 'notifier.notify',
			delay: 1000,
			callbacks: {
				show: function() {
					$notifier.notify({
						type: 'info',
						title: 'Show',
						subtitle: 'Notification for the Show callback',
						delay: 1000
					});
				},
				hide: function() {
					$notifier.notify({
						type: 'warning',
						title: 'Hide',
						subtitle: 'Notification for the Hide callback',
						delay: 1000
					});
				}
			}
		});


		// you can trigger the 'success' notification anytime with:
		// $(document).trigger('notifier.notify');
	});
</script>
```

The 'success' notification above will be executed when the event 'notifier.notify' is triggered. The execution will be delayed with 1 second. On the show event of the notification a new 'info' notification will appear with a delay of 1 second. On the hide event of the notification a new 'warning' notification will appear, again with a delay of 1 second.

