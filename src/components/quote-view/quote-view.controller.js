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
    controller:['$filter','$interval',quotesViewController],
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
function quotesViewController($filter,$interval){
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
    if((!this.quote)||(!this.quote.history)||(this.quote.history.length == 0)) return;

    ctrl.chartDataset = {
        data:this.quote.history.map((quoteItem)=>quoteItem.value),
        labels:this.quote.history.map((quoteItem)=>moment(quoteItem.dateTime).format('HH:mm:ss')),
        colors:[ctrl.graphColor],
        options:{
            animation: animate||false,
            scaleShowLabels : false,
            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function(label, index, labels) {
                            return $filter('currency')(Number(label),'R$')
                        }
                    }
                }]
            }
        }
    }    
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