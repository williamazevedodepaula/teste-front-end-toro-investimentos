

/**
  * @ngdoc overview
  * @name quotesModule.module:quotesModule
  *
  * @description
  * Módulo responsável pela exibição das quotações de ações
  * 
  * @example
  *  <b>script.js</b>
  *  <pre>
  *  angular.module('quotesModule', []);
  *  </pre>
  * 
*/
let quotesApp = angular.module("quotesModule",['ui.router','ngMaterial']);


quotesApp.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
      url: '/',
      views:{
          content:{
              template:'<quotes-page></quotes-page>'
          }
      }
    });
}]);
