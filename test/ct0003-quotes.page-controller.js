'use strict';


describe('CT0003 - Tests about QuotesPageController: ', function () {

    var $componentController;
    var QuotesService;
    var spies = [];

    beforeEach('Load the module', function () {
        angular.mock.module("quotesModule");
        angular.mock.inject(function (_$componentController_, _QuotesService_) {
            $componentController = _$componentController_;
            QuotesService = _QuotesService_;
        })
    })

    afterEach('Restore all spies',function(){
        spies.forEach((spy)=>{spy.restore});
    })


    it('Should connect on init', async function () {
        spies = [sinon.spy(QuotesService,"initConnection")];

        let quotesPage = $componentController('quotesPage');
        
        quotesPage.$onInit();

        assert(QuotesService.initConnection.calledOnce);
    })

    it('Should retry connection every 500 ms', function (done) {
        let stubs = [
            sinon.stub(QuotesService,"initConnection").rejects({})            
        ];

        let quotesPage = $componentController('quotesPage');                
        
        quotesPage.$onInit();

        setTimeout(()=>{
            QuotesService.initConnection.calledThrice.should.equal(true)
            done();
        },1500)        
    })

    it('Should stop trying after connect', async function () {
        let stubs = [
            sinon.stub(QuotesService,"initConnection").rejects({})
        ];

        let quotesPage = $componentController('quotesPage');
        quotesPage.should.have.property('isConnected').that.equals(false);
        
        quotesPage.$onInit();

        QuotesService.initConnection.calledOnce.should.equal(true);

        await MyTimeout(()=>{
            QuotesService.initConnection.calledTwice.should.equal(true,'Após 500 ms deveria ter tentado uma segunda vez');
        },600);

        quotesPage.should.have.property('isConnected').that.equals(false);
        QuotesService.initConnection.restore();
        stubs[0] = sinon.stub(QuotesService,"initConnection").resolves();

        await MyTimeout(()=>{
            quotesPage.should.have.property('isConnected').that.equals(true);
            QuotesService.initConnection.calledOnce.should.equal(true,'500 ms depois, deveria ter havido mais uma conexao, desta vez bem sucedida');
            QuotesService.initConnection.resetHistory();
        },600);

        await MyTimeout(()=>{
            QuotesService.initConnection.notCalled.should.equal(true,'Após 500 ms NÃO deveria ter mais uma vez, pois já está conectado');
        },600);
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

    it('Should keep track of the quoteList, keeping history', async function () {
        let quotesPage = $componentController('quotesPage');
        let newArrivingQuote;
        let stubs = [
            sinon.stub(QuotesService,"initConnection").resolves()
        ];
        
        quotesPage.should.have.property("quoteList").that.is.an("array").with.length(0,'The quotes list starts empty');
        quotesPage.$onInit();

        //A new quote arrived. Creates a antry for it in the quoteList and add it to the history
        newArrivingQuote = quotesMockExample[0];
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.should.have.property("quoteList").that.is.an("array").with.length(1,`A new item must have been created in the list for the received quote`);
        quotesPage.quotesList[0].should.have.property("name").that.equals(newArrivingQuote.name);
        quotesPage.quotesList[0].should.have.property("currentValue").that.equals(newArrivingQuote.value);
        quotesPage.quotesList[0].should.have.property("history").that.is.an("array").with.length(1,'the item must be in the history of the quote');
        quotesPage.quotesList[0].history[0].should.have.property('value').that.equals(newArrivingQuote.value);
        quotesPage.quotesList[0].history[0].should.have.property('timestamp').that.equals(newArrivingQuote.timestamp);

        //A new quote arrived. Creates a antry for it in the quoteList and add it to the history
        newArrivingQuote = quotesMockExample[1];
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.should.have.property("quoteList").that.is.an("array").with.length(2,`A new item must have been created in the list for the received quote (2)`);
        quotesPage.quotesList[1].should.have.property("name").that.equals(newArrivingQuote.name);
        quotesPage.quotesList[1].should.have.property("currentValue").that.equals(newArrivingQuote.value);
        quotesPage.quotesList[1].should.have.property("history").that.is.an("array").with.length(1,'the item must be in the history of the quote (2)');
        quotesPage.quotesList[1].history[0].should.have.property('value').that.equals(newArrivingQuote.value);
        quotesPage.quotesList[1].history[0].should.have.property('timestamp').that.equals(newArrivingQuote.timestamp);

        newArrivingQuote = angular.copy(quotesMockExample[0]);
        newArrivingQuote.value += 0.8;

        //A new quote arrived, but it is already registered. Add it to the referred quote history
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.should.have.property("quoteList").that.is.an("array").with.length(2,`The received item already exists on the list, should not create another entry`);
        quotesPage.quotesList[0].should.have.property("history").that.is.an("array").with.length(2,'The new item mus be added to the history of the existing one');
        quotesPage.quotesList[0].should.have.property("currentValue").that.equals(newArrivingQuote.value,`The new quote received becomes the new currentValue`);

        //A new quote arrived, but it is already registered. Add it to the referred quote history
        newArrivingQuote.value += 0.6;
        quotesPage.onQuoteReceived(newArrivingQuote);
        quotesPage.should.have.property("quoteList").that.is.an("array").with.length(2,`The received item already exists on the list, should not create another entry`);
        quotesPage.quotesList[0].should.have.property("history").that.is.an("array").with.length(3,'The new item mus be added to the history of the existing one (2)');
        quotesPage.quotesList[0].should.have.property("currentValue").that.equals(newArrivingQuote.value,`The new quote received becomes the new currentValue (2)`);

        //A new quote arrived, but it is already registered. Add it to the referred quote history
        newArrivingQuote = angular.copy(quotesMockExample[1]);
        newArrivingQuote.value += 0.9;
        quotesPage.quotesList[1].should.have.property("history").that.is.an("array").with.length(2,'The new item mus be added to the history of the existing one (3)');
        quotesPage.quotesList[1].should.have.property("currentValue").that.equals(newArrivingQuote.value,`The new quote received becomes the new currentValue (3)`);
    });


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