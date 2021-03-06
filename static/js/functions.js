function setContent(data, timestamp) {
  let categories = ['Alle']; // Init categories-array with "all"-category
  for (i = 0; i < data.length; i++) { // Find categories in data and push if not included
    if (!categories.includes(data[i].productTypeName)) {
      categories.push(data[i].productTypeName);
    }
  }
  categories.sort(); // Sort categories alphabetically

  sessionStorage.setItem('timestamp', timestamp);
  sessionStorage.setItem('data', JSON.stringify(data));
  sessionStorage.setItem('categories', JSON.stringify(categories));
}

function filterBy(category) {
  buttons = document.getElementById('filter').getElementsByTagName('a');
  if (category) {
    window.history.replaceState(null, null, '?cat=' + category);
  } else {
    window.history.replaceState(null, null, 'utvalg.html');
  }
  createList(JSON.parse(sessionStorage.getItem('data')));
  setNavButtonClass(getFilterParams());
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

function getFilterParams() {
  params = new URLSearchParams(window.location.search);
  category = params.get('cat');
  return category;
}

function createFilter(categories) {
  nav = document.createElement('nav');
  // Create buttons for each category and add to filter
  for (i = 0; i < categories.length; i++) {
    action = 'filterBy("' + categories[i] + '");'
    navButton = document.createElement('a');
    navButton.innerHTML = categories[i];
    navButton.setAttribute('onClick', action);
    navButton.classList.add('button');
    nav.appendChild(navButton);
  }
  document.getElementById('filter').appendChild(nav);
}

function createList(data) {
  category = getFilterParams(); // Get categories
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
  if (data.productId && data.selection && data.price) {
    selection.innerHTML = 'I ' + data.selection.toLowerCase() + ' p?? Vinmonopolet - ' + data.price + ' kr';
    selection.setAttribute('href', 'https://vinmonopolet.no/p/' + data.productId);
    info.appendChild(selection);
  } else if (data.productId && data.selection) {
    selection.innerHTML = 'I ' + data.selection.toLowerCase() + ' p?? Vinmonopolet';
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
  // TODO: Set age to something else than milliseconds?
  let initTimestamp = Date.now();
  var dataTimestamp = sessionStorage.getItem('timestamp');
  var timeDiff = (initTimestamp - dataTimestamp);

  // Check if data exists in sessionStorage
  if (sessionStorage.getItem('data') && timeDiff < age ) {
    createList(JSON.parse(sessionStorage.getItem('data'))); // Add items to HTML
    createFilter(JSON.parse(sessionStorage.getItem('categories'))); // Add filter to HTML
    setNavButtonClass(getFilterParams()); // Highlight selected filter
  } else {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        function compare( a, b ) {
          if ( a.productShortName < b.productShortName ){return -1;}
          if ( a.productShortName > b.productShortName ){return 1;}
          return 0;
        }
        results.data.sort( compare );
        data = results.data;

        setContent(data, initTimestamp);

        createList(JSON.parse(sessionStorage.getItem('data')));
        createFilter(JSON.parse(sessionStorage.getItem('categories')));
        setNavButtonClass(getFilterParams());
      }
    });
  }
}
