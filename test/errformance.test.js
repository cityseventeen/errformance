/* global Promise, describe, it, __dirname, process*/
const AMBIENTE = process.env.NODE_ENV;

const {expect, assert} = require('chai');
const util = require('util');

const {ErrformanceConfiguration, Errformance} = require(`../`);

const t = {arg_valido_for_errformance: 'prod',
          callback_configurazione: function(){},
          exports: {ErrformanceConfiguration, Errformance},
          condizione_fail: false,
          condizione_passed: true,
          err_mess: 'messaggio di errore',
          support: `./support.test.js`,
          env_that_causes_assert_disabling: 'prod',
          env_that_doesnt_cause_assert_disabling: 'nonprod',
          type_error_default: TypeError};
Object.freeze(t);


describe('errformance con assertFunction già impostata di default', () => {
  testSuiteErrformanceWithAssertFunctionDefault(Errformance);
});
describe('configurazione errformance', () => {
  it('undefined o funzione non restituisce errore', () => {
    expect(()=>{ErrformanceConfiguration(undefined);}).to.not.throw();
    expect(()=>{ErrformanceConfiguration(t.callback_configurazione);}).to.not.throw();
  });
  for(let tipo of [[], ['stringa'], 'stringa', 1, 0, -5, true, false, {}]){
    it(`configurazione non funzione, ovvero con ${util.inspect(tipo)} restituisce errore`, () => {
      expect(()=>{ErrformanceConfiguration(tipo);}).to.throw(/configurazione errata. deve essere una funzione/);
    });
  }
  
  testSuiteErrformanceWithAssertFunctionDefault(ErrformanceConfiguration);


  describe('con logica disattivazione e.assert su callback', () => {
    it.skip('abilita o disabilita assert in base ad altra variabile ambientale personalizzata nella callback', () => {

    });
    it.skip('e.error non viene disabiliato agendo solo su env_assert', () => {
      
    });
  });
  
  describe('logica disattivazione e.error su callback', () => {
    it.skip('disabiliare e.assert non implica disabilitare e.error', () => {

    });
    it.skip('disabilitare e.error implca disabilitare e.assert', () => {
      
    });
    it.skip('disabilitare e.assert ed e.error con stessa callback basata su NODE_ENV', () => {
      
    });
  });

  describe('con assert personalizzato', () => {
    describe('con chai', () => {
      it.skip('assert abilitato con logica callback', () => {

      });
      it.skip('assert disabilitato con logica callback', () => {

      });
    });
  });
  
  describe('', () => {

  });
});

function testSuiteErrformanceWithAssertFunctionDefault(ErrformanceFunction){
  describe('con assert di default del core di nodejs', () => {
    let Errformance;
    if(ErrformanceFunction.name === t.exports.Errformance.name) Errformance = ErrformanceFunction;
    else if(ErrformanceFunction.name === t.exports.ErrformanceConfiguration.name) Errformance = ErrformanceFunction(undefined);
    else throw new Error('argomento test suite errato');

    for(let tipo of [[], ['stringa'], 1, 0, -5, true, false, {}]){
      it(`Errformance restituisce errore con Errformer(${util.inspect(tipo)}`, () => {
        expect(()=>{Errformance(tipo);}).to.throw(/configurazione errata. deve essere stringa o callback/);
      });
    }
    for(let tipo of [[], ['stringa'], {}]){
      it(`Errformance restituisce errore con Errformer(tipo valido, ${util.inspect(tipo)}`, () => {
        expect(()=>{Errformance('tipovalido', tipo);}).to.throw(/configurazione errata. deve essere stringa o callback/);
      });
    }
    const e = Errformance(t.arg_valido_for_errformance);
    it('Errformance presenta i due metodi assert e error', () => {
      expect(e).to.have.property('assert');
      expect(e).to.have.property('error');
      expect(e.assert).to.be.a('function');
      expect(e.error).to.be.a('function');
    });
    it.skip('Errformance presenta SOLO i due metodi assert e error', () => {

    });
    const testSuiteDisabilitazioneAssert = function(tipo_test){
      it('assert ed error non restituiscono errore se la condizione non si verifica', () => {
        changeNODE_ENV(t.env_that_doesnt_cause_assert_disabling);
        const e = require(t.support)[tipo_test];
        expect(()=>{e.assert(t.condizione_passed);}).to.not.throw();
        expect(()=>{e.error(t.condizione_passed);}).to.not.throw();
      });
      it('assert ed error abilitato con logica di default basata su nome ambiente', () => {
        changeNODE_ENV(t.env_that_doesnt_cause_assert_disabling);
        const e = require(t.support)[tipo_test];
        expect(()=>{e.assert(t.condizione_fail, t.err_mess);}).to.throw(t.err_mess);
        expect(()=>{e.error(t.condizione_fail, t.err_mess);}).to.throw(t.type_error_default, t.err_mess);
      });
      it('assert disabilitato con logica di default basata su nome ambiente', () => {
        changeNODE_ENV(t.env_that_causes_assert_disabling);
        const e = require(t.support)[tipo_test];
        expect(()=>{e.assert(t.condizione_fail, t.err_mess);}).to.not.throw();
      });
      
    };
    describe('disabilitazione assert ed error', () => {
      beforeEach(()=>{
        process.env.NODE_ENV = AMBIENTE;
        process.env.DISABLING_ERRFORMER = false;
        forceRequireSupport(t.support);
      });
      afterEach(()=>{
        process.env.NODE_ENV = AMBIENTE;
        process.env.DISABLING_ERRFORMER = false;
      });
      
      describe('disabilitazione solo assert ed error attivo con Errformance(prod)', () => {
        const tipo_test = 'Errformance_default_assert_env_prod_disable_assert';
        testSuiteDisabilitazioneAssert(tipo_test);
        it('error non disabilitato con logica di default basata su nome ambiente', () => {
          changeNODE_ENV(t.env_that_causes_assert_disabling);
          const e = require(t.support)[tipo_test];
          expect(()=>{e.error(t.condizione_fail, t.err_mess);}).to.throw(t.type_error_default, t.err_mess);
        });
      });
      describe('disabilitazione di assert ed error con Errformance(prod, custom)', () => {   
        const tipo_test = 'Errformance_default_assert_env_prod_disable_assert_env_custom_disable_error';
        describe('con disabling_errformance = false, disabilitazione assert segue regole su var ambiente', () => {
          testSuiteDisabilitazioneAssert(tipo_test);
          it('error non disabilitato con logica di default basata su nome ambiente', () => {
            changeNODE_ENV(t.env_that_causes_assert_disabling);
            const e = require(t.support)[tipo_test];
            expect(()=>{e.error(t.condizione_fail, t.err_mess);}).to.throw(t.type_error_default, t.err_mess);
          });
        });
        it('error non disabilitato con logica di default basata su nome ambiente', () => {
          changeNODE_ENV(t.env_that_causes_assert_disabling);
          const e = require(t.support)[tipo_test];
          expect(()=>{e.error(t.condizione_fail, t.err_mess);}).to.throw(t.type_error_default, t.err_mess);
        });
        it('assert ed error disabilitato se disabling_errformance = true e ambiente prod', () => {
          changeNODE_ENV(t.env_that_causes_assert_disabling); changeENV('DISABLING_ERRFORMANCE', true);
          const e = require(t.support)[tipo_test];
          expect(()=>{e.assert(t.condizione_fail, t.err_mess);}).to.not.throw();
          expect(()=>{e.error(t.condizione_fail, t.err_mess);}).to.not.throw();
        });
        it('assert ed error dsabilitato se disabling_errformance = true indipendentemente da ambiente', () => {
          changeNODE_ENV(t.env_that_doesnt_cause_assert_disabling); changeENV('DISABLING_ERRFORMANCE', true);
          const e = require(t.support)[tipo_test];
          expect(()=>{e.assert(t.condizione_fail, t.err_mess);}).to.not.throw();
          expect(()=>{e.error(t.condizione_fail, t.err_mess);}).to.not.throw();
        });
      });
      describe('non disabilitazione di assert ed err con Errformance(undefined)', () => {
        const tipo_test = 'Errformance_default_assert_undefined_var_for_assert_error';
        it('assert ed error non restituiscono errore se la condizione non si verifica', () => {
          changeNODE_ENV(t.env_that_doesnt_cause_assert_disabling);
          const e = require(t.support)[tipo_test];
          expect(()=>{e.assert(t.condizione_passed);}).to.not.throw();
          expect(()=>{e.error(t.condizione_passed);}).to.not.throw();
        });
        it('assert ed error abilitato con logica di default basata su nome ambiente', () => {
          changeNODE_ENV(t.env_that_doesnt_cause_assert_disabling);
          const e = require(t.support)[tipo_test];
          expect(()=>{e.assert(t.condizione_fail, t.err_mess);}).to.throw(t.err_mess);
          expect(()=>{e.error(t.condizione_fail, t.err_mess);}).to.throw(t.type_error_default, t.err_mess);
        });
      });
      
    });

    
  });
  
}

function forceRequireSupport(path){
  const path_resolve = require.resolve(path);
  if(typeof path_resolve === 'string')
    delete require.cache[path_resolve];
}

function changeNODE_ENV(ambiente){
  const assert = require('assert');
  assert(typeof ambiente === 'string');
  process.env.NODE_ENV = ambiente;
}

function changeENV(nome, valore){
  const assert = require('assert');
  assert(typeof nome === 'string');
  assert(valore !== undefined);
  process.env[nome] = valore;
}