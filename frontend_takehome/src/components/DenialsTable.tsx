import { RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	createColumnHelper,
	flexRender,
	SortingState,
} from '@tanstack/react-table';
import { Denial } from '../types';

interface DenialsTableProps {
	data: Denial[];
	loading?: boolean;
}

const SKELETON_ROW_COUNT = 8;

// Once the table holds more rows than this, the scroll region caps its
// height at exactly enough room for the header plus this many data rows
// and scrolls for the rest, rather than growing to show every row (or
// being capped at some hand-guessed pixel value that doesn't actually
// correspond to a row count).
const MAX_VISIBLE_ROWS = 10;

interface CappedTableHeight {
	headerRef: RefObject<HTMLTableSectionElement>;
	rowRef: RefObject<HTMLTableRowElement>;
	maxHeight: number | undefined;
}

// Measures the header's rendered height plus one data row's rendered
// height (both depend on font/line-height, not hardcoded here) and
// returns the pixel height that fits the header plus MAX_VISIBLE_ROWS
// rows -- or undefined if there aren't enough rows to need a cap at all,
// in which case the table should just size to its natural content
// height.
function useCappedTableHeight(rowCount: number): CappedTableHeight {
	const headerRef = useRef<HTMLTableSectionElement>(null);
	const rowRef = useRef<HTMLTableRowElement>(null);
	const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

	useLayoutEffect(() => {
		if (rowCount <= MAX_VISIBLE_ROWS) {
			setMaxHeight(undefined);
			return;
		}
		const headerHeight = headerRef.current?.offsetHeight ?? 0;
		const rowHeight = rowRef.current?.offsetHeight ?? 0;
		if (headerHeight === 0 || rowHeight === 0) return;
		setMaxHeight(headerHeight + rowHeight * MAX_VISIBLE_ROWS);
	}, [rowCount]);

	return { headerRef, rowRef, maxHeight };
}

const currency = (value: number) =>
	`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const columnHelper = createColumnHelper<Denial>();

const columns = [
	columnHelper.accessor('id', { header: 'ID' }),
	columnHelper.accessor('department', { header: 'Dept' }),
	columnHelper.accessor('amount', {
		header: 'Amount',
		cell: (info) => currency(info.getValue()),
	}),
	columnHelper.accessor('reason', { header: 'Reason' }),
	columnHelper.accessor('date', { header: 'Date' }),
	columnHelper.accessor('payer', { header: 'Payer' }),
];

export default function DenialsTable({ data, loading = false }: DenialsTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const columnCount = useMemo(() => columns.length, []);
	const rows = table.getRowModel().rows;
	const { headerRef, rowRef, maxHeight } = useCappedTableHeight(loading ? 0 : rows.length);

	return (
		<div className="denial-records-table-scroll" style={{ maxHeight }}>
			<table>
				<thead ref={headerRef}>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const sortState = header.column.getIsSorted();
								return (
									<th key={header.id}>
										<button
											type="button"
											className="sortable-header"
											onClick={header.column.getToggleSortingHandler()}
											aria-label={`Sort by ${header.column.columnDef.header}`}
										>
											{flexRender(header.column.columnDef.header, header.getContext())}
											<span aria-hidden="true" className="sort-indicator">
												{sortState === 'asc' ? '▲' : sortState === 'desc' ? '▼' : ''}
											</span>
										</button>
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody>
					{loading ? (
						Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
							<tr key={i} aria-hidden="true">
								{columns.map((_, colIndex) => (
									<td key={colIndex}>
										<span className="skeleton-text" />
									</td>
								))}
							</tr>
						))
					) : rows.length === 0 ? (
						<tr>
							<td colSpan={columnCount}>No denials found.</td>
						</tr>
					) : (
						rows.map((row, rowIndex) => (
							<tr key={row.id} ref={rowIndex === 0 ? rowRef : undefined}>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
