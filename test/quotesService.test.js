'use strict';


describe('CT0002 - Tests about QuotesService: ',function(){

    var QuotesService;

    beforeEach('Load the module',function(){
       angular.mock.module("quotesModule");
       angular.mock.inject(function(_QuotesService_){
        QuotesService = _QuotesService_;
       })
    })
    
    it('Sould resolve a promise that resolves when connects successfully',async function(){
        expect(QuotesService).to.have.property('initConnection');
        try{
            await QuotesService.initConnection()
        }catch(e){            
            throw new Error("Connection with Server did not happened");
        }        
    })

    it('Sould resolve a promise that rejects when did not connect successfully',async function(){
        expect(QuotesService).to.have.property('initConnection');
        try{
            await QuotesService.initConnection()
            throw new Error("The promise should not resolve");
        }catch(e){
            expect(e.message).to.equal("Impossible to connect")
        }
    })

    it('Should connect to server',function(){
        throw new Error("Not yet implemented")
    });
});