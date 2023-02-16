const queryString = window.location.search;
//console.log(queryString);
const urlParams = new URLSearchParams(queryString);

const typeParam = urlParams.get('type')
//console.log(typeParam);

const countryParam = urlParams.get('country')
//console.log(countryParam);


function listContent() {
	var productList = [];
	var products = document.getElementsByClassName('product');

	var typeArray = [];
	var countryArray = [];
	var visibleTypeArray = [];
	var visibleCountryArray = [];

	typeArray.push('Alle viner');
	countryArray.push('Alle land');

	for (i = 0; i < products.length; i++) {

		var type = products[i].dataset.type;
		var country = products[i].dataset.country;

		typeArray.indexOf(type) === -1 ? typeArray.push(type) : null;
		countryArray.indexOf(country) === -1 ? countryArray.push(country) : null;

		if (!products[i].classList.contains('hidden')) {
			visibleTypeArray.indexOf(type) === -1 ? visibleTypeArray.push(type) : null;
			visibleCountryArray.indexOf(country) === -1 ? visibleCountryArray.push(country) : null;
		}
	}

	result = {
		types: typeArray,
		countries: countryArray,
		visibleTypes: visibleTypeArray,
		visibleCountries: visibleCountryArray
	}

	return result;
}

function hideContent(type) {
	var products = document.getElementsByClassName('product');
    for (i = 0; i < products.length; i++) {
        products[i].classList.add('hidden'); 
    }
    var selector = '[data-type="' + type + '"]';
    var selected = document.querySelectorAll(selector);
    for (i = 0; i < selected.length; i++) {
        selected[i].classList.remove('hidden'); 
    }
}

function createSelect(data, id) {

	var container = document.getElementById('content');

	//Create and append select list
	var selectList = document.createElement('select');
	selectList.addEventListener('input', eventFunc);
	selectList.id = id;
	container.prepend(selectList);

	//Create and append the options
	for (var i = 0; i < data.length; i++) {
	    var option = document.createElement('option');
	    if (i == 0) {
		    option.value = '';
		    if (!typeParam) {
		    	option.selected = true;
		    }
		} else {
	    	option.value = data[i];
		    if (data[i] == typeParam) {
		    	option.selected = true;
		    }
	    }
	    option.text = data[i];
	    selectList.appendChild(option);
	}
}

function eventFunc() {
	var type = document.getElementById("types").value;
	var searchParams = new URLSearchParams(window.location.search);
	if (type == '') {
    	searchParams.delete("type");
    	window.location.search = searchParams.toString();
    } else {
    	searchParams.set("type", type);
    	window.location.search = searchParams.toString();
    }
}

if (typeParam) {hideContent(typeParam);}
createSelect(listContent().types, 'types');
