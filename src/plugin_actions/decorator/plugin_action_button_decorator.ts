import FinanceManagerPlugin from "main";
import { EntryOptionsModal } from "../modal/entry_options_modal";

export class PluginActionButtonDecorator {

	include(plugin: FinanceManagerPlugin) {
		const ribbonIconEl = plugin.addRibbonIcon('piggy-bank', 'Add finance entry', (evt: MouseEvent) => {
			new EntryOptionsModal(plugin).open();
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('finance-manager-ribbon-class');
	}
}
