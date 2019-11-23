'use strict';
describe('CT0001 - Tests about connectio with quotesmock service',function(){

    //@TODO: alterar para buscar do docker-compose
    let url = `ws://localhost:8080/quotes`;

    it('CT0001.1 - Should connect to Toro quotesmock service',function(done){    
        var connection = new WebSocket(url);
    
        connection.onopen = function (data) {
            done();
        };
        connection.onerror = function(){
            throw Error('Connection error');
        }
    });

    
    it('CT0001.2 - Should receive data from Toro quotesmock',function(done){    
        var connection = new WebSocket(url);
        
        connection.onmessage = function (e) {            
            expect(e.data).to.exist;
            let result = JSON.parse(e.data);
            expect(result).to.be.an('object').that.have.property("timestamp");
            let keys = Object.keys(result);
            expect(keys).to.have.length(2);
            expect(result[keys[0]]).to.be.a("number");
            expect(result[keys[1]]).to.be.a("number");
            done();
        };       
        connection.onerror = function(){
            throw Error('Connection error');
        }

    });
})

//{"ABEV3": 208.84, "timestamp": 1574534260.107485}
