# Initialzr
## JavaScript front-end application construct

Initialzr is a light-weight JavaScript application construct plugin. This plugin exposes a simple API for building efficient, extensible, easy to maintain but most of all SANE JS front-end applications which run fast. Really fast.

Initialzr has been designed with performance in mind. The non-minified version of the plugin is 5 KB, while the minified is just 2 KB. Th whole plugin spans on about 130 lines of code.

Under the hood Initialzr is an Object Oriented module, which has two primary tasks:
 
 - exposing powerful methods for manipulating application data
 - ensuring core functionality is protected from public use.

# Requirements

Initialzr runs on the ES5 standard, so you just need a browser. That's it, no external dependencies.


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
<script type="text/javascript">

	// create application via initialzr
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
<script type="text/javascript">

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

You might be wondering, will the options data become publicly available. Will you be able to access or modify it from photoGallery.options for example? 

The answer is no. Initialzr creates "safe" applications, which mostly have read-only fields. These fields can be retrieved via the plugin's API in a safe way.
 
Once your app is initialized, it will have access to the following methods:


```javascript
<script type="text/javascript">
	
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
	
	// retrieves all defined node items from node space "components"
	// @param string
	// @return array
	app.getNodeItems("components");
	
	// retrieves a node, from the node space "components"
	// @param string
	// @param string
	// @return mixed
	app.getNode("components", "name");
	
	// checkes if node space exists
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
	
	// add a new component in the node space "components"
	// @param string
	// @param function
	app.addComponent("componentName", function);
	
	// add a new module in the node space "modules"
	// @param string
	// @param function
	app.addModule("moduleName", function);
	
	// get helper node "helperName"
	// @param string
	app.getHelper("helperName");
	
	// get module node "moduleName"
	// @param string
	app.getModule("moduleName");
	
	// get component node "componentName"
	// @param string
	app.getComponent("componentName");
</script>
```

As seen above, the only way to add functionality to your app is through the node API. Node equals method. Nodes have node spaces. Here's a diagram of how the nodes look inside an initialzr app:


```javascript
<script type="text/javascript">
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

An initialzr app has 3 default node spaces - helpers, modules, components. Whether you'll use these spaces or define your own node spaces is up to you. The Node API supports creating of new node spaces through the augment() method.

I personally use the default node spaces in the following way:

- helpers: contain global helper methods, which need to be available to all nodes from other node spaces
- modules: contain core functionality for managing the application
- components: contain DOM-related functionality, which is tightly coupled with html templates

Please note the sequence as it matters, especially if you are concatenating your javascripts using build tools like gulp or grunt.

Now, let's play with some of the methods, which come with the node API.

Let's create a new application.


```javascript
<script type="text/javascript">

	// create application "myApp"
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
- then your functionality becomes accessible through the plugin's API

Please note that you do NOT have direct access to the app's properties, so if you try to do something funky like delete myApp.nodes or myApp.nodes = undefined, the operation will fail, returning a boolean literal. 



The above code will simply initialize a notification and show it on the page right away. 

Alternatively, you can show the notification with a delay as we saw previously:

```javascript
<script type="text/javascript">
	jQuery(document).ready(function($) {
	
		// cache notifier
		var $notifier = $('body').notifier;
		
		// initialize notifier
		$notifier.init();
		
		// display notification with delay
		$notifier.notify({
			type: 'success',
			title: 'Success',
			subtitle: 'Hey, you made it!',
			delay: 1000
		});
	});
</script>
```

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

