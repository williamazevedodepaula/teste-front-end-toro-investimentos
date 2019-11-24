
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
  this.quoteList = [];


  this.onQuoteReceived = function(newQuote){
    let found = this.quoteList.find((quote)=>{
      return quote.name == newQuote.name;
    });

    if(!foud){
      found = {   
        name:newQuote.name,     
        history: []
      }
      this.quoteList.push(found);
    }

    found.currentValue = newQuote.currentValue;

    found.history.push(newQuote);
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