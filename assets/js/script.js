//executes function based on button click and text input on form
document.getElementById("submit").addEventListener("click", function () {
  event.preventDefault();
  let input = document.getElementById('search-input').value
  loadJSONFile(input);
  addHistory();
})


//global variables used for APIs which will be edited and executed in respective functions
//based on user input
var weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?q=";
var giphyAPI = "https://api.giphy.com/v1/gifs/search?q=";


var apikey = "&units=imperial&appid=8b3443943b4b694fb99d8d775a0e3820";

//initial check condition to see if it is user's first search/first
//time using program
var firstSearch = false;



// loads the JSON data from OpenWeather API
function loadJSONFile(input) {
  console.log(input)
  console.log("step 1 done.")
  //combines set variable with the input to create the url used for the search
  var searchURL = weatherAPI + input + apikey;
  console.log(searchURL);
  fetch(searchURL)
    .then(function (response) {
      return response.json();
    })
  //fills in the data fields using the given parameters
    .then(function (data) {
      console.log(data);
      
      document.getElementById("cityname").innerHTML = data.city.name;
      document.getElementById("country").innerHTML = "Country:  " + data.city.country;
      document.getElementById("temperature").innerHTML = "Current Temp:  " + data.list[0].main.temp;
      

      

    })

};



console.log("step 3 done.");

//used to select form input
var searchItem = document.querySelector('#search-input');

//used to select container to hold searchItems
var searchList = document.querySelector('#search-list');


//adds text input on form into local storage
function addHistory(event) {

  //Ignores/exits function if search item is empty
  if (searchItem.value.length < 1) return;
  console.log(searchItem.value)

  //used to create a variable 
  //that hold list of searchItems in localStorage or parses
  //stringified list of items in local storage into a list
  var saved = JSON.parse(localStorage.getItem('searchItems'));
  console.log(saved)

  //if saved value is null/false set value to empty list
  //since no searchItems have been added
  if (!saved) {
    saved = []
  };

  //if there are 3 searchItems remove the oldest
  //in order to make room for new item/limit list length
  if (saved.length === 3) {
    saved.shift()
  }
  //push new searchItem's value into list
  saved.push(searchItem.value)

  // Clear input
  searchItem.value = '';

  // saves list to localStorage as a string
  localStorage.setItem('searchItems', JSON.stringify(saved));

  //function to create buttons of search items
  displayHistory()
};


function displayHistory() {
  //parse saved searchItems string from local storage to a list
  var saved = JSON.parse(localStorage.getItem('searchItems'));
  console.log(saved)

  //resets html to contain no buttons
  searchList.innerHTML = "";

  //exit function if no searchItems present in list
  if (!saved) {
    return
  };

  //if it is not users first time using app,
  //automatically loads user's last search
  if (!firstSearch) {
    firstSearch = true
    loadJSONFile(saved[saved.length - 1])
  }

  //adds buttons for each search item onto html 
  //each button click executes loadJSONFile function which populates page with respective
  //API info
  for (var i = 0; i < saved.length; i++) {
    var character = saved[i];
    console.log(character)
    var stringedName = '"' + character + '"'
    var li = "<button value=" + character + " onclick='loadJSONFile(" + stringedName + ")'>" + character + "</button>"
    searchList.innerHTML = searchList.innerHTML + li

  }
}


displayHistory()