import React, { useMemo, useState } from 'react';
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

export default function DenialsTable({ data }: DenialsTableProps) {
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

  return (
    <table>
      <thead>
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
        {table.getRowModel().rows.length === 0 ? (
          <tr>
            <td colSpan={columnCount}>No denials found.</td>
          </tr>
        ) : (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
