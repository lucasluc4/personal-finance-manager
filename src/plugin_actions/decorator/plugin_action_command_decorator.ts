import { Notice } from 'obsidian';
import { EntryOptionDescriptionMap } from "../entry_option_description_map";
import { EntryModalMap } from "../entry_option_modal_map";

import FinanceManagerPlugin from "main";

export class PluginActionCommandDecorator {

	include(plugin: FinanceManagerPlugin) {
		const entryOptionDescriptionMap = new EntryOptionDescriptionMap();
		const entryModalMap = new EntryModalMap(plugin);

		entryModalMap.getRegisteredTypes().forEach(type => {
			plugin.addCommand({
				id: 'cmd-open-modal-' + type,
				name: entryOptionDescriptionMap.getDescription(type),
				callback: () => {
					const modal = entryModalMap.getModal(type);
					if (modal) {
						modal.open();
					} else {
						new Notice('Command is not properly configured');
					}
				}
			});
		});
	}
}
