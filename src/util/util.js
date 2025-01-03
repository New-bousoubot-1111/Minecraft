const fs = require('fs');
const jsonc = require('jsonc');

const DATA_FILE = 'data/data.json';

/** @returns {import('../types/index').IConfig} */
function getConfig() {
  // JSONC を読み込み
  const config = jsonc.parse(fs.readFileSync('config.jsonc', 'utf-8'));
  
  // 環境変数を展開
  replaceEnvVariables(config);

  return config;
}

/**
 * 再帰的にオブジェクト内の "process.env.XXX" を環境変数に置き換える
 * @param {object} obj
 */
function replaceEnvVariables(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].startsWith('process.env.')) {
      const envKey = obj[key].slice('process.env.'.length); // "process.env." を除去
      obj[key] = process.env[envKey] || '';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceEnvVariables(obj[key]); // ネストされたオブジェクトも処理
    }
  }
}

/**
 * @param {import('../types').IConfig} config
 */
function validateConfig(config) {
  if (!config.discord_token) throw Error('Set discord_token in config');
  if (!config.guild_id) throw Error('Set guild_id in config');
  if (!config.channel_id) throw Error('Set channel_id in config');
  if (!config.language) throw Error('Set valid language name in config');
  if (config.panel_update_interval === undefined) throw Error('Set panel_update_interval in config');
  
  if (typeof config.guild_id !== 'string') throw TypeError('The type of config.guild_id is not a string');
  if (typeof config.channel_id !== 'string') throw TypeError('The type of config.channel_id is not a string');
  if (typeof config.language !== 'string') throw TypeError('The type of config.language is not a string');
}

function fetchData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '{}');
  const file = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(file);
}

/**
 * @overload
 * @param {"panel_channel"} key
 * @returns {string}
 * 
 * @overload
 * @param {"panel_message"} key
 * @returns {string}
 *
 * @param {string} key
 * @param {any} key
 */
function getData(key) {
  return fetchData()[key];
}

/**
 * @param {string} key
 * @param {any} value
 */
function setData(key, value) {
  const data = fetchData();
  data[key] = value;
  return fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = { validateConfig, getConfig, getData, setData };
