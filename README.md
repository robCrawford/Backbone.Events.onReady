Backbone.Events.onReady
=======================

Adds `onReady()` and `triggerReady()` methods to `Backbone.Events`.  
These can be used with `View`, `Collection`, `Model`, etc. or with a general purpose [event dispatcher](http://backbonejs.org/#Events).  

**Behaviour:**  
> *Before event* - register callback.  
> *On event* - run all pending callbacks.  
> *After event* - run callback immediately (*with cached argument values*).  

###Use case examples

*See `examples` directory for complete code.*

- **Using onReady() with a View**  
  You want to log messages to a console view at many different async points, without knowing whether the view is ready yet.  
  The view may be waiting for DOM ready, or for another dependency like a CSS file.  
  Wrap calls in a `view.onReady()` callback, and then call `this.triggerReady()` from within the view.  
  ```javascript
  var ConsoleView = Backbone.View.extend({

    initialize: function(){
        var view = this;

        $(function(){
            view.$el.appendTo("body");
            view.triggerReady();
        });
        ...
    },
  }
  ...
  myConsole.view.onReady(function(){
    myConsole.log("Start time: " + Date.now());
  });
  ```
  Pre-ready messages will be logged in order, and any later messages will be logged immediately.

- **Using onReady() for API responses**  
  You have a `getUser()` method in your JavaScript API, that could be called at any time, but the data may not be ready.  
  Subscribe each callback to an `onReady()` event, and then call `triggerReady({...})` with the data to pass into the callbacks.
  ```javascript
  var events = _.clone(Backbone.Events);
  var api = {
        getUser: function(callback){
            events.onReady("userData", callback);
        }
    };
  ...
  events.triggerReady("userData", {id: "ABC123"});
  ```
  Pending callbacks will run in order, and any future calls will run immediately with cached data. Cached values can be refreshed by calling `triggerReady({...})` again.

###Notes

- Calling `triggerReady()` more than once will update the arguments passed in to future callbacks, but do nothing else.  

- onReady() event names can also be listened for via the other Backbone.Events methods.  
  If no `eventName` argument was specified (i.e. `view.onReady()`), the event name is `"ready"`.  
  ```javascript
  view.on("all", function(eventName){
    if(eventName === "ready"){
      console.log("View is ready");
    }
  });
  ```
