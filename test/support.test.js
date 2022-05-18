const path_resolve = require.resolve(`../`);
if(typeof path_resolve === 'string')
  delete require.cache[path_resolve];

const {ErrformanceConfiguration, Errformance} = require(`../`);

module.exports.Errformance_default_assert_env_prod_disable_assert = Errformance('prod');
module.exports.Errformance_default_assert_env_prod_disable_assert_env_custom_disable_error = Errformance('prod', true);
module.exports.Errformance_default_assert_undefined_var_for_assert_error = Errformance();
const {assert} = require('chai');
module.exports.Errformance_custom_assert_chai_env_prod_disable_assert = ErrformanceConfiguration(assert);
