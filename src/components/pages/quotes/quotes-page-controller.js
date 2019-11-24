
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


  this.onQuoteReceived = function(quote){
    console.log(quote);

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