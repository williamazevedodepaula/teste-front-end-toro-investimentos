

/**
  * @ngdoc service
  * @name quotesModule.QuotesService
  * 
  * @description
  * This service connects to quotesmock service, by WebSocket, in order to receive new quotes.
  * 
  * 
  * @example
  * example...
**/
angular.module('quotesModule').factory('QuotesService',[function(){

    //@TODO: alterar para buscar do docker-compose
    let url = `ws://localhost:8080/quotes`;

    let receiveCallback;
    let errorCallback;
    let connected = false;

    return {                
        connection:undefined,
        url : `ws://localhost:8080/quotes`,

        /**
         * @ngdoc method
         * @name quotesModule.QuotesService#initConnection
         * @methodOf quotesModule.QuotesService
         *
         * @description
         *
         * Connects to the quotes Service                  
         *
         * @returns {Object} A Promise that will resolve if the connection is performed successfully, or reject, if it fails.
         */
        initConnection:function(){    
            connected = false;
            this.connection = undefined;         
            return new Promise((resolve,reject)=>{     
                this.connection = new WebSocket(this.url);
                
                this.connection.onopen = function (data) {
                    connected = true;
                    resolve(data);
                };
                this.connection.onerror = function(e){
                    reject({message:'Impossible to connect',error:e});
                }
                this.connection.onclose = function(event){
                    connected = false;
                }    
            })
        },

        /**
         * @ngdoc method
         * @name quotesModule.QuotesService#getConnection
         * @methodOf quotesModule.getConnection
         *
         * @description
         *
         * Gets the connection instance
         *
         * @returns {Object} The WebSocket connection instance
         */
        getConnection(){
            return this.connection;
        },

        /**
         * @ngdoc method
         * @name quotesModule.QuotesService#isConnected
         * @methodOf quotesModule.isConnected
         *
         * @description
         *
         * Check if its is currently connected to a socket
         *
         * @returns {boolean} true, if it is connected. False, otherwise
         */
        isConnected(){
            return connected;
        },

        /**
         * @ngdoc method
         * @name quotesModule.QuotesService#closeConnection
         * @methodOf quotesModule.closeConnection
         *
         * @description
         *
         * Closes the connection with the server
         */
        closeConnection:function(){
            this.getConnection().close();
        },


        /**
         * @ngdoc method
         * @name quotesModule.QuotesService#onQuoteReceived
         * @methodOf quotesModule.onQuoteReceived
         *
         * @description
         *
         * Registers a callback that will be called when a new quote is received
         * 
         * @param {function(Object)=} callback the callback that will be called. The param in the callback have
         * the following properties:
         * 
         * * name: quote name
         * * value: quote value
         * * timestamp: quote timestamp
         */
        onQuoteReceived(callback){
            this.getConnection().onmessage = function(event){
                let data = event.data;
                let _result = JSON.parse(data);
                let name = Object.keys(_result)[0];
                let result = {
                    name:name,
                    value:_result[name],
                    timestamp:_result.timestamp,
                    symbol:name.slice(0,name.length -1)
                }

                callback(result);
            }
        },

         /**
         * @ngdoc method
         * @name quotesModule.QuotesService#onError
         * @methodOf quotesModule.onError
         *
         * @description
         *
         * Registers a callback that will be called when an erro occurs
         * 
         * @param {function(Object)=} callback the callback that will be called. The param in the callback is the error
         */
        onError(callback){
            this.getConnection().onerror = function(error){
                callback(error);
            }
        }
    }
}])