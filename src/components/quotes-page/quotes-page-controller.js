'use stric'

/**
  * @ngdoc component
  * @name quotesModule.component:quotesPage
  * @description
  * 
  * This component presents the application main screen, where
  * the quotes are displayed
  * 
  * @param QuotesService the quote listation service
  * @param $interval Angular service for registering intervas
*/
angular.module('quotesModule').component('quotesPage', {
  templateUrl: './src/components/quotes-page/quotes-page.html',
  controller: ['QuotesService', '$interval', quotesPageController],
  bindings: {

  }
});

//Holds the promise of $interval, so it can be cancelled
var intervalPromise;


/**
  * @this vm
  * @ngdoc controller
  * @name quotesModule.controller:quotesPageController
  *
  * @description
  * The controller quotesPage component
*/
function quotesPageController(QuotesService, $interval) {
  /**
    * @ngdoc property
    * @name quotesPageController.ctrl
    *
    * @propertyOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * 
    * Reference to the controler's this and component scope
  */
  var ctrl = this;



  /**
    * @ngdoc property
    * @name quotesPageController.quotesList
    *
    * @propertyOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * 
    * The list of quotes received. Each item has the following properties:
    * 
    * * name: the quote name. Ex: 'GGBR4'
    * * currentValue: the quote current value
    * * history: list of quotes of the same type received from the server, ordere from the oldest to the newes
  */
  this.quotesList = [];



  /**
    * @ngdoc property
    * @name quotesPageController.quotesToShow
    *
    * @propertyOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * 
    * The number of quotes to be listed in getBetterEvaluatedQuotes and
    * getWorstEvaluatedQuotes methods.
    * 
    * @see quotesPageController.getBetterEvaluatedQuotes
    * @see quotesPageController.getWorstEvaluatedQuotes
  */
  this.quotesToShow = 6;



  /**
    * @ngdoc method
    * @name quotesPageController#onQuoteReceived
    *
    * @methodOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * Callback fired when a new Quote is received.
    * First it is verified if there is a register in quotesList for this 
    * new quote. If not, it is registered. If yes, it is loaderd.
    * 
    * Then, the new quote is added to the history for this quote name.
    * 
    * OBS: Only N  itens are manteined in the history, where N is defined by
    * the quotesToShow property
    * @see quotesPageController.quotesToShow
    * 
    * @param {Object} newQuote the received new quote
  */
  this.onQuoteReceived = function (newQuote) {
    let found = ctrl.quotesList.find((quote) => {
      return quote.name == newQuote.name;
    });

    if (!found) {
      found = {
        name: newQuote.name,
        symbol: newQuote.symbol,
        history: []
      }
      ctrl.quotesList.push(found);
    }

    found.currentValue = newQuote.value;
    found.history.push(newQuote);

    if (found.history.length > 50) {
      found.history = found.history.slice(1, found.history.length);
    }
  }



  /**
    * @ngdoc method
    * @name quotesPageController#getBetterEvaluatedQuotes
    *
    * @methodOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * Returns the top N quotes with better current value,
    * from the higher value to the lower.
    * 
    * N is defined by the quotesToShow property.
    * 
    * @see quotesPageController.quotesToShow
    * @returns {Array.Object} a subset of quotesList, presententing the top N better quotes
  */
  this.getBetterEvaluatedQuotes = function () {
    return ctrl.quotesList.sort(function (a, b) { return b.currentValue - a.currentValue }).slice(0, ctrl.quotesToShow);
  }



  /**
    * @ngdoc method
    * @name quotesPageController#getWorstEvaluatedQuotes
    *
    * @methodOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * Returns the top N quotes with WORST current value,
    * from the higher value to the lower.
    * 
    * N is defined by the quotesToShow property.
    * 
    * @see quotesPageController.quotesToShow
    * @returns {Array.Object} a subset of quotesList, presententing the top N worst value quotes
  */
  this.getWorstEvaluatedQuotes = function () {
    let length = ctrl.quotesList.length;
    return ctrl.quotesList.sort(function (a, b) { return b.currentValue - a.currentValue }).slice(length - ctrl.quotesToShow, length);
  }



  /**
    * @ngdoc method
    * @name quotesPageController#isConnected
    *
    * @methodOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * 
    * Tells if the screen is already connected to the server (true if connected, false otherwise)
    * 
    * @returns {boolean} true, if it is connected. False, otherwise
  */
  this.isConnected = function () {
    return QuotesService.isConnected()
  }



  /**
    * @ngdoc method
    * @name quotesPageController#$onInit
    *
    * @methodOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * Component initialization.
    * 
    * Performs connection with the quotesmock server and subscreibe
    * to receive new quotes.
    * 
    * @see quotesPageController.quotesToShow
  */
  this.$onInit = async function () {
    await tryConnect();
    intervalPromise = $interval(() => {
      tryConnect();
    }, 500);


    async function tryConnect() {
      if (!ctrl.isConnected()) {
        try {
          await QuotesService.initConnection();
          QuotesService.onQuoteReceived(ctrl.onQuoteReceived);
        } catch (e) { }
      }
    }
  }

  

  /**
    * @ngdoc method
    * @name quotesViewController.$onDestroy
    *
    * @methodOf
    * quotesModule.controller:quotesViewController
    *
    * @description
    * 
    * Component Deinitialization. cancel the interval promise
  */
  this.$onDestroy = function () {
    $interval.cancel(intervalPromise);
  }
}