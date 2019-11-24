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
  var ctrl = this;
  this.isConnected = false;
  this.quotesList = [];


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

  
  this.$onInit = async function(){
    tryConnect();

    async function tryConnect(){
      if(!QuotesService.isConnected()){
        try{
          await QuotesService.initConnection();
          QuotesService.onQuoteReceived(ctrl.onQuoteReceived);
          ctrl.isConnected = true;
        }catch(e){
          setTimeout(tryConnect,500);
        }
      }
    }
  }
}