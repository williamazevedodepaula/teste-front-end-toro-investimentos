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
    controller:['QuotesService','$interval',quotesViewController],
    bindings:{
        quote:'=',
        graphColor:'='
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
function quotesViewController(QuotesService,$interval){
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

  this.chartDataset = undefined;

  this.setupChartDataset = function(animate){
    if((!this.quote)||(!this.quote.history)) return;

    let dataset = {
        data:this.quote.history.map((quoteItem)=>quoteItem.value),
        labels:this.quote.history.map((quoteItem)=>moment(quoteItem.dateTime).format('HH:MM:SS')),
        colors:[ctrl.graphColor],
        options:{
            animation: animate||false
        }
    }    
    ctrl.chartDataset = dataset;
  }


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
      if(!this.quote || !this.quote.symbol) return '';
      return `https://cdn.toroinvestimentos.com.br/corretora/images/quote/${this.quote.symbol}.svg`;
  }
  this.$onInit = function(){
      this.setupChartDataset(true);

      $interval(()=>{
        this.setupChartDataset();
      },500)
  }  

}