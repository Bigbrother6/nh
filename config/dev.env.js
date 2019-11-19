'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
 // baseURL:'"http://192.168.36.133:8086/smp-monitor"', 
  baseURL:'"http://192.168.34.174:8080/smp-monitortrrrrrrrrttt"', 

})
