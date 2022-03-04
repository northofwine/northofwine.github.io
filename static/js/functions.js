var data = [];

function loadContent(data) {
  createFilter(data);
  createList(data);
  setNavButtonClass(getCategory());

  categories = dataCategories(data);

  console.log(data);
  console.log(categories);

  sessionStorage.setItem('data', JSON.stringify(data));
  sessionStorage.setItem('categories', categories);
}

function dataCategories(data) {
  // Init array with "all"-category
  var categories = ['Alle'];
  // Find categories in data
  for (i = 0; i < data.length; i++) {
    if (!categories.includes(data[i].productTypeName)) {
      // Add category to categoryList
      categories.push(data[i].productTypeName);
    }
  }
  categories.sort(); // Sort categories alphabetically
  return categories;
}

function setFilter(category) {
  buttons = document.getElementById('filter').getElementsByTagName('a');
  if (category) {
    window.history.replaceState(null, null, '?cat=' + category);
  } else {
    window.history.replaceState(null, null, 'produkter.html');
  }
  createList(data);
  setNavButtonClass(category);
}

function setNavButtonClass(category) {
  var buttons = document.getElementById('filter').getElementsByTagName('a');
  for (i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('selected');
    if (buttons[i].innerHTML == category) {
      buttons[i].classList.add('selected');
    }
  }
  if (!category) {
    buttons[0].classList.add('selected');
  }
}

function getCategory() {
  params = new URLSearchParams(window.location.search);
  category = params.get('cat');
  return category;
}

function createFilter(data) {
  // Init categoryList with "all"-category
  var categoryList = ['Alle'];
  // Find categories in data
  for (i = 0; i < data.length; i++) {
    if (!categoryList.includes(data[i].productTypeName)) {
      // Add category to categoryList
      categoryList.push(data[i].productTypeName);
    }
  }
  categoryList.sort(); // Sort categories alphabetically
  nav = document.createElement('nav');
  // Create buttons for each category and add to filter
  for (i = 0; i < categoryList.length; i++) {
    action = 'setFilter("' + categoryList[i] + '");'
    navButton = document.createElement('a');
    navButton.innerHTML = categoryList[i];
    navButton.setAttribute('onClick', action);
    navButton.classList.add('button');
    nav.appendChild(navButton);
  }
  document.getElementById('filter').appendChild(nav);
  document.getElementById('filter').style.opacity = 1;
}

function createList(data) {
  category = getCategory(); // Get categories
  if (!category || category == 'Alle') { // Check if "all"-category is selected
    filteredData = data; // Skip filtering
  } else {
    filteredData = data.filter(function (el) {
      return el.productTypeName == category; // Filter category
    });
  }
  document.getElementById('content').innerHTML = ''; // Clear content
  for (i = 0; i < filteredData.length; i++) {
    createItem(filteredData[i])
  }
  document.getElementById('content').style.opacity = 1;
}

function createItem(data) {
  item = document.createElement('article');
  item.className = 'product';

  info = document.createElement('div');
  info.className = 'info';

  productTypeName = document.createElement('h5');
  productTypeName.innerHTML = data.productTypeName;
  info.appendChild(productTypeName);

  title = document.createElement('h3');
  title.innerHTML = [data.productShortName, data.vintage].join(' ');
  info.appendChild(title);

  meta = document.createElement('p');
  if (data.subRegion) {
    meta.innerHTML = [data.country, data.region, data.subRegion].join(', ');
  } else if (data.region) {
    meta.innerHTML = [data.country, data.region].join(', ');
  } else if (data.country) {
    meta.innerHTML = data.country;
  }
  info.appendChild(meta);

  grapes = document.createElement('p');
  grapes.innerHTML = data.grapes;
  info.appendChild(grapes);

  selection = document.createElement('a');
  selection.setAttribute('target', '_blank');
  if (data.selection && data.price) {
    selection.innerHTML = 'I ' + data.selection.toLowerCase() + ' på Vinmonopolet - ' + data.price + ' kr';
    selection.setAttribute('href', 'https://vinmonopolet.no/p/' + data.productId);
    info.appendChild(selection);
  } else if (data.selection) {
    selection.innerHTML = 'I ' + data.selection.toLowerCase() + ' på Vinmonopolet';
    selection.setAttribute('href', 'https://vinmonopolet.no/p/' + data.productId);
    info.appendChild(selection);
  }

  item.appendChild(info);

  image = document.createElement('img');
  if (data.image) {
    image.src = '/static/images/products/thumbs/' + data.image + '.jpg';
  } else {
    image.src = '/static/images/bottle.svg';
  }
  item.appendChild(image);

  document.getElementById('content').appendChild(item);
}


function init(url, age = 86400000) {
  let currentTimestamp = Date.now();
  let dataTimestamp = sessionStorage.getItem('timestamp');
  let timeDiff = (currentTimestamp - dataTimestamp);

  // TODO: Set age to something else than milliseconds?

  // Check if data exists in sessionStorage
  if (sessionStorage.getItem('data') && timeDiff < age ) {
    console.log('Data exists, and is newer than ' + age / 1000 + ' seconds');
    console.log('Data downloaded at: ' + dataTimestamp);
    loadContent(JSON.parse(sessionStorage.getItem('data')));
  } else {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function(results) {

        if (sessionStorage.getItem('data')) {
          console.log('Data exists, but is older than ' + age / 1000 + ' seconds');
        } else {
          console.log('Data did not exist');
        }

        sessionStorage.setItem('timestamp', currentTimestamp);
        console.log('Data downloaded at: ' + currentTimestamp);

        function compare( a, b ) {
          if ( a.productShortName < b.productShortName ){return -1;}
          if ( a.productShortName > b.productShortName ){return 1;}
          return 0;
        }

        results.data.sort( compare );
        data = results.data;

        loadContent(data);
        return data;
      }
    });
  }
}
