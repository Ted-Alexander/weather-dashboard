var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var firstSearch = false;

function getParams() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split('&');

  // Get the query and format values
  var query = searchParamsArr[0].split('=').pop();
  // var format = searchParamsArr[1].split('=').pop();

  searchApi(query);
}

function printResults(resultObj) {
  console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');
  titleEl.textContent = resultObj.title;

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Date:</strong> ' + resultObj.date + '<br/>';

  if (resultObj.subject) {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> ' + resultObj.subject.join(', ') + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> No subject for this entry.';
  }

  if (resultObj.description) {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong> ' + resultObj.description[0];
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong>  No description for this entry.';
  }

  var linkButtonEl = document.createElement('a');
  linkButtonEl.textContent = 'Read More';
  linkButtonEl.setAttribute('href', resultObj.url);
  linkButtonEl.classList.add('btn', 'btn-dark');

  resultBody.append(titleEl, bodyContentEl, linkButtonEl);

  resultContentEl.append(resultCard);
}

function searchApi(query, format) {
  var locQueryUrl = 'https://www.loc.gov/search/?fo=json';

  if (format) {
    locQueryUrl = 'https://www.loc.gov/' + format + '/?fo=json';
  }

  locQueryUrl = locQueryUrl + '&q=' + query;

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      resultTextEl.textContent = locRes.search.query;

      console.log(locRes);

      if (!locRes.results.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        for (var i = 0; i < locRes.results.length; i++) {
          printResults(locRes.results[i]);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  // var formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchApi(searchInputVal);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

getParams();

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
    searchApi(saved[saved.length - 1])
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

