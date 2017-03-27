
// App: Ghibli
// ------------------------------
// ghibliService
//   iterateMovies
//     notifier
//     randomGradient


// create application via initialzr
(function(init) {
    init({
        name: "myApp"
    });
})(initialzr);

// create node family "ghibli"
myApp.augment("ghibli");


// Node: ghibliService
// retrieves data from an endpoint via AJAX
myApp.addNode("ghibli", "ghibliService", function(args) {
    var callback = args.callback;

    $.ajax({
        type: "GET",
        url: "https://ghibliapi.herokuapp.com/films",
        success: function(response) {

            // execute client callback
            callback(null, response);
        },
        error: function(error) {

            // execute client callback
            callback(error);
        }
    })
});


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


// Node: randomGradient
// applies random gradient to the background of a jQuery element
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