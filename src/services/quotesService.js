angular.module('quotesModule').factory('QuotesService',[function(){

    //@TODO: alterar para buscar do docker-compose
    let url = `ws://localhost:8080/quotes`;    
    let webSocket = new WebSocket(url);

    return {
        webSocket:webSocket,

        initConnection:function(){            
            throw new Error("Not Yet Implemented");
        },

        onMessageReceived(callback){
            throw new Error("Not Yet Implemented");
        },

        onError(callback){
            throw new Error("Not Yet Implemented");
        }
    }
}])