
// Ghibli Studio Movies
// ------------------------------
//  entrypoint
//    studioGhibliService
//      displayMovies
//        randomGradient
//          notifier


// create application via initialzr
(function(init) {
    init({
        name: "myApp"
    });
})(initialzr);


// add helper for ajax operations
myApp.addHelper("studioGhibliService", function(args) {
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


// entrypoint
jQuery(document).ready(function() {
    var app = myApp;
    var studioGhibliService = app.getHelper("studioGhibliService");
    var notifier            = app.getHelper("notifier");

    studioGhibliService({
        callback: function(err, response) {

            if ( response ) {
                app.getHelper("displayMovies")({
                    interval: 1000,
                    movies: response
                });
            }
        }
    });
});