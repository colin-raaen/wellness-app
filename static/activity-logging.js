import { validateYNField } from './helpers.js';
import { validateFieldEntry } from './helpers.js';

//Let forms load first before executing
document.addEventListener('DOMContentLoaded', function(){
        // VARIABLES FOR ADDING ADDITIONAL WORKOUT AND WELLNESS DETAILS (used when need to rehide fields from "no" checkbox selections)
        // variable to store ADD WORKOUT button element
        const addWorkoutBtn = document.getElementById("add-workout-btn");
        // variable to store Additional Workout details container for fields to dynamically show
        const workoutsContainer = document.getElementById("workoutsContainer");
        // variable to store ADD WELLNESS TYPE button element
        const addWellnessBtn = document.getElementById("add-wellness-btn");
        // variable to store Additional Wellness details container for fields to dynamically show
        const wellnessContainer = document.getElementById("wellnessContainer");

        // UPDATE ACTIVITY LOGGING FIELDS BASED ON CHOICES MADE
        // Store activity form DOM elements in variables
        const thirtyMinCheckbox = document.getElementById('thirtyMin-yes');
        const thirtyMinCheckboxNo = document.getElementById('thirtyMin-no');
        const workoutCheckbox = document.getElementById('workout-yes');
        const workoutCheckboxNo = document.getElementById('workout-no');
        const wellnessCheckbox = document.getElementById('wellness-yes');
        const wellnessCheckboxNo = document.getElementById('wellness-no');
        const eatOutCheckbox = document.getElementById('eatOut-yes');
        const eatOutCheckboxNo = document.getElementById('eatOut-no');
        const drinkCheckbox = document.getElementById('drink-yes');
        const drinkCheckboxNo = document.getElementById('drink-no');
        const mealsOutDiv = document.getElementById('hidden_meals_out');
        const mealsOutEntry = document.getElementById('mealsOut');
        const drinksDiv = document.getElementById('hidden_drinks');
        const drinksEntry = document.getElementById('numberDrinks');
        const additionalWorkoutDiv = document.getElementById('hidden-additional-workout');
        const additionalWellnessDiv = document.getElementById('hidden-additional-wellness');
        const travellingCheckboxYes = document.getElementById('travel-yes');
        const travellingCheckboxNo = document.getElementById('travel-no');
        const sickCheckboxYes = document.getElementById('sick-yes');
        const sickCheckboxNo = document.getElementById('sick-no');

        // define the workout options for the workout select element drop down
        const workoutOptions = [
                { text: "Select Workout Type", disabled: true, selected: true, value: "" },
                { text: "Gym", value: "gym" },
                { text: "Workout Class", value: "class" },
                { text: "Sport/Athletics", value: "sport" },
                { text: "Bike", value: "bike" },
                { text: "Running", value: "running" },
                { text: "Extreme Sport", value: "extreme_sport" },
                { text: "Other", value: "other" }
        ];

        // define the class workout options for the workout class select element drop down
        const classOptions = [
                { text: "Select Class Type", disabled: true, selected: true, value: "" },
                { text: "Yoga", value: "yoga" },
                { text: "Barre", value: "barre" },
                { text: "Aerobics", value: "aerobics" },
                { text: "Other", value: "other" }
        ];

        // define the sport options for the sport select element drop down
        const sportOptions = [
                { text: "Select Sport Type", disabled: true, selected: true, value: "" },
                { text: "Tennis", value: "tennis" },
                { text: "Hockey", value: "hockey" },
                { text: "Soccer", value: "soccer" },
                { text: "Basketball", value: "basketball" },
                { text: "Racquetball/Squash", value: "racquet" },
                { text: "Other", value: "other" }
        ];

        // define the extreme sport options for the select element drop down
        const extremeSportOptions = [
                { text: "Select Extreme Sport Type", disabled: true, selected: true, value: "" },
                { text: "Snowboard", value: "snowboard" },
                { text: "Surf", value: "surf" },
                { text: "Skateboard", value: "skateboard" },
                { text: "Other", value: "other" }
        ];

        // define the wellness type options for the select element drop down
        const wellnessOptions = [
                { text: "Select Wellness Type", disabled: true, selected: true, value: "" },
                { text: "Meditation", value: "meditation" },
                { text: "Sauna/Spa", value: "sauna-spa" },
                { text: "Therapy", value: "therapy" },
                { text: "Other", value: "other" }
        ];

        // Wellness activity prefixes, used for removing dynamically added wellness inputs
        const wellnessPrefixes = ["newWellnessSelection", "remove_wellness_activity"];

        // Workout prefixes, used for removing dynamically added workout inputs
        const workoutPrefixes = ["newWorkoutSelection", "newClassSelection", "newSportSelection", 
        "newExtremeSportSelection", "newWorkoutLength", "remove_workout"];
        
        //JAVASCRIPT TO SET DATE INPUT TO TODAY'S DATE
        // Get the input element
        let activityDateInput = document.getElementById('activity-date');

        // Get today's date
        let today = new Date();

        // Format the date as YYYY-MM-DD
        let yyyy = today.getFullYear();
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let dd = String(today.getDate()).padStart(2, '0');
        let formattedDate = yyyy + '-' + mm + '-' + dd;

        // Set the value of the input field to today's date
        activityDateInput.value = formattedDate;
        
        // Event delegation, listen for Clicks on the entire Activity entry form
        // UPDATE ACTIVITY LOGGING FIELDS BASED ON Clicks MADE
        document.querySelector('form').addEventListener('click', function(event) {
                const target = event.target; // store target event for readability
                
                // Check which element was changed and update styles accordingly
                // If Workout checkbox selected
                if (target === workoutCheckbox && target.checked === true) {
                        handleNewWorkoutClick(); // call function to create new workout input
                        additionalWorkoutDiv.style.display = 'block';
                }

                else if (target === addWorkoutBtn){
                        handleNewWorkoutClick(); // call function to create new workout input fields and buttons
                }

                // if remove workout button was clicked
                else if (target.name.startsWith('additionalRemoveButton')){
                        handleRemoveInput(event, 'workout', workoutsContainer); // call function to remove workout passing in event
                }

                // If workout "yes" checkbox is unselected OR if Workout No checkbox selected
                else if ((target === workoutCheckbox && target.checked === false) || 
                        (target === workoutCheckboxNo && target.checked === true)){
                        handleHideAllInputs(workoutCheckbox, additionalWorkoutDiv, workoutsContainer);  // call function to hide all workout fields
                }

                // If Wellness box "Yes" is selected, show wellness type drop down field
                else if (target === wellnessCheckbox && target.checked === true) {
                        handleNewWellnessClick(); // call function to create new wellness input fields and buttons
                        additionalWellnessDiv.style.display = 'block'; // Show additional wellness button
                }

                // if add Wellness button is clicked
                else if(target === addWellnessBtn){
                        handleNewWellnessClick(); // call function to create new wellness input fields and buttons
                }

                // if remove wellness button was clicked
                else if (target.name.startsWith('additionalRemoveWellnessButton')){
                        handleRemoveInput(event, 'wellness', wellnessContainer); // call function to remove wellness input passing in event
                }

                // if Wellness "yes" is unselected, OR if Wellness No checkbox selected,
                // rehide additional fields and delete any existing additional Wellness fields
                else if ((target === wellnessCheckbox && target.checked === false) ||
                        (target === wellnessCheckboxNo && target.checked === true)){
                        handleHideAllInputs(wellnessCheckbox, additionalWellnessDiv, wellnessContainer);  // call function to rehide wellness fields
                }

                // If eating out "yes" checkbox was selected show meals out input box
                else if (target === eatOutCheckbox && target.checked === true) {
                        mealsOutDiv.style.display = 'block';
                }
                // If eating out "yes" checkbox is unselected, OR if Eat Out No checkbox selected
                // rehide the meals out input box
                else if ((target === eatOutCheckbox && target.checked === false) ||
                        (target === eatOutCheckboxNo && target.checked === true)){
                        mealsOutDiv.style.display = 'none'; // Hide eat out entry
                        mealsOutEntry.value = ""; // Set default input value back to null
                }
                
                // If drinking checkbox "yes" was selected unhide drinks entry,
                else if (target === drinkCheckbox && target.checked === true) {
                        drinksDiv.style.display = 'block';
                }
                // rehide if "yes" unselected OR if drink No checkbox selected
                else if ((target === drinkCheckbox && target.checked === false) || 
                        (target === drinkCheckboxNo && target.checked === true)) {
                        drinksDiv.style.display = 'none'; // Hide eat out entry
                        drinksEntry.value = ""; // Set default input value back to null
                }
        });

        // JAVASCRIPT TO SHOW/HIDE ADDITIONAL DROP DOWNS FIELDS DEPENDING ON WORKOUT TYPE SELECTED
        // Listen for changes on the entire Activity entry form
        document.querySelector('form').addEventListener('change', function(event) {
                const changeElement = event.target.id; // store id of element that was changed
                // if id of event that was changed is a workout drop down list
                if (changeElement.includes("additionalWorkoutSelection")){
                        // extract the number value from the button's name attribute using a regular expression
                        let index = event.target.name.match(/\d+/)[0];

                        // array of element prefixes to loop through
                        const elementPrefixes = ["ClassSelection", "SportSelection", "ExtremeSportSelection", "WorkoutLengthMin"];
                        // get and stroe each HTML element of element prefixes
                        const elements = elementPrefixes.map(prefix => document.getElementById(`additional${prefix}${index}`));

                        // Loop through each element to set values back to default values if workout type changes
                        elements.forEach(element => {
                                // if drop down menu
                                if (element.tagName === 'SELECT') {
                                        element.selectedIndex = 0; // set to first value
                                // else if input field
                                } else if (element.tagName === 'INPUT') {
                                        element.value = null; // set to null
                                }
                        });

                        // array of prefixes additional drop down lists to loop through
                        const typePrefixes = [
                                { type: "Class", value: "class" }, { type: "Sport", value: "sport" }, 
                                { type: "ExtremeSport", value: "extreme_sport" } 
                        ];
                        
                        // loop through each drop down list
                        for (const type of typePrefixes) {
                                // get and store each HTML element of type prefixes
                                const element = document.getElementById(`new${type.type}Selection${index}`);
                                // ternary statement, if workout dropdown value equals class, sport or extremesport, show dropdown
                                element.style.display = event.target.value === type.value ? 'block' : 'none';
                        }
                        // Show workout length when any workout type is selected, if not selected then hide
                        const newWorkoutLengthDiv = document.getElementById(`newWorkoutLength${index}`);
                        newWorkoutLengthDiv.style.display = event.target.value ? 'block' : 'none';
                }
        });

        // helper function to remove one individual workout input when remove button clicked
        function handleRemoveInput(event, type, container){
                // extract the number value from the button's name attribute using a regular expression
                const index = event.target.name.match(/\d+/)[0];
                // if workout remove called function, store workout prefixes to delete else if wellness remove called function, store workout prefixes to delete
                let elementPrefixes = (type === 'workout') ? workoutPrefixes : (type === 'wellness') ? wellnessPrefixes : null;

                // Loop through each prefix stored of HTML elements to remove
                elementPrefixes.forEach(prefix => {
                        // get HTML element based on prefix and index number
                        const element = document.getElementById(prefix + index);
                        element && element.remove(); // validate element exists, if yes remove the element
                });

                event.target.remove(); // remove "remove" hyperlink that triggered function call

                // if there are no children workouts/wellness activities, aka last workout/wellness activity
                if(!container.hasChildNodes()){
                        if (type === 'workout'){
                                // call handle all function to rehide workout buttons 
                                handleHideAllInputs(workoutCheckbox, additionalWorkoutDiv, container); 
                        }
                       else if (type === 'wellness'){
                                // call handle all function to rehide wellness buttons 
                                handleHideAllInputs(wellnessCheckbox, additionalWellnessDiv, container); 
                       }
                }
        }

        // helper function to hide workout/wellness fields if workout/wellness "yes" is unselected or "no" is selected
        function handleHideAllInputs(checkbox, additionalDiv, container){
                checkbox.checked = false;  // set yes checkbox to false
                additionalDiv.style.display = 'none'; // rehide Add Workout button

                // If additional Add Workouts fields exist,remove them from the container
                while (container.childNodes[0]) {
                        container.removeChild(container.childNodes[0]);
                }                       
        }

        // function to create the new div element
        function createNewDiv(id, className, style) {
                const newDiv = document.createElement("div");
                newDiv.id = id;
                newDiv.className = className;
                newDiv.style.display = style;
                return newDiv;
        }

        // function to create the select element with options
        function createSelectElement(name, id, className, options) {
                const selectElement = document.createElement("select");
                selectElement.name = name;
                selectElement.id = id;
                selectElement.className = className;

                options.forEach((option) => {
                        const optionElement = document.createElement("option");
                        optionElement.text = option.text;
                        optionElement.value = option.value;
                        optionElement.disabled = option.disabled;
                        optionElement.selected = option.selected;
                        selectElement.add(optionElement);
                });

                return selectElement;
        }

        // Initialize a counter variable for naming convention
        let workoutCount = 0;

        // Helper function to create new workout input
        function handleNewWorkoutClick(){
                // array of elements to create for new workout selection
                const workoutElements = [
                        { divIdName: `newWorkoutSelection${workoutCount}`, divClassName: "mb-3", divStyle: "", selectElementName: "additionalWorkoutSelection", selectionIdName: `additionalWorkoutSelection${workoutCount}`, className: "form-select mx-auto w-auto", options:  workoutOptions },
                        { divIdName: `newClassSelection${workoutCount}`, divClassName: "mb-3", divStyle: "none", selectElementName: "additionalClassSelection", selectionIdName: `additionalClassSelection${workoutCount}`, className: "form-select mx-auto w-auto", options:  classOptions },
                        { divIdName: `newSportSelection${workoutCount}`, divClassName: "mb-3", divStyle: "none", selectElementName: "additionalSportSelection", selectionIdName: `additionalSportSelection${workoutCount}`, className: "form-select mx-auto w-auto", options:  sportOptions },
                        { divIdName: `newExtremeSportSelection${workoutCount}`, divClassName: "mb-3", divStyle: "none", selectElementName: "additionalExtremeSportSelection", selectionIdName: `additionalExtremeSportSelection${workoutCount}`, className: "form-select mx-auto w-auto", options:  extremeSportOptions }
                ];

                // loop through array of elements to create
                for (const element of workoutElements) {
                        let divElement = createNewDiv(element.divIdName, element.divClassName, element.divStyle); // call new div function
                        let selectionElement = createSelectElement(element.selectionIdName, element.selectionIdName, element.className, element.options)

                        divElement.appendChild(selectionElement); // append select element to new div element
                        workoutsContainer.appendChild(divElement); // Append Div to Workout Container div
                }
                // Create new div for workout length field, intially hidden
                let newWorkoutLength = createNewDiv("newWorkoutLength" + workoutCount, "mb-3", "none");

                // create new input element for workout length
                let additionalWorkoutLength = document.createElement("input");
                additionalWorkoutLength.type = "number"
                additionalWorkoutLength.name = "additionalWorkoutLengthMin" + workoutCount;
                additionalWorkoutLength.id = "additionalWorkoutLengthMin" + workoutCount;
                additionalWorkoutLength.placeholder = "Workout Length (minutes)";
                additionalWorkoutLength.value = "";
                additionalWorkoutLength.className = "form-control mx-auto w-auto";
                additionalWorkoutLength.autocomplete = "off";
                additionalWorkoutLength.min = "0";
                
                newWorkoutLength.appendChild(additionalWorkoutLength); // append select element to new div element
                workoutsContainer.appendChild(newWorkoutLength); // Append Div to Workout Container div

                // Create new div for workout length field, intially hidden
                let newRemoveButton = createNewDiv("remove_workout" + workoutCount, "mb-3", "");

                // create new remove button element
                let additionalRemoveButton = document.createElement("a");
                additionalRemoveButton.href = '#';
                additionalRemoveButton.name = "additionalRemoveButton" + workoutCount;
                additionalRemoveButton.innerText = 'Remove Workout';

                newRemoveButton.appendChild(additionalRemoveButton); // append select element to new div element
                workoutsContainer.appendChild(newRemoveButton); // Append Div to Workout Container div

                // Add to workout counter
                workoutCount++;
        }

        // JAVASCRIPT TO APPEND NEW WELLNESS SELECTION FIELD IF BUTTON IS CLICKED
        // Initialize a counter variable
        let wellnessCount = 0;

        // Helper function to create new wellness input
        function handleNewWellnessClick(){
                // call new div function for Sport selection drop down
                let newWellnessSelection = createNewDiv(`newWellnessSelection${wellnessCount}`, "mb-3", "block");
                // call new selection function for Sport selection drop down
                let additionalWellnessSelection = createSelectElement(`additionalWellnessSelection${wellnessCount}`, `additionalWellnessSelection${wellnessCount}`, "form-select mx-auto w-auto", wellnessOptions);

                // append select element to new div element
                newWellnessSelection.appendChild(additionalWellnessSelection);
                // Append Div to Workout Container div
                wellnessContainer.appendChild(newWellnessSelection);

                // Create new div for remove wellness item hyperlink
                let newRemoveWellnessButton = createNewDiv("remove_wellness_activity" + wellnessCount, "mb-3", "");

                // create new remove button element
                let additionalRemoveWellnessButton = document.createElement("a");
                additionalRemoveWellnessButton.href = '#';
                additionalRemoveWellnessButton.name = "additionalRemoveWellnessButton" + wellnessCount;
                additionalRemoveWellnessButton.innerText = 'Remove Wellness Type';

                // append select element to new div element
                newRemoveWellnessButton.appendChild(additionalRemoveWellnessButton);
                // Append Div to Workout Container div
                wellnessContainer.appendChild(newRemoveWellnessButton);

                // Add to workout counter
                wellnessCount++;
        }

        // PERFORM FIELD VALIDATIONS ON FORM SUBMISSION
        // fucnction that is called on form submission to perform validations
        function validateForm() {    
                // store array of fields Y/N fields to validate, storing yes checkbox, no checkbox, and field name for error message
                const validationFields = [
                        { checkbox: thirtyMinCheckbox, errorMessage: "30 min activity", negativeCheckbox: thirtyMinCheckboxNo },
                        { checkbox: workoutCheckbox, errorMessage: "workout", negativeCheckbox: workoutCheckboxNo },
                        { checkbox: wellnessCheckbox, errorMessage: "wellness", negativeCheckbox: wellnessCheckboxNo },
                        { checkbox: eatOutCheckbox, errorMessage: "eat out", negativeCheckbox: eatOutCheckboxNo },
                        { checkbox: drinkCheckbox, errorMessage: "drinks", negativeCheckbox: drinkCheckboxNo },
                        { checkbox: travellingCheckboxYes, errorMessage: "travelling", negativeCheckbox: travellingCheckboxNo },
                        { checkbox: sickCheckboxYes, errorMessage: "sick", negativeCheckbox: sickCheckboxNo }
                ];
                // for every field in the array of stored fields, call the validateYN function with the field inputs
                // if any field returns false, the entire statement returns false and only throws one error message
                // for first field found with an error
                let boolYesNoFieldCheck = validationFields.every(field => validateYNField(field.checkbox, field.errorMessage, field.negativeCheckbox));
                // If a yes/no field doesn't pass validation checks, return false and display error, else continue to next validation check
                if (boolYesNoFieldCheck === false){
                        return false;
                }

                // FIELD VALIDATIONS FOR DYNAMICALLY ADDED WORKOUTS AND WELLNESS ACTIVITIES
                // select all the dynamically created Workout Type drop down elements
                const selectWorkoutTypeElements = document.querySelectorAll('select[name^="additionalWorkoutSelection"]');
                // select all the dynamically created Workout Class Type drop down elements
                const selectWorkoutClassTypeElements = document.querySelectorAll('select[name^="additionalClassSelection"]');
                // select all the dynamically created Sport Type drop down elements
                const selectSportTypeElements = document.querySelectorAll('select[name^="additionalSportSelection"]');
                // select all the dynamically created Extreme Sport Type drop down elements
                const selectExtremeSportTypeElements = document.querySelectorAll('select[name^="additionalExtremeSportSelection"]');
                // select all the dynamically created Workout Length input elements
                const selectWorkoutLengthElements = document.querySelectorAll('input[name^="additionalWorkoutLengthMin"]');

                // If at least one workout OR wellness activity has been logged
                if (selectWorkoutTypeElements.length > 0){
                        // iterate through each workout element and check to validate all drop downs are populated
                        for (let i = 0; i < selectWorkoutTypeElements.length; i++) {
                                // array or validations checks on form submission and error messages to throw if true
                                const validations = [
                                        { condition: selectWorkoutTypeElements[i].value === "", message: 'Please ensure a workout type is selected.' },
                                        { condition: selectWorkoutTypeElements[i].value === "class" && selectWorkoutClassTypeElements[i].value === "", message: 'Please ensure a class type is selected.' },
                                        { condition: selectWorkoutTypeElements[i].value === "sport" && selectSportTypeElements[i].value === "", message: 'Please ensure a sport type is selected.' },
                                        { condition: selectWorkoutTypeElements[i].value === "extreme_sport" && selectExtremeSportTypeElements[i].value === "", message: 'Please ensure a extreme sport type is selected.' },
                                        { condition: selectWorkoutLengthElements[i].value === "", message: 'Please ensure workout length is filled in.' },
                                        { condition: eatOutCheckbox.checked && mealsOutEntry.value === "", message: 'Please ensure a number of meals is filled out.' },
                                        { condition: drinkCheckbox.checked && drinksEntry.value === "", message: 'Please ensure a number of drinks is filled out.' }
                                ];

                                // Call field validation helper function to loop through validation checks, alert if condition found
                                if (!validateFieldEntry(validations)) {
                                        return false; // If validation fails, prevent form submission
                                }
                        }
                }

                // FIELD VALIDATIONS FOR DYNAMICALLY ADDED WELLNESS ACTIVITIES
                // select all the dynamically created Wellness drop down elements
                const selectWellnessElements = document.querySelectorAll('select[name^="additionalWellnessSelection"]');

                //iterate through list of additional wellness selections that have been dynamically added
                for (let i = 0; i < selectWellnessElements.length; i++) {
                        // array for validation check and message for wellness activity
                        const validations = [ { condition: selectWellnessElements[i].value === "", message: 'Please ensure a wellness type is selected.' }];
                        // Call field validation helper function to loop through validation checks, alert if condition found
                        if (!validateFieldEntry(validations)) {
                                return false; // If validation fails, prevent form submission
                        }
                }

                // STORE VALUES OF ADDITIONAL WELLNESS AND WORKOUT INPUTS AND PASS TO BACKEND VIA HIDDEN HTML ELEMENT
                // Create an empty array to store the selected Wellness values
                let selectedWellnessValues = [];
                // Create an empty array to store the objects of selected Workout values
                let selectedWorkoutValues = [];

                // iterate through each Wellness element and push its selected value into the array
                for (let i = 0; i < selectWellnessElements.length; i++) {
                        selectedWellnessValues.push(selectWellnessElements[i].value);
                }

                // iterate through each Workout element and create an object to store workout values
                for (let i = 0; i < selectWorkoutTypeElements.length; i++) {
                        let newWorkoutType = {}; // create an empty object
                        newWorkoutType["workoutType"] = selectWorkoutTypeElements[i].value; // store value of selected workout type
                        newWorkoutType["workoutClassType"] = selectWorkoutClassTypeElements[i].value; // store value of selected workout type
                        newWorkoutType["sportType"] = selectSportTypeElements[i].value; // store value of selected workout type
                        newWorkoutType["extremeSportType"] = selectExtremeSportTypeElements[i].value; // store value of selected workout type
                        newWorkoutType["workoutLength"] = selectWorkoutLengthElements[i].value; // store value of selected workout type

                        selectedWorkoutValues.push(newWorkoutType); // push object into array of workouts

                }

                // Set value of hidden HTML element to pass to backend on submission
                let selectedWellnessValuesInput = document.querySelector('#selectedWellnessValuesInput');
                selectedWellnessValuesInput.value = JSON.stringify(selectedWellnessValues);

                // Set value of hidden HTML element to pass to backend on submission
                let selectedWorkoutValuesInput = document.querySelector('#selectedWorkoutValuesInput');
                selectedWorkoutValuesInput.value = JSON.stringify(selectedWorkoutValues);
        }

        // Call function on activity form submission
        document.getElementById('activity-form').onsubmit = validateForm;
});
