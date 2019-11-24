'use stric'

/**
  * @ngdoc component
  * @name quotesModule.component:quotesPage
  * @description
  * Componente referente à tela de listagem de cotações
  * 
*/
angular.module('quotesModule').component('quotesPage',{
    templateUrl:'./src/components/pages/quotes/quotes-page.html',
    controller:['QuotesService',quotesPageController],
    bindings:{
        
    }
})


/**
  * @this vm
  * @ngdoc controller
  * @name quotesModule.controller:quotesPageController
  *
  * @description
  * Controlador do componente quotesPage
*/
function quotesPageController(QuotesService){
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
    * @name quotesPageController.isConnected
    *
    * @propertyOf
    * quotesModule.controller:quotesPageController
    *
    * @description
    * 
    * Tells if the screen is already connected to the server (true if connected, false otherwise)
  */
  this.isConnected = false;



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
  this.quotesToShow = 5;



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
  this.onQuoteReceived = function(newQuote){
    let found = ctrl.quotesList.find((quote)=>{
      return quote.name == newQuote.name;
    });

    if(!found){
      found = {   
        name:newQuote.name,     
        history: []
      }
      ctrl.quotesList.push(found);
    }

    found.currentValue = newQuote.value;
    found.history.push(newQuote);

    if(found.history.length > 100){
      found.history = found.history.slice(1,found.history.length);
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
  this.getBetterEvaluatedQuotes = function(){
    return this.quotesList.sort(function(a,b){return b.currentValue - a.currentValue}).slice(0,this.quotesToShow);
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
  this.getWorstEvaluatedQuotes = function(){
    let length = this.quotesList.length;
    return this.quotesList.sort(function(a,b){return b.currentValue - a.currentValue}).slice(length-this.quotesToShow,length);
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
  this.$onInit = async function(){
    tryConnect();

    async function tryConnect(){
      if(!QuotesService.isConnected()){
        try{
          await QuotesService.initConnection();          
          ctrl.isConnected = true;
        }catch(e){
          setTimeout(tryConnect,500);
          return;
        }
        QuotesService.onQuoteReceived(ctrl.onQuoteReceived);
      }
    }
  }
}