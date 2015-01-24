/*
  Add `onready()` method to `Backbone.Events`, similar to `$.ready()`.

  Behaviour:
    Before event: register callback (same as `event.once()`)
    On event: run all pending callbacks
    After event: run callback immediately with cached arguments.
  
  NOTE:
  Calling trigger() again will just update the arguments for any future callbacks.
*/
(function(_, Backbone){

    var bbEventsTrigger = Backbone.Events.trigger;

    var readyDispatcher = {

        readyFlags: {},
        readyResponses: {},

        onready: function(eventName, callback, context){
            if(this.readyFlags[eventName]){
                callback.apply(context, this.readyResponses[eventName]);
            }
            else{
                this.readyFlags[eventName] = false;
                this.once.apply(this, arguments);
            }
        },

        trigger: function(eventName /*, arguments */){
            if(eventName in this.readyFlags){
                this.readyFlags[eventName] = true;
                this.readyResponses[eventName] = _.toArray(arguments).slice(1);
            }
            bbEventsTrigger.apply(this, arguments);
        }

    }

    //Merge into Backbone.Events
    _.extend(Backbone.Events, readyDispatcher);

    //Merge in to all Backbone member prototypes where _.extend(..., Events) was applied
    _.each(
        ["Model", "Collection", "View", "Router", "History"],
        function(p){
            _.extend(Backbone[p].prototype, readyDispatcher);
        }
    );

})(_, Backbone);
