function expandMenu() {
    var menu = document.getElementsByTagName("header")[0].getElementsByTagName("nav")[0];
    var open = document.getElementById("menu-open");
    var close = document.getElementById("menu-close");
    menu.classList.toggle("hidden");
    open.classList.toggle("hidden");
    close.classList.toggle("hidden");
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
  if(query) {
    if(query == 'Trondheimsserien') {

      var removed = [];
      var items = document.getElementById('card-list').getElementsByTagName('li');
      
      for (let item of items) {
          var name = item.getElementsByTagName('a')[0].getElementsByTagName('div')[0].getElementsByTagName('h2')[0].textContent;
          if (!name.includes('Trondheim')) {
            removed.push(item)
          }
      }

      if (removed.length <= items.length){
        for (let item of removed) {
            item.remove();
        }
      }
    }
    else {

      var removed = [];
      var items = document.getElementById('card-list').getElementsByTagName('li');
      
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
    }
  }
}

function filterProducts() {
  var items = document.getElementById('card-list').getElementsByTagName('li');
  var navigation = document.getElementById('filter');
  var categories = [];
  for (let i = 0; i < items.length; i++) {
    categories.indexOf(items[i].className) === -1 ? categories.push(items[i].className) : '';
  }
  categories.sort();
  console.log(categories);
  var linkAll = document.createElement('a');
  linkAll.className = 'button';
  linkAll.href = '/utvalg.html';
  linkAll.textContent = 'Alle viner';
  navigation.appendChild(linkAll);
  var linkTrondheim = document.createElement('a');
  linkTrondheim.className = 'button';
  linkTrondheim.href = '?kategori=Trondheimsserien';
  linkTrondheim.textContent = 'Trondheimsserien';
  navigation.appendChild(linkTrondheim);
  if (linkTrondheim.textContent == getQuery()) {
      linkTrondheim.className += ' selected';
  }
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