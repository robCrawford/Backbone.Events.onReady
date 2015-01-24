
var _event = _.clone(Backbone.Events);

describe("Event tests", function(){

	it("Should run pending on() callbacks when event is triggered", function(done){

		var callbacksCount = 0,
			triggerCount = 0;

		_event.on("testEvent1", function(count){
			callbacksCount++;
		});
		_event.on("testEvent1", function(count){
			callbacksCount++;
		});
		_event.on("testEvent1", function(count){
			expect(callbacksCount).toBe(2);
			expect(triggerCount).toBe(1);
			done();
		});
		_event.trigger("testEvent1", triggerCount++);

	});

	it("Should run on() callbacks each time event is triggered, with new data", function(done){

		var callbacksCount = 0;

		_event.on("testEvent2", function(count){
			callbacksCount++;
			expect(callbacksCount).toEqual(count);
		});

		_event.trigger("testEvent2", 1);
		_event.trigger("testEvent2", 2);
		_event.trigger("testEvent2", 3);
		done();

	});

	it("Should run pending ready() callbacks when event is triggered", function(done){

		var callbacksCount = 0,
			triggerCount = 0;

		_event.onready("testEvent3", function(count){
			callbacksCount++;
		});
		_event.onready("testEvent3", function(count){
			callbacksCount++;
		});
		_event.onready("testEvent3", function(count){
			expect(callbacksCount).toBe(2);
			expect(triggerCount).toBe(1);
			done();
		});
		_event.trigger("testEvent3", triggerCount++);

	});

	it("Should only run ready() callbacks first time event is triggered", function(done){

		var callbacksCount = 0;

		_event.onready("testEvent4", function(count){
			callbacksCount++;
		});

		_event.trigger("testEvent4", 1);
		_event.trigger("testEvent4", 2);
		_event.trigger("testEvent4", 3);

		expect(callbacksCount).toEqual(1);
		done();

	});

	it("Should then run ready() callbacks immediately, with cached data", function(done){

		var callbacksCount = 0;

		_event.onready("testEvent5", function(count){
			callbacksCount++;
			expect(count).toEqual(1);
		});

		_event.trigger("testEvent5", 1);

		_event.onready("testEvent5", function(count){
			callbacksCount++;
			expect(count).toEqual(1);
		});

		_event.trigger("testEvent5", 7); //Should update response

		_event.onready("testEvent5", function(count){
			callbacksCount++;
			expect(count).toEqual(7); //Should still be cached data
		});

		expect(callbacksCount).toEqual(3);
		done();

	});

	it("Should work with Backbone Model", function(done){

		var TestModel = Backbone.Model.extend({

				initialize: function(options){
					var model = this;

					//Fake a delay for fetch
					setTimeout(function(){
						model.trigger("data:fetched");
					}, 250);
				}

			});

		var testModel = new TestModel();
		testModel.onready("data:fetched", done);

	});

	it("Should work with Backbone View", function(done){

		var TestView = Backbone.View.extend({

				render: function(options){
					//Set ready listener
					this.trigger("ui:rendered", "testValue");
				}

			});

		var testView = new TestView();

		testView.onready("ui:rendered", function(v){
			expect(v).toEqual("testValue");
		});
		testView.onready("ui:rendered", done);

		testView.render();
	});

});
