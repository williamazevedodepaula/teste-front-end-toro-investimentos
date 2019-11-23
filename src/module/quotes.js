

/**
  * @ngdoc overview
  * @name quotes.module:quotes
  *
  * @description
  * Módulo responsável pela exibição das quotações de ações
  * 
  * @example
  *  <b>script.js</b>
  *  <pre>
  *  angular.module('quotes', [quotes]);
  *  </pre>
  * 
*/
let quotesApp = angular.module("quotes",['ui.router']);


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
