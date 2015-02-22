Backbone.Events.onReady
=======================

Adds `onReady` and `triggerReady` methods to `Backbone.Events`.   

**Behaviour:**  
> *Before ready* - register callback.  
> *On ready* - run all pending callbacks, passing in any data from `triggerReady`.  
> *After ready* - run callback immediately, passing in cached data.  

###API

The below methods are available for any object supporting the Backbone.Events API.  
i.e. `View`, `Model`, `Collection` or a general purpose [event dispatcher](http://backbonejs.org/#Events).  

- Using the default *"ready"* event:

    - `object.onReady(callback)`  
      Run `callback` when `triggerReady` is called, or immediately thereafter.  

    - `object.triggerReady(dataObject)`  
      Run all callbacks provided by `onReady`, passing in optional `dataObject`. 

- With a custom *eventName* argument:

    - `object.onReady(eventName, callback)`  
      Run `callback` when `triggerReady` is called for `eventName`, or immediately thereafter.  

    - `object.triggerReady(eventName, dataObject)`  
      Run all callbacks provided by `onReady` for `eventName`, passing in optional `dataObject`.  

###Notes

- Calling `triggerReady()` more than once will update the data passed to future callbacks, but do nothing else.  

- onReady() event names can also be listened for via the other Backbone.Events methods.  
  If no `eventName` argument was specified (i.e. `view.onReady()`), the event name is `"ready"`.  
  ```javascript
  view.on("all", function(eventName){
    if(eventName === "ready"){
      console.log("View is ready");
    }
  });
  ```

###Use case examples

*See `examples` directory for complete code.*

- **Using onReady() with a View**  
  Say you want to log messages to a console view at many different async points, but it may not be ready. It could be waiting for DOM ready, or for another dependency like a CSS file.  
  Wrap the calls in `view.onReady(...)`, and then call `this.triggerReady()` from within the view. Pre-ready callbacks will run in order, and then further calls will run immediately.  
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

- **Using onReady() for API responses**  
  You have a `getUser()` method in your JavaScript API, that could be called at any time, but the data may not be ready.  
  Subscribe each callback to an `onReady()` event, and then call `triggerReady({...})` with the data to pass into all callbacks.
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
