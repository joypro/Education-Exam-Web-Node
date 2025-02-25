const mysql         	= require('mysql2');
// const redis		= require('handy-redis');
const config        	= require('./config');
const util          	= require('util');

// create Mysql connection pool
const pool          	= mysql.createPool(config.MYSQL_CONFIG);
const readPool   		= pool.promise();
const writePool			= pool.promise();

// const slave_pool        = mysql.createPool(config.MYSQL_CONFIG_SLAVE);
// const slave_readPool    = slave_pool.promise();
// const slave_writePool   = slave_pool.promise();



// Create Redis Connection
// const redisCon 		= redis.createNodeRedisClient('redis://'+config.REDIS_CONFIG.host+':'+config.REDIS_CONFIG.port+'?password='+config.REDIS_CONFIG.password);

module.exports = {
	pool:pool,
	readPool:readPool,
	writePool:writePool,
	// redisCon:redisCon,
	// slave_readPool:slave_readPool,
	// slave_writePool:slave_writePool,
}
