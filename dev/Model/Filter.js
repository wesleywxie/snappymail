import ko from 'ko';

import { pString } from 'Common/Utils';
import { delegateRunOnDestroy } from 'Common/UtilsUser';
import { i18n } from 'Common/Translator';
import { getFolderFromCacheList } from 'Common/Cache';

import AccountStore from 'Stores/User/Account';

import { FilterConditionModel } from 'Model/FilterCondition';
import { AbstractModel } from 'Knoin/AbstractModel';

/**
 * @enum {string}
 */
export const FilterAction = {
	None: 'None',
	MoveTo: 'MoveTo',
	Discard: 'Discard',
	Vacation: 'Vacation',
	Reject: 'Reject',
	Forward: 'Forward'
};

/**
 * @enum {string}
 */
const FilterRulesType = {
	All: 'All',
	Any: 'Any'
};

export class FilterModel extends AbstractModel {
	constructor() {
		super();

		this.id = '';

		this.addObservables({
			enabled: true,
			deleteAccess: false,
			canBeDeleted: true,

			name: '',
			nameError: false,
			nameFocused: false,

			conditionsType: FilterRulesType.Any,

			// Actions
			actionValue: '',
			actionValueError: false,

			actionValueSecond: '',
			actionValueThird: '',

			actionValueFourth: '',
			actionValueFourthError: false,

			actionMarkAsRead: false,

			actionKeep: true,
			actionNoStop: false,

			actionType: FilterAction.MoveTo
		});

		this.conditions = ko.observableArray();

		const fGetRealFolderName = (folderFullNameRaw) => {
			const folder = getFolderFromCacheList(folderFullNameRaw);
			return folder ? folder.fullName.replace('.' === folder.delimiter ? /\./ : /[\\/]+/, ' / ') : folderFullNameRaw;
		};

		this.addComputables({
			nameSub: () => {
				let result = '';
				const actionValue = this.actionValue();

				switch (this.actionType()) {
					case FilterAction.MoveTo:
						result = i18n('SETTINGS_FILTERS/SUBNAME_MOVE_TO', {
							FOLDER: fGetRealFolderName(actionValue)
						});
						break;
					case FilterAction.Forward:
						result = i18n('SETTINGS_FILTERS/SUBNAME_FORWARD_TO', {
							EMAIL: actionValue
						});
						break;
					case FilterAction.Vacation:
						result = i18n('SETTINGS_FILTERS/SUBNAME_VACATION_MESSAGE');
						break;
					case FilterAction.Reject:
						result = i18n('SETTINGS_FILTERS/SUBNAME_REJECT');
						break;
					case FilterAction.Discard:
						result = i18n('SETTINGS_FILTERS/SUBNAME_DISCARD');
						break;
					// no default
				}

				return result ? '(' + result + ')' : '';
			},

			actionTemplate: () => {
				let result = '';

				switch (this.actionType()) {
					case FilterAction.Forward:
						result = 'SettingsFilterActionForward';
						break;
					case FilterAction.Vacation:
						result = 'SettingsFilterActionVacation';
						break;
					case FilterAction.Reject:
						result = 'SettingsFilterActionReject';
						break;
					case FilterAction.None:
						result = 'SettingsFilterActionNone';
						break;
					case FilterAction.Discard:
						result = 'SettingsFilterActionDiscard';
						break;
					case FilterAction.MoveTo:
					default:
						result = 'SettingsFilterActionMoveToFolder';
						break;
				}

				return result;
			}
		});

		this.addSubscribables({
			name: sValue => this.nameError(!sValue),
			actionValue: sValue => this.actionValueError(!sValue),
			actionType: () => {
				this.actionValue('');
				this.actionValueError(false);
				this.actionValueSecond('');
				this.actionValueThird('');
				this.actionValueFourth('');
				this.actionValueFourthError(false);
			}
		});
	}

	generateID() {
		this.id = Jua.randomId();
	}

	verify() {
		if (!this.name()) {
			this.nameError(true);
			return false;
		}

		if (this.conditions.length && this.conditions.find(cond => cond && !cond.verify())) {
			return false;
		}

		if (!this.actionValue()) {
			if ([
					FilterAction.MoveTo,
					FilterAction.Forward,
					FilterAction.Reject,
					FilterAction.Vacation
				].includes(this.actionType())
			) {
				this.actionValueError(true);
				return false;
			}
		}

		if (FilterAction.Forward === this.actionType() && !this.actionValue().includes('@')) {
			this.actionValueError(true);
			return false;
		}

		if (
			FilterAction.Vacation === this.actionType() &&
			this.actionValueFourth() &&
			!this.actionValueFourth().includes('@')
		) {
			this.actionValueFourthError(true);
			return false;
		}

		this.nameError(false);
		this.actionValueError(false);

		return true;
	}

	toJson() {
		return {
//			'@Object': 'Object/Filter',
			ID: this.id,
			Enabled: this.enabled() ? '1' : '0',
			Name: this.name(),
			Conditions: this.conditions.map(item => item.toJson()),
			ConditionsType: this.conditionsType(),

			ActionType: this.actionType(),
			ActionValue: this.actionValue(),
			ActionValueSecond: this.actionValueSecond(),
			ActionValueThird: this.actionValueThird(),
			ActionValueFourth: this.actionValueFourth(),

			Keep: this.actionKeep() ? '1' : '0',
			Stop: this.actionNoStop() ? '0' : '1',
			MarkAsRead: this.actionMarkAsRead() ? '1' : '0'
		};
	}

	addCondition() {
		this.conditions.push(new FilterConditionModel());
	}

	removeCondition(oConditionToDelete) {
		this.conditions.remove(oConditionToDelete);
		delegateRunOnDestroy(oConditionToDelete);
	}

	setRecipients() {
		this.actionValueFourth(AccountStore.getEmailAddresses().join(', '));
	}

	/**
	 * @static
	 * @param {FetchJsonFilter} json
	 * @returns {?FilterModel}
	 */
	static reviveFromJson(json) {
		const filter = super.reviveFromJson(json);
		if (filter) {
			filter.id = pString(json.ID);

			filter.conditions([]);

			if (Array.isNotEmpty(json.Conditions)) {
				filter.conditions(
					json.Conditions.map(aData => FilterConditionModel.reviveFromJson(aData)).filter(v => v)
				);
			}

			filter.actionNoStop(!json.Stop);
			filter.actionKeep(!!json.Keep);
			filter.actionMarkAsRead(!!json.MarkAsRead);
		}
		return filter;
	}

	cloneSelf() {
		const filter = new FilterModel();

		filter.id = this.id;

		filter.enabled(this.enabled());

		filter.name(this.name());
		filter.nameError(this.nameError());

		filter.conditionsType(this.conditionsType());

		filter.actionMarkAsRead(this.actionMarkAsRead());

		filter.actionType(this.actionType());

		filter.actionValue(this.actionValue());
		filter.actionValueError(this.actionValueError());

		filter.actionValueSecond(this.actionValueSecond());
		filter.actionValueThird(this.actionValueThird());
		filter.actionValueFourth(this.actionValueFourth());

		filter.actionKeep(this.actionKeep());
		filter.actionNoStop(this.actionNoStop());

		filter.conditions(this.conditions.map(item => item.cloneSelf()));

		return filter;
	}
}
