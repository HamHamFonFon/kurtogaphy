import dataLayers from './public/src/dataLayers';
dataLayers.listCollections();

/**
 * Search request with result in autocompletion
 * @returns {string}
 */
var searchInput = document.querySelector('#kuzzleSearch');
import Awesomplete from 'awesomplete';
var awesomplete = new Awesomplete(searchInput, {
    maxItems: 10
});
searchInput.addEventListener('keyup', function(e) {
    // TODO : reset the list
    dataLayers.searchDocuments(e.target.value);
    awesomplete.list = dataLayers.state.rstAdvancedSearch
}, false);


//$(function(){
//    $('form[name="formSearch"]').on('submit', function (e) {
//        e.preventDefault();
//    });
//    $('input[name="search"]').autocomplete({
//        source: function(request, response) {
//            dataLayers.searchDocuments(request.term);
//            if (dataLayers.state.rstAdvancedSearch) {
//                response(dataLayers.state.rstAdvancedSearch);
//            }
//        },
//        minLength: 2,
//        open: function(event, ui) {
//            $(".ui-autocomplete").css("z-index", 10000);
//        },
//        select: function(event, ui)
//        {
//            dataLayers.setCenterKuzzleDoc(ui.item.id);
//        }
//    });
//});

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.valueOf = function(){
    console.log(JSON.stringify(this, null, '\t'));
};