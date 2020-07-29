import { data as GlobalsData } from 'Common/Globals';
import * as Settings from 'Storage/Settings';

const SIMPLE_HOOKS = {},
	USER_VIEW_MODELS_HOOKS = [],
	ADMIN_VIEW_MODELS_HOOKS = [];

/**
 * @param {string} name
 * @param {Function} callback
 */
export function addHook(name, callback) {
	if (typeof callback === 'function') {
		if (!Array.isArray(SIMPLE_HOOKS[name])) {
			SIMPLE_HOOKS[name] = [];
		}

		SIMPLE_HOOKS[name].push(callback);
	}
}

/**
 * @param {string} name
 * @param {Array=} args = []
 */
export function runHook(name, args = []) {
	if (Array.isArray(SIMPLE_HOOKS[name])) {
		SIMPLE_HOOKS[name].forEach(callback => {
			callback(...args);
		});
	}
}

/**
 * @param {string} name
 * @returns {?}
 */
export function mainSettingsGet(name) {
	return Settings.settingsGet(name);
}

/**
 * @param {Function} callback
 * @param {string} action
 * @param {Object=} parameters
 * @param {?number=} timeout
 */
export function remoteRequest(callback, action, parameters, timeout) {
	if (GlobalsData.__APP__) {
		GlobalsData.__APP__.remote().defaultRequest(callback, 'Plugin' + action, parameters, timeout);
	}
}

/**
 * @param {Function} SettingsViewModelClass
 * @param {string} labelName
 * @param {string} template
 * @param {string} route
 */
export function addSettingsViewModel(SettingsViewModelClass, template, labelName, route) {
	USER_VIEW_MODELS_HOOKS.push([SettingsViewModelClass, template, labelName, route]);
}

/**
 * @param {Function} SettingsViewModelClass
 * @param {string} labelName
 * @param {string} template
 * @param {string} route
 */
export function addSettingsViewModelForAdmin(SettingsViewModelClass, template, labelName, route) {
	ADMIN_VIEW_MODELS_HOOKS.push([SettingsViewModelClass, template, labelName, route]);
}

/**
 * @param {boolean} admin
 */
export function runSettingsViewModelHooks(admin) {
	const Knoin = require('Knoin/Knoin');
	(admin ? ADMIN_VIEW_MODELS_HOOKS : USER_VIEW_MODELS_HOOKS).forEach(view => {
		Knoin.addSettingsViewModel(view[0], view[1], view[2], view[3]);
	});
}

/**
 * @param {string} pluginSection
 * @param {string} name
 * @returns {?}
 */
export function settingsGet(pluginSection, name) {
	let plugins = Settings.settingsGet('Plugins');
	plugins = plugins && undefined !== plugins[pluginSection] ? plugins[pluginSection] : null;
	return plugins ? (undefined === plugins[name] ? null : plugins[name]) : null;
}
