import $ from '$';
import ko from 'ko';

import { VIEW_MODELS } from 'Common/Globals';
import { delegateRun, windowResize, log, pString } from 'Common/Utils';
import { settings } from 'Common/Links';

import { setHash } from 'Knoin/Knoin';
import { AbstractScreen } from 'Knoin/AbstractScreen';

class AbstractSettingsScreen extends AbstractScreen {
	/**
	 * @param {Array} viewModels
	 */
	constructor(viewModels) {
		super('settings', viewModels);

		this.menu = ko.observableArray([]);

		this.oCurrentSubScreen = null;
		this.oViewModelPlace = null;

		this.setupSettings();
	}

	/**
	 * @param {Function=} fCallback
	 */
	setupSettings(fCallback = null) {
		if (fCallback) {
			fCallback();
		}
	}

	onRoute(subName) {
		let settingsScreen = null,
			RoutedSettingsViewModel = null,
			viewModelPlace = null,
			viewModelDom = null;

		RoutedSettingsViewModel = VIEW_MODELS.settings.find(
			SettingsViewModel =>
				SettingsViewModel && SettingsViewModel.__rlSettingsData && subName === SettingsViewModel.__rlSettingsData.Route
		);

		if (RoutedSettingsViewModel) {
			if (
				VIEW_MODELS['settings-removed'].find(
					DisabledSettingsViewModel =>
						DisabledSettingsViewModel && DisabledSettingsViewModel === RoutedSettingsViewModel
				)
			) {
				RoutedSettingsViewModel = null;
			}

			if (
				RoutedSettingsViewModel &&
				VIEW_MODELS['settings-disabled'].find(
					DisabledSettingsViewModel =>
						DisabledSettingsViewModel && DisabledSettingsViewModel === RoutedSettingsViewModel
				)
			) {
				RoutedSettingsViewModel = null;
			}
		}

		if (RoutedSettingsViewModel) {
			if (RoutedSettingsViewModel.__builded && RoutedSettingsViewModel.__vm) {
				settingsScreen = RoutedSettingsViewModel.__vm;
			} else {
				viewModelPlace = this.oViewModelPlace;
				if (viewModelPlace && 1 === viewModelPlace.length) {
					settingsScreen = new RoutedSettingsViewModel();

					viewModelDom = $('<div></div>')
						.addClass('rl-settings-view-model')
						.hide();
					viewModelDom.appendTo(viewModelPlace);

					settingsScreen.viewModelDom = viewModelDom;

					settingsScreen.__rlSettingsData = RoutedSettingsViewModel.__rlSettingsData;

					RoutedSettingsViewModel.__dom = viewModelDom;
					RoutedSettingsViewModel.__builded = true;
					RoutedSettingsViewModel.__vm = settingsScreen;

					const tmpl = { name: RoutedSettingsViewModel.__rlSettingsData.Template };
					ko.applyBindingAccessorsToNode(
						viewModelDom[0],
						{
							translatorInit: true,
							template: () => tmpl
						},
						settingsScreen
					);

					delegateRun(settingsScreen, 'onBuild', [viewModelDom]);
				} else {
					log('Cannot find sub settings view model position: SettingsSubScreen');
				}
			}

			if (settingsScreen) {
				const o = this;
				setTimeout(() => {
					// hide
					if (o.oCurrentSubScreen) {
						delegateRun(o.oCurrentSubScreen, 'onHide');
						o.oCurrentSubScreen.viewModelDom.hide();
					}
					// --

					o.oCurrentSubScreen = settingsScreen;

					// show
					if (o.oCurrentSubScreen) {
						delegateRun(o.oCurrentSubScreen, 'onBeforeShow');
						o.oCurrentSubScreen.viewModelDom.show();
						delegateRun(o.oCurrentSubScreen, 'onShow');
						delegateRun(o.oCurrentSubScreen, 'onShowWithDelay', [], 200);

						o.menu().forEach(item => {
							item.selected(
								settingsScreen &&
									settingsScreen.__rlSettingsData &&
									item.route === settingsScreen.__rlSettingsData.Route
							);
						});

						$('#rl-content .b-settings .b-content .content').scrollTop(0);
					}
					// --

					windowResize();
				}, 1);
			}
		} else {
			setHash(settings(), false, true);
		}
	}

	onHide() {
		if (this.oCurrentSubScreen && this.oCurrentSubScreen.viewModelDom) {
			delegateRun(this.oCurrentSubScreen, 'onHide');
			this.oCurrentSubScreen.viewModelDom.hide();
		}
	}

	onBuild() {
		VIEW_MODELS.settings.forEach(SettingsViewModel => {
			if (
				SettingsViewModel &&
				SettingsViewModel.__rlSettingsData &&
				!VIEW_MODELS['settings-removed'].find(
					RemoveSettingsViewModel => RemoveSettingsViewModel && RemoveSettingsViewModel === SettingsViewModel
				)
			) {
				this.menu.push({
					route: SettingsViewModel.__rlSettingsData.Route,
					label: SettingsViewModel.__rlSettingsData.Label,
					selected: ko.observable(false),
					disabled: !!VIEW_MODELS['settings-disabled'].find(
						DisabledSettingsViewModel => DisabledSettingsViewModel && DisabledSettingsViewModel === SettingsViewModel
					)
				});
			}
		});

		this.oViewModelPlace = $('#rl-content #rl-settings-subscreen');
	}

	routes() {
		const DefaultViewModel = VIEW_MODELS.settings.find(
				SettingsViewModel =>
					SettingsViewModel && SettingsViewModel.__rlSettingsData && SettingsViewModel.__rlSettingsData.IsDefault
			),
			defaultRoute =
				DefaultViewModel && DefaultViewModel.__rlSettingsData ? DefaultViewModel.__rlSettingsData.Route : 'general',
			rules = {
				subname: /^(.*)$/,
				normalize_: (rquest, vals) => {
					vals.subname = undefined === vals.subname ? defaultRoute : pString(vals.subname);
					return [vals.subname];
				}
			};

		return [
			['{subname}/', rules],
			['{subname}', rules],
			['', rules]
		];
	}
}

export { AbstractSettingsScreen, AbstractSettingsScreen as default };
