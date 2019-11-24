'use stric'

/**
  * @ngdoc component
  * @name quotesModule.component:quoteView
  * @description
  * This component displays the information about a single quote
  * 
  * @param {Object=} quote the quote to be displayed
  * 
*/
angular.module('quotesModule').component('quoteView',{
    templateUrl:'./src/components/quote-view/quote-view.html',
    controller:['QuotesService','$scope',quotesViewController],
    bindings:{
        quote:'='
    }
})


/**
  * @this vm
  * @ngdoc controller
  * @name quotesModule.controller:quotesViewController
  *
  * @description
  * quoteView component controller
*/
function quotesViewController(QuotesService,$scope){
  /**
    * @ngdoc property
    * @name quotesViewController.ctrl
    *
    * @propertyOf
    * quotesModule.controller:quotesViewController
    *
    * @description
    * 
    * Reference to the controler's 'this' and component scope
  */
  var ctrl = this;


  /**
    * @ngdoc property
    * @name quotesViewController.quote
    *
    * @propertyOf
    * quotesModule.controller:quote
    *
    * @description
    * 
    * The quote to be displayed. It is received as a param by the component
  */
  this.quote;

  this.getSymboUrl = function(){
      return `https://cdn.toroinvestimentos.com.br/corretora/images/quote/${quote.symbol}.svg`
  }

}