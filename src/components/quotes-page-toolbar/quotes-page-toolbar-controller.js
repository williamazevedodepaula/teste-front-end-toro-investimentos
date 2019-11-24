'use stric'

/**
  * @ngdoc component
  * @name quotesModule.component:quotesPageToolbar
  * @description
  * This component displays the quotes page toolbar
  * 
  * @param {Object=} quotesToShow the amount of quotes to be displayed in the quotes page.
  * 
*/
angular.module('quotesModule').component('quotesPageToolbar',{
    templateUrl:'./src/components/quotes-page-toolbar/quotes-page-toolbar.html',
    controller:['$filter','$interval',quotesPageToolbarController],
    bindings:{
        quotesToShow:'='
    }
})


/**
  * @this vm
  * @ngdoc controller
  * @name quotesModule.controller:quotesPageToolbarController
  *
  * @description
  * quotesPageToolbar component controller
*/
function quotesPageToolbarController(){
  /**
    * @ngdoc property
    * @name quotesPageToolbarController.ctrl
    *
    * @propertyOf
    * quotesModule.controller:quotesPageToolbarController
    *
    * @description
    * 
    * Reference to the controler's 'this' and component scope
  */
  var ctrl = this;


  /**
    * @ngdoc property
    * @name quotesPageToolbarController.quotesToShow
    *
    * @propertyOf
    * quotesModule.controller:quotesPageToolbarController
    *
    * @description
    * 
    * the amount of quotes to be displayed in the quotes page.It is bound to a component parameter
  */
  this.quotesToShow;

}