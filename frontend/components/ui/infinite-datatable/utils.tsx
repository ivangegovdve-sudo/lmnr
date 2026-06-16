import { type ColumnDef, type RowData } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox.tsx";

import { type CheckboxColumnOptions } from "./model/types.ts";

export const EMPTY_ARRAY: RowData[] = [];

// Walk ancestors for the nearest vertically-scrollable element, falling back to
// the document scrolling element. Used by the windowScroll virtualizer to bind
// to the real page-scroll container under a fixed-shell layout. Match on the
// overflow style alone — NOT on current `scrollHeight > clientHeight` — because
// resolution runs once on mount while content is still loading and short; a
// scroll container that hasn't overflowed yet would otherwise be skipped, and
// the virtualizer would bind to the document and desync once content grows.
export function findScrollParent(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      return node;
    }
    node = node.parentElement;
  }
  return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
}

export function createCheckboxColumn<TData extends RowData>(options?: CheckboxColumnOptions): ColumnDef<TData> {
  return {
    id: "__row_selection",
    enableResizing: false,
    size: 42,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(checked) => {
          table.toggleAllRowsSelected(!!checked);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => {
          row.toggleSelected(!!checked);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    ),
  };
}
