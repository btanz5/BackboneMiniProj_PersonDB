/*
	This main.js file consist of a simple Backbone.js app.
	This is a simple Backbone.js App that allows the user to input their name, age, and sex. 
	The app then displays this information on the screen. 
	The user also is able to delete their name from the list.

	For file size reason, the Model, View, and Collection 
	are grouped by comments in this main.js file.   
*/ 
/*====
	Model
		====*/

	var Person = Backbone.Model.extend({
		defaults: {
			personName: "No Name",
			personAge: "Age Not Given",
			personSex: "Sex Not Given"
		},

		validate: function(attrs){
			if (attrs.personName == "No Name"){
				alert("Don't Be Scared To Enter Your Name, But Ok, Youll Be Nameless");
				personName == "No Name";
				return personName;
			};
		}
	}); 

/*====
	Collection
		====*/

	var Persons = Backbone.Collection.extend({
		model: Person
	});	

/*====
	View
		====*/

	var PersonView = Backbone.View.extend({
		tagName: "td",
		className: "personViewClass",

		initialize: function(addPerson){
			this.bus = addPerson.bus;
			this.model.on("remove", this.onRemovePersonClick, this);
		},

		events: {
			"click .removePersonBtn": "onRemovePersonClick"
		},

		onRemovePersonClick: function(){
			persons.remove(this.model);
			this.remove();
		},

		render: function(){
			this.$el.html(this.model.get("personName") + " " +this.model.get("personAge")+ " " + this.model.get("personSex") + " " + "<button class='removePersonBtn'>Remove Person</button>");
			return this;
		}
	});

	var PersonsView = Backbone.View.extend({
		tagName: "tr",
		className: "personViewTableClass",

		initialize: function(addPerson){
			this.bus = addPerson.bus;
			this.bus.on("addToPersonTable", this.updatePersonTable, this);
		},

		updatePersonTable: function(person){
			var updatePersonView = new PersonView({ model: person, bus: bus });
			this.$el.prepend(updatePersonView.render().$el);
		},

		render: function(){
			var that = this;
			this.model.each(function(person){
				var personView = new PersonView({ model: person, bus: that.bus});
				that.$el.append(personView.render().$el);
			});
		}

	});

	var AddNewPersonView = Backbone.View.extend({
		tagName: "div",
		className: "inputPerson",

		initialize: function(addPerson){
			this.bus = addPerson.bus;
		},

		events:{
			"click .addNewPersonName": "onAddNewPersonNameClick"
		},

		onAddNewPersonNameClick: function(e){
			var inputNameVal = $(".newNameInput").val();
			var inputAgeVal = $(".newAgeInput").val();
			var inputSexVal = $("input:radio[name = sex]:checked").val();
			if(inputNameVal && $.isNumeric(inputAgeVal) && inputSexVal){
				var newPersonInput = new Person({ personName: inputNameVal, personAge: inputAgeVal, personSex: inputSexVal});
				persons.add(newPersonInput, {at: 0});
				this.bus.trigger("addToPersonTable", newPersonInput);
				$(".newNameInput").val('');
				$(".newAgeInput").val('');
				$("input:radio[name = sex]").prop('checked', false);
				e.preventDefault();
			};
		},

		render: function(){
			this.$el.html("<input type='text' class='newNameInput' placeholder='Input Name' size= 20/> <input type='text' class='newAgeInput' placeholder='Input Age' size=10/> <input type='radio' class='newSexInput' name='sex' value='male'>Male <input type='radio' class='newSexInput' name='sex' value='female'>Female <button class='addNewPersonName'>Add New Person</button>");
		}
	});

	bus = _.extend({}, Backbone.Events);

	var persons = new Persons([
		new Person({ personName: "Ben Tansey", personAge: 29, personSex: "male"}),
		new Person({ personName: "MissB", personAge: 9, personSex: "female"})
	]);

	var addNewPersonView = new AddNewPersonView({ el: ".inputName", bus: bus});
	addNewPersonView.render();

	var personsView = new PersonsView({ el: ".personTableViewClass", model: persons, bus: bus});
	personsView.render();










