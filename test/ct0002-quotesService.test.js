'use strict';


describe('CT0002 - Tests about QuotesService: ',function(){

    var QuotesService;

    beforeEach('Load the module',function(){
       angular.mock.module("quotesModule");
       angular.mock.inject(function(_QuotesService_){
        QuotesService = _QuotesService_;
       })
    })
    
    
    it('Should return a promise that resolves when connects successfully',async function(){
        let connected;

        try{
            connected = QuotesService.isConnected();
            expect(connected).to.equal(false);

            await QuotesService.initConnection();

            connected = QuotesService.isConnected();
            expect(connected).to.equal(true);
        }finally{
            QuotesService.closeConnection();
        }
    })

    it('Should return a promise that rejects when did not connect successfully',async function(){        
        let connected;
        let originalUrl = QuotesService.url;
        QuotesService.url = `${QuotesService.url}-notexisting`;
        
        connected = QuotesService.isConnected();
        expect(connected).to.equal(false);

        try{
            await QuotesService.initConnection();
            throw new Error("The promise should not resolve");
        }catch(e){
            expect(e.message).to.equal("Impossible to connect");
            
            connected = QuotesService.isConnected();
            expect(connected).to.equal(false);
        }finally{
            QuotesService.url = originalUrl;
            QuotesService.closeConnection();
        }
    })

    it('Should convert data received from server to an object',function(done){        
        try{
            let fakeSocket = {};
            let stubs = [
                sinon.stub(QuotesService,"initConnection").resolves(),
                sinon.stub(QuotesService,"getConnection").returns(fakeSocket)
            ];

            let count = 0;
            QuotesService.onQuoteReceived(function(quote){
                expect(quote).to.be.an('object');
                expect(quote).to.have.property("name").that.equals('ABEV3');
                expect(quote).to.have.property("value").that.equals(208.84);
                expect(quote).to.have.property("timestamp").that.equals(1574534260.107485);
                count++;

                if(count == 3) done();
            });

            fakeSocket.onmessage({data:'{"ABEV3": 208.84, "timestamp": 1574534260.107485}'});
            fakeSocket.onmessage({data:'{"ABEV3": 208.84, "timestamp": 1574534260.107485}'});
            fakeSocket.onmessage({data:'{"ABEV3": 208.84, "timestamp": 1574534260.107485}'});
        }finally{
            stubs.forEach((stub)=>{stub.restore()})
        }
    });

    it('Should receive at least 10 objects from true connection with server',async function(){        
        await QuotesService.initConnection();

        let count = 0;
        await new Promise((resolve,reject)=>{
            QuotesService.onQuoteReceived(function(quote){
                expect(quote).to.be.an('object');
                expect(quote).to.have.property("name").that.is.a("string");
                expect(quote).to.have.property("value").that.is.a('number');
                expect(quote).to.have.property("timestamp").that.is.a('number');
                
                count++;
                if(count == 10) resolve();
            });
        });
    });    
});