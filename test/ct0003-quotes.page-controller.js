'use strict';


describe('CT0003 - Tests about QuotesPageController: ', function () {

    var $componentController;
    var QuotesService;
    var $timeout;
    var $interval;
    var spies = [];
    var stubs = [];

    beforeEach('Load the module', function () {
        angular.mock.module("quotesModule");
        angular.mock.inject(function (_$componentController_, _QuotesService_,_$interval_,_$timeout_) {
            $componentController = _$componentController_;
            QuotesService = _QuotesService_;
            $timeout = _$timeout_;
            $interval = _$interval_;
        })
    })

    afterEach('Restore all spies',function(){
        spies.forEach((spy)=>{spy.restore});
        stubs.forEach((stub)=>{stub.restore});
    })

    it('Should connect on init', async function () {
        spies = [sinon.spy(QuotesService,"initConnection")];

        let quotesPage = $componentController('quotesPage');
        
        quotesPage.$onInit();

        assert(QuotesService.initConnection.calledOnce);
    })

    it('Should retry connection every 500 ms', async function () {
        stubs = [
            sinon.stub(QuotesService,"initConnection").rejects({})            
        ];

        let quotesPage = $componentController('quotesPage');                
        
        await quotesPage.$onInit();
        QuotesService.initConnection.calledOnce.should.equal(true);
        $interval.flush(500);
        QuotesService.initConnection.calledTwice.should.equal(true);
        $interval.flush(500);
        QuotesService.initConnection.calledThrice.should.equal(true);
    })

    it('Should stop trying after connect', async function () {
        //Mocks fail attempt to connect to server
        stubs = [
            sinon.stub(QuotesService,"initConnection").rejects({}),
            sinon.stub(QuotesService,"isConnected").returns(false)
        ];

        let quotesPage = $componentController('quotesPage');
        
        await quotesPage.$onInit();
        QuotesService.initConnection.calledOnce.should.equal(true);

        $interval.flush(500);
        QuotesService.initConnection.calledTwice.should.equal(true,'Após 500 ms deveria ter tentado uma segunda vez');

        QuotesService.initConnection.restore();
        
        //Mocks a stablished connection agains server
        stubs[0] = sinon.stub(QuotesService,"initConnection").callsFake(async()=>{
            QuotesService.isConnected.restore();
            stubs[1] = sinon.stub(QuotesService,"isConnected").returns(true);
        });        
        
        QuotesService.initConnection.notCalled.should.equal(true);

        await $interval.flush(500);
        QuotesService.initConnection.calledOnce.should.equal(true,'500 ms depois, deveria ter havido mais uma conexao, desta vez bem sucedida');
        QuotesService.initConnection.resetHistory();

        $interval.flush(500);
        QuotesService.initConnection.notCalled.should.equal(true,'Após 500 ms NÃO deveria ter mais uma vez, pois já está conectado');
    })

    it('Should receive quotes after init', async function () {
        let quotesPage = $componentController('quotesPage');
        spies = [
            sinon.spy(quotesPage,"onQuoteReceived"),
            sinon.spy(QuotesService,"onQuoteReceived")
        ];

        quotesPage.$onInit();

        await MyTimeout(()=>{
            quotesPage.onQuoteReceived.called.should.equal(true);
        },600)
    })

    it('Should keep track of the quotesList, keeping history', async function () {
        let quotesPage = $componentController('quotesPage');
        let newArrivingQuote;
        stubs = [
            sinon.stub(QuotesService,"initConnection").resolves()
        ];
        
        quotesPage.should.have.property("quotesList").that.is.an("array").with.length(0,'The quotes list starts empty');
        quotesPage.$onInit();

        //A new quote arrived. Creates a antry for it in the quotesList and add it to the history
        newArrivingQuote = quotesMockExample[0];
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.should.have.property("quotesList").that.is.an("array").with.length(1,`A new item must have been created in the list for the received quote`);
        quotesPage.quotesList[0].should.have.property("name").that.equals(newArrivingQuote.name);
        quotesPage.quotesList[0].should.have.property("currentValue").that.equals(newArrivingQuote.value);
        quotesPage.quotesList[0].should.have.property("symbol").that.equals(newArrivingQuote.symbol);
        quotesPage.quotesList[0].should.have.property("history").that.is.an("array").with.length(1,'the item must be in the history of the quote');
        quotesPage.quotesList[0].history[0].should.have.property('value').that.equals(newArrivingQuote.value);
        quotesPage.quotesList[0].history[0].should.have.property('timestamp').that.equals(newArrivingQuote.timestamp);

        //A new quote arrived. Creates a antry for it in the quotesList and add it to the history
        newArrivingQuote = quotesMockExample[1];
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.should.have.property("quotesList").that.is.an("array").with.length(2,`A new item must have been created in the list for the received quote (2)`);
        quotesPage.quotesList[1].should.have.property("name").that.equals(newArrivingQuote.name);
        quotesPage.quotesList[1].should.have.property("currentValue").that.equals(newArrivingQuote.value);
        quotesPage.quotesList[1].should.have.property("symbol").that.equals(newArrivingQuote.symbol);
        quotesPage.quotesList[1].should.have.property("history").that.is.an("array").with.length(1,'the item must be in the history of the quote (2)');
        quotesPage.quotesList[1].history[0].should.have.property('value').that.equals(newArrivingQuote.value);
        quotesPage.quotesList[1].history[0].should.have.property('timestamp').that.equals(newArrivingQuote.timestamp);        

        //A new quote arrived, but it is already registered. Add it to the referred quote history
        newArrivingQuote = angular.copy(quotesMockExample[0]);
        newArrivingQuote.value += 0.8;
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.should.have.property("quotesList").that.is.an("array").with.length(2,`The received item already exists on the list, should not create another entry`);
        quotesPage.quotesList[0].should.have.property("history").that.is.an("array").with.length(2,'The new item mus be added to the history of the existing one');
        quotesPage.quotesList[0].should.have.property("currentValue").that.equals(newArrivingQuote.value,`The new quote received becomes the new currentValue`);

        //A new quote arrived, but it is already registered. Add it to the referred quote history
        newArrivingQuote.value += 0.6;
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.should.have.property("quotesList").that.is.an("array").with.length(2,`The received item already exists on the list, should not create another entry`);
        quotesPage.quotesList[0].should.have.property("history").that.is.an("array").with.length(3,'The new item mus be added to the history of the existing one (2)');
        quotesPage.quotesList[0].should.have.property("currentValue").that.equals(newArrivingQuote.value,`The new quote received becomes the new currentValue (2)`);

        //A new quote arrived, but it is already registered. Add it to the referred quote history
        newArrivingQuote = angular.copy(quotesMockExample[1]);
        newArrivingQuote.value += 0.9;
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.quotesList[1].should.have.property("history").that.is.an("array").with.length(2,'The new item mus be added to the history of the existing one (3)');
        quotesPage.quotesList[1].should.have.property("currentValue").that.equals(newArrivingQuote.value,`The new quote received becomes the new currentValue (3)`);
    });

    it('Should keep only 50 itens in history', async function () {
        let quotesPage = $componentController('quotesPage');
        let newArrivingQuote;
        stubs = [
            sinon.stub(QuotesService,"initConnection").resolves()
        ];

        quotesPage.$onInit();

        for(let i=1; i <= 50; i++){
            newArrivingQuote = quotesMockExample[1];
            quotesPage.onQuoteReceived(newArrivingQuote);
            quotesPage.quotesList[0].should.have.property("history").that.is.an("array").with.length(i,'The 100 first itens must be included in history');
        }

        for(let i=1; i <= 50; i++){
            let lastReceivedItem = angular.copy(quotesPage.quotesList[0].history[0]);
            lastReceivedItem.timestamp ++;

            newArrivingQuote = quotesMockExample[1];
            quotesPage.onQuoteReceived(newArrivingQuote);
            quotesPage.quotesList[0].should.have.property("history").that.is.an("array").with.length(50,'Afeter 100, the last item is always deleted');
            let timestamps = quotesPage.quotesList[0].history.map((item)=>item.timestamp);

            lastReceivedItem.timestamp.should.not.be.oneOf(timestamps,'The older quot shold be deleted');
            quotesPage.quotesList[0].history[49].timestamp.should.be.equal(newArrivingQuote.timestamp,'The newer timestamp shoul be in the bottom of the list');
        }

    })

    it('Should return the better evaluated quotes',async function(){
        let quotesPage = $componentController('quotesPage');
        stubs = [
            sinon.stub(QuotesService,"initConnection").resolves()
        ];

        quotesPage.$onInit();

        quotesMockExample.forEach((mock)=>{
            quotesPage.onQuoteReceived(mock);            
        });

        quotesPage.quotesToShow = 5;
        let betterQuotes = quotesPage.getBetterEvaluatedQuotes();
        expect(betterQuotes).to.exist;
        betterQuotes.should.have.length(5);
                                
        betterQuotes[0].name.should.be.equal('BBDC4');
        betterQuotes[1].name.should.be.equal('CIEL3');
        betterQuotes[2].name.should.be.equal('LREN3');
        betterQuotes[3].name.should.be.equal('UGPA3');
        betterQuotes[4].name.should.be.equal('MRFG3');

        quotesPage.quotesToShow = 3;
        betterQuotes = quotesPage.getBetterEvaluatedQuotes();
        betterQuotes.should.have.length(3);
        betterQuotes[0].name.should.be.equal('BBDC4');
        betterQuotes[1].name.should.be.equal('CIEL3');
        betterQuotes[2].name.should.be.equal('LREN3');
    })

    it('Should return the worst evaluated quotes',async function(){
        let quotesPage = $componentController('quotesPage');
        stubs = [
            sinon.stub(QuotesService,"initConnection").resolves()
        ];

        quotesPage.$onInit();

        quotesMockExample.forEach((mock)=>{
            quotesPage.onQuoteReceived(mock);            
        });

        quotesPage.quotesToShow = 5;
        let worstQuotes = quotesPage.getWorstEvaluatedQuotes();
        expect(worstQuotes).to.exist;
        worstQuotes.should.have.length(5);
                                
        worstQuotes[0].name.should.be.equal('PETR4');
        worstQuotes[1].name.should.be.equal('CSNA3');
        worstQuotes[2].name.should.be.equal('MGLU3');
        worstQuotes[3].name.should.be.equal('RENT3');
        worstQuotes[4].name.should.be.equal('RADL3');

        quotesPage.quotesToShow = 3;
        worstQuotes = quotesPage.getWorstEvaluatedQuotes();
        worstQuotes.should.have.length(3);
        worstQuotes[0].name.should.be.equal('MGLU3');
        worstQuotes[1].name.should.be.equal('RENT3');
        worstQuotes[2].name.should.be.equal('RADL3');
    })


    async function MyTimeout(callback,time){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                callback();
                resolve();
            },time); 
        })
    }


    let quotesMockExample = 
    [{name: 'ELET6',value: 9.93, timestamp: 1574559477.873082},
    {name: 'LREN3', value: 10.42, timestamp: 1574559477.973942},
    {name: 'MGLU3', value: 1.7, timestamp: 1574559478.07487},
    {name: 'PETR4', value: 1.8, timestamp: 1574559478.175844},
    {name: 'RADL3', value: 1.5, timestamp: 1574559478.276824},
    {name: 'CSNA3', value: 1.8, timestamp: 1574559478.47856},
    {name: 'RENT3', value: 1.7, timestamp: 1574559478.579515},
    {name: 'B3SA3', value: 2.7, timestamp: 1574559478.680465},
    {name: 'BBDC4', value: 11.8, timestamp: 1574559478.781374},
    {name: 'PCAR4', value: 8.56, timestamp: 1574559478.882287},
    {name: 'IRBR3', value: 7.12, timestamp: 1574559478.98324},
    {name: 'CVCB3', value: 8.13, timestamp: 1574559479.1851},
    {name: 'BTOW3', value: 8.11, timestamp: 1574559479.386875},
    {name: 'BRFS3', value: 9.01, timestamp: 1574559479.588718},
    {name: 'UGPA3', value: 10.2, timestamp: 1574560771.385209},
    {name: 'ABEV3', value: 9.73, timestamp: 1574560771.485653},
    {name: 'MRFG3', value: 10.15, timestamp: 1574560771.586126},
    {name: 'CIEL3', value: 10.75, timestamp: 1574560771.68662},
    {name: 'GGBR4', value: 8.55, timestamp: 1574560771.787037}]
});