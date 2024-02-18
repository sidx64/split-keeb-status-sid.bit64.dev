/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
const { St, Clutter, Shell, Meta, GLib } = imports.gi;

const Main = imports.ui.main;

/* Import PanelMenu and PopupMenu */
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Gettext = imports.gettext.domain('split-keeb-status');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/*
 * This is the main class of this extension, corresponding to the button in the
 * top panel and its menu.
 */
class SplitKeebStatus {
    constructor() {
        this.super_btn = new PanelMenu.Button(0.0, _("SplitKeebStatus"), false);
        let box = new St.BoxLayout();
        let icon = new St.Icon({
            icon_name: 'input-keyboard-symbolic',
            style_class: 'system-status-icon'
        });

        box.add_child(icon);

        // this._permanentItems = 0;
        // this._activeCat = -1;

        this.super_btn.add_child(box);

        this.super_btn.menu.connect(
            'open-state-changed',
            this._onOpenStateChanged.bind(this)
        );

        //initializing this._buttonMenuItem
        // this._renderPanelMenuHeaderBox();

    }

    // updateNbCols() {
    //     let nbCols = SETTINGS.get_int('nbcols');
    //     this.emojiCategories.forEach(function (c) {
    //         c.setNbCols(nbCols);
    //     });

    //     this.searchItem = new EmojiSearchItem(nbCols);
    // }

    toggle() {
        this.super_btn.menu.toggle();
    }

    /**
     * Executed when the user opens/closes the menu, the main goals are to clear
     * and to focus the search entry.
     */
    _onOpenStateChanged(self, open) {
        this.super_btn.visible = open
        this.clearCategories();
        // this.unloadCategories();

        timeoutSourceId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 20, () => {
            // if (open) {
            //     global.stage.set_key_focus(this.searchItem.searchEntry);
            // }
            timeoutSourceId = null;
            return GLib.SOURCE_REMOVE;
        });
    }



    // // Adds categories' buttons to the extension interface
    // _renderPanelMenuHeaderBox() {
    //     this._buttonMenuItem = new PopupMenu.PopupBaseMenuItem({
    //         reactive: false,
    //         can_focus: false
    //     });
    //     this.categoryButton = [];
    //     for (let i = 0; i < this.emojiCategories.length; i++) {
    //         this._buttonMenuItem.actor.add_child(this.emojiCategories[i].getButton());
    //     }
    // }

    // // Cleans the interface & close the opened category (if any). Called from the
    // // outside, be careful.
    // clearCategories() {
    //     // removing the style class of previously opened category's button
    //     for (let i = 0; i < 9; i++) {
    //         this.emojiCategories[i].getButton().set_checked(false);
    //     }

    //     let items = this.super_btn.menu._getMenuItems();

    //     // closing and hiding any opened category
    //     if (POSITION == 'top') {
    //         for (let i = this._permanentItems; i < items.length; i++) {
    //             items[i].setSubmenuShown(false);
    //             items[i].actor.visible = false;
    //         }
    //     } else { // if (POSITION == 'bottom') {
    //         for (let i = 0; i < (items.length - this._permanentItems); i++) {
    //             items[i].setSubmenuShown(false);
    //             items[i].actor.visible = false;
    //         }
    //     }

    //     this._activeCat = -1;
    //     this._onSearchTextChanged(); // XXX not optimal
    // }

    // // Wrapper calling EmojiSearchItem's _onSearchTextChanged method
    // _onSearchTextChanged() {
    //     this.searchItem._onSearchTextChanged();
    // }

    // _bindShortcut() {
    //     Main.wm.addKeybinding(
    //         'emoji-keybinding',
    //         SETTINGS,
    //         Meta.KeyBindingFlags.NONE,
    //         Shell.ActionMode.ALL,
    //         this.toggle.bind(this)
    //     );
    // }

    //	destroy() { // XXX ?
    //		this.unloadCategories();
    //		for (let i=1; i<this.emojiCategories.length; i++) {
    //			this.emojiCategories[i].destroy();
    //		}
    //	}

};

function init() {
    ExtensionUtils.initTranslations('split-keeb-status');
    try {
        let theme = imports.gi.Gtk.IconTheme.get_default();
        theme.append_search_path(Me.path + '/icons');
    } catch (e) {
        // Appending bullshit to the icon theme path is deprecated, but 18.04
        // users don't have the icons so i do it anyway.
    }
}


function enable() {
    // SETTINGS = ExtensionUtils.getSettings();
    // POSITION = SETTINGS.get_string('position');

    GLOBAL_BUTTON = new SplitKeebStatus();

    // about addToStatusArea :
    // - 'EmojisMenu' is an id
    // - 0 is the position
    // - `right` is the box where we want our GLOBAL_BUTTON to be displayed (left/center/right)
    Main.panel.addToStatusArea('SplitKeebStatus', GLOBAL_BUTTON.super_btn, 0, 'right');

    // SIGNAUX[0] = SETTINGS.connect('changed::emojisize', () => {
    //     GLOBAL_BUTTON.updateStyle();
    // });
    // SIGNAUX[1] = SETTINGS.connect('changed::always-show', () => {
    //     GLOBAL_BUTTON.super_btn.visible = SETTINGS.get_boolean('always-show');
    // });
    // SIGNAUX[2] = SETTINGS.connect('changed::use-keybinding', (z) => {
    //     if (z.get_boolean('use-keybinding')) {
    //         Main.wm.removeKeybinding('emoji-keybinding');
    //         GLOBAL_BUTTON._bindShortcut();
    //     } else {
    //         Main.wm.removeKeybinding('emoji-keybinding');
    //     }
    // });
    // SIGNAUX[3] = SETTINGS.connect('changed::nbcols', () => {
    //     GLOBAL_BUTTON.updateNbCols();
    // });
}

//------------------------------------------------------------------------------

function disable() {
    // we need to save these data for the next session
    // GLOBAL_BUTTON.searchItem.saveRecents();

    // if (SETTINGS.get_boolean('use-keybinding')) {
    //     Main.wm.removeKeybinding('emoji-keybinding');
    // }

    // SETTINGS.disconnect(SIGNAUX[0]);
    // SETTINGS.disconnect(SIGNAUX[1]);
    // SETTINGS.disconnect(SIGNAUX[2]);

    GLOBAL_BUTTON.super_btn.destroy();
    //	GLOBAL_BUTTON.destroy();

    // if (timeoutSourceId) {
    //     GLib.Source.remove(timeoutSourceId);
    //     timeoutSourceId = null;
    // }
}