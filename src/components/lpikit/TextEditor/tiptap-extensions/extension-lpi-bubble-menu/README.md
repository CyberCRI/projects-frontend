# LPI version of bubble-menu-plugin from ueberdosis' tiptap

Based on the `v2.0.3` version

See https://github.com/ueberdosis/tiptap/tree/20359ee27d2b0f4fdb2ebeecbab4850f4bd48995/packages/extension-bubble-menu/src for original code

Beside name changes, the code modification are in `./lpi-bubble-menu-plugin.ts`
the reason we fork it is that original version trigger popup on editor focus witch is triggered before selectionUpdate
And so the check on current selection type (i.e. `editor.isActive('link')` is always one wagon behind). See `selectionHandler`
Plus we needed to trigger popup event if selection is "empty" (from == to) see line 168 in `update()`