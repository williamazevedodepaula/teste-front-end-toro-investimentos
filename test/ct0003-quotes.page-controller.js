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
        },500)
    });


    async function MyTimeout(callback,time){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                callback();
                resolve();
            },time); 
        })
    }

});