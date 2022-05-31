/*
 * Permette di 
 */
const assert = require('assert');

const ENVIRONMENT = process.env.NODE_ENV;
const DISABLING_ERRFORMANCE = process.env.DISABLING_ERRFORMANCE;

const assertFunctionDefault = require('assert');

const DEFAULT_ERROR_TYPE = TypeError;
class Errformance{
  #settings; #functionAssert; #functionError; #type_error;
  constructor(assertFunction, type_error, config_env_assert, config_env_error){
    checkErrformance({assertFunction, type_error, config_env_assert, config_env_error});
    
    this.#type_error = type_error===undefined?DEFAULT_ERROR_TYPE:type_error;
    this.#settings = {assertFunction, config_env_assert, config_env_error};
    this.#functionAssert = functionAssertDisabilitabile(assertFunction, config_env_assert, config_env_error);
    this.#functionError = functionErrorDisabilitabile(assertFunction, config_env_assert, config_env_error);
  }
  assert(...args){return this.#functionAssert(...args);}
  error(...args){
    try{
      return this.#functionError(...args);
    } catch(e){
      throw new this.#type_error(e.message);
    }
  }
}

function checkErrformance({assertFunction, type_error, config_env_assert, config_env_error}){
  assert(typeof assertFunction === 'function');
  if(!(config_env_assert === undefined || typeof config_env_assert === 'string' || typeof config_env_assert === 'function'))
    throw new TypeError('configurazione errata. deve essere stringa o callback');
  if(!(config_env_error === undefined || typeof config_env_error === 'string' || typeof config_env_error === 'function'))
    throw new TypeError('configurazione errata. deve essere stringa o callback');
  if(!(type_error === undefined || typeof type_error === 'function')) throw new TypeError(`error type must to be a function with constructor. Received ${typeof type_error}`);
}

function functionAssertDisabilitabile(assertFunction, config_env_assert, config_env_error){
  checkDisabilitabile(...arguments);
  assert(!condizioneAssertPresenteErrorAssente(config_env_assert, config_env_error));
  switch(typeof config_env_assert){
    case 'undefined': return assertFunction;
    case 'string':  if(config_env_assert === ENVIRONMENT) return function(){/*funzione vuota*/};
                    else return functionErrorDisabilitabile(assertFunction, config_env_assert, config_env_error);
    case 'function': throw new Error('da sviluppare');
    default: assert.fail('dato non previsto');
  }
}

function functionErrorDisabilitabile(assertFunction, config_env_assert, config_env_error){
  checkDisabilitabile(...arguments);
  assert(!condizioneAssertPresenteErrorAssente(config_env_assert, config_env_error));
  switch(true){
    case config_env_error === undefined: return assertFunction;
    case typeof config_env_error === 'string':
      if(config_env_error === DISABLING_ERRFORMANCE) return function(){/*funzione vuota*/};
      else return assertFunction;
    case typeof config_env_error === 'function': throw new Error('da sviluppare');
    default: assert.fail('dato non previsto');
  }
}
function checkDisabilitabile(assertFunction, config_env_assert, config_env_error){
  assert(typeof assertFunction === 'function');
  assert(typeof config_env_assert === 'string' || config_env_assert === undefined);
  assert(typeof config_env_error === 'string' || config_env_error === undefined || typeof config_env_error === 'boolean');
}
function condizioneAssertPresenteErrorAssente(config_env_assert, config_env_error){
  const env_assert_presente = config_env_assert !== undefined;
  const env_error_presente = config_env_error !== undefined;
  return !env_assert_presente && env_error_presente;
}

function ErrformanceConfiguration({assert_func, type_error}){
  checkConfig(assert_func, type_error);
  if(assert_func === undefined) assert_func = assertFunctionDefault;
  if(type_error === undefined) type_error = DEFAULT_ERROR_TYPE;

  return function(config_env_assert, config_env_error){
            return new Errformance(assertFunctionDefault, type_error, config_env_assert, config_env_error);
         };
}
function checkConfig(assertCustomFunction, type_error){
  if(!(assertCustomFunction === undefined || typeof assertCustomFunction === 'function'))
    throw new TypeError('configurazione errata. deve essere una funzione');
  if(!(type_error === undefined || typeof type_error === 'function'))
    throw new TypeError(`configurazione errata. deve essere una funzione. Ricevuto ${typeof type_error}`);
}

module.exports = ErrformanceConfiguration({assert_func: undefined, type_error: undefined});
module.exports.Errformance = ErrformanceConfiguration({assert_func: undefined, type_error: undefined});
module.exports.ErrformanceConfiguration = ErrformanceConfiguration;
if(ENVIRONMENT === 'dev')
  module.exports.test = {assertFunctionDefault, DEFAULT_ERROR_TYPE};

