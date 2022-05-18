/*
 * Permette di 
 */
const assert = require('assert');

const AMBIENTE = process.env.NODE_ENV;
const DISABLING_ERRFORMANCE = process.env.DISABLING_ERRFORMANCE;

const assertFunctionDefault = require('assert');

class Errformance{
  #settings; #functionAssert; #functionError;
  constructor(assertFunction, config_env_assert, config_env_error){
    checkErrformance(...arguments);
    this.#settings = {assertFunction, config_env_assert, config_env_error};
    this.#functionAssert = functionAssertDisabilitabile(assertFunction, config_env_assert, config_env_error);
    this.#functionError = functionErrorDisabilitabile(assertFunction, config_env_assert, config_env_error);
  }
  assert(...args){return this.#functionAssert(...args);}
  error(...args){
    try{
      return this.#functionError(...args);
    } catch(e){
      throw new TypeError(e.message);
    }
  }
}

function checkErrformance(assertFunction, config_env_assert, config_env_error){
  assert(typeof assertFunction === 'function');
  if(!(config_env_assert === undefined || typeof config_env_assert === 'string' || typeof config_env_assert === 'function'))
    throw new TypeError('configurazione errata. deve essere stringa o callback');
  if(!(config_env_error === undefined || typeof config_env_error === 'string' || typeof config_env_error === 'function' || typeof config_env_error === 'boolean'))
    throw new TypeError('configurazione errata. deve essere stringa o callback');
}

function functionAssertDisabilitabile(assertFunction, config_env_assert, config_env_error){
  checkDisabilitabile(...arguments);
  assert(!condizioneAssertPresenteErrorAssente(config_env_assert, config_env_error));
  switch(typeof config_env_assert){
    case 'undefined': return assertFunction;
    case 'string':  if(config_env_assert === AMBIENTE) return function(){/*funzione vuota*/};
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
    case typeof config_env_error !== 'function':
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

function ErrformanceConfiguration(assertCustomFunction){
  checkConfig(assertCustomFunction);
  
  switch(typeof assertCustomFunction){
    case 'undefined': return function(config_env_assert, config_env_error){return new Errformance(assertFunctionDefault, config_env_assert, config_env_error);};
    case 'function' : return function(config_env_assert, config_env_error){return new Errformance(assertCustomFunction, config_env_assert, config_env_error);};
    default: throw new Error();
  }
  
}
function checkConfig(assertCustomFunction){
  if(!(assertCustomFunction === undefined || typeof assertCustomFunction === 'function'))
    throw new TypeError('configurazione errata. deve essere una funzione');
}


module.exports.Errformance = ErrformanceConfiguration(undefined);
module.exports.ErrformanceConfiguration = ErrformanceConfiguration;

