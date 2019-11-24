'use stric'


/**
  * @ngdoc component
  * @name quotesModule.component:quoteView
  * @description
  * This component displays the information about a single quote
  * 
  * @param {Object=} quote the quote to be displayed
  * @param {string=} graphColor the color to be used in the graph (as a hex string)
  * 
*/
angular.module('quotesModule').component('quoteView',{
    templateUrl:'./src/components/quote-view/quote-view.html',
    controller:['$filter','$interval','$mdMedia',quotesViewController],
    bindings:{
        quote:'=',
        graphColor:'='
    }
})

//Holds the promise of $interval, so it can be cancelled
var intervalPromise;


/**
  * @this vm
  * @ngdoc controller
  * @name quotesModule.controller:quotesViewController
  *
  * @description
  * quoteView component controller
  * 
  * @param $filter Angular filter injection service
  * @param $interval Angular service for registering intervas
  * @param $mdMedia Angularjs Material service for querying media size
*/
function quotesViewController($filter,$interval,$mdMedia){
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
    * @name quotesViewController.chartDataset
    *
    * @propertyOf
    * quotesModule.controller:quotesViewController
    *
    * @description
    * 
    * Dataset to be passed to the chart  canvas so the data can be displayed.
    * It contains the following properties:
    * 
    * * data: The quote history values, to be plotted
    * * labels: The quotes timezone (not displayed)
    * * colors: The color of the graph
    * * options: Chart.js options
  */
  this.chartDataset = undefined;



  /**
    * @ngdoc method
    * @name quotesViewController.setupChartDataset
    *
    * @methodOf
    * quotesModule.controller:quotesViewController
    *
    * @description
    * 
    * Setups the charDataset
  */
  this.setupChartDataset = function(){
    if((!this.quote)||(!this.quote.history)||(this.quote.history.length == 0)) return;

    ctrl.chartDataset = {
        data:this.quote.history.map((quoteItem)=>quoteItem.value),
        labels:this.quote.history.map((quoteItem)=>moment(quoteItem.dateTime).format('HH:mm:ss')),
        colors:[ctrl.graphColor],
        options:{
            //Does not animate, because the data changes with highe frequency
            animation: false,
            scaleShowLabels : false,
            scales: {
                xAxes: [{
                    ticks: {
                        //Hide the labels, because the timestamps are very close
                        display: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        display:!$mdMedia('xs'),
                        //Format as currency
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



   /**
    * @ngdoc method
    * @name quotesViewController.getSymboUrl
    *
    * @methodOf
    * quotesModule.controller:quotesViewController
    *
    * @description
    * 
    * Returns the URL to download the symbol, from toroinvestimentos website
  */
  this.getSymboUrl = function(){
      if(!this.quote || !this.quote.symbol) return '';
      return `https://cdn.toroinvestimentos.com.br/corretora/images/quote/${this.quote.symbol}.svg`;
  }



  /**
    * @ngdoc method
    * @name quotesViewController.$onInit
    *
    * @methodOf
    * quotesModule.controller:quotesViewController
    *
    * @description
    * 
    * Component initialization. Sets up the dataset and start a task
    * for updating the chart every 100ms.
  */
  this.$onInit = function(){
      this.setupChartDataset();

      //Updates the graph
      intervalPromise = $interval(()=>{
        this.setupChartDataset();
      },100)
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
  this.$onDestroy = function(){
    $interval.cancel(intervalPromise);
  }

}