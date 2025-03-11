function expandMenu() {
    var element = document.getElementsByTagName("header")[0];
    var icon = document.getElementById('menu').getElementsByTagName('img')[0];
    element.classList.toggle("minimized");

    var body = document.getElementsByTagName('body')[0];
    var overlay = document.createElement('div');

    if (element.classList != 'minimized'){
      icon.src = '/assets/icons/close.svg'
      overlay.id = 'overlay';
      overlay.onclick = expandMenu;
      body.appendChild(overlay);
    } else {
      icon.src = '/assets/icons/menu.svg'
      item = document.getElementById('overlay') ;
      item.remove();
    }

  }

function getQuery() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if (params.kategori) {
    return params.kategori;
  } else {}
}

function hideProducts(query) {
  console.log(query)
  if(query) {
    var removed = [];
    var items = document.getElementById('main').getElementsByTagName('li');
    
    for (let item of items) {
        if (item.className != query) {
          removed.push(item)
        }
    }

    if (removed.length < items.length){
      for (let item of removed) {
          item.remove();
      }
    }

    // counter = document.createElement('p');
    // counter.className = 'small mono counter';
    // counter.textContent = 'Viser ' + items.length + ' av ';

    // link = document.createElement('a');
    // counter.className = 'small mono';
    // link.textContent = (items.length + removed.length) + ' viner';
    // link.href = '/utvalg.html';

    // counter.appendChild(link);
    // document.getElementById('main').prepend(counter);
  }
}

function filterProducts() {
  var items = document.getElementById('main').getElementsByTagName('li');
  var navigation = document.getElementById('filter');
  var categories = [];
  for (let i = 0; i < items.length; i++) {
    categories.indexOf(items[i].className) === -1 ? categories.push(items[i].className) : '';
  }
  categories.sort();
  var link = document.createElement('a');
  link.className = 'button';
  link.href = '/utvalg.html';
  link.textContent = 'Alle viner';
  navigation.appendChild(link);
  for (let i = 0; i < categories.length; i++) {
    var link = document.createElement('a');
    link.className = 'button';
    link.href = '?kategori=' + categories[i];
    link.textContent = categories[i];
    if (categories[i] == getQuery()) {
      link.className += ' selected';
    }
    navigation.appendChild(link);
  }


}