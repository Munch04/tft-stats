type Column = {
	label: string;
	key: string;
};

type StatsTableProps<T> = {
	columns: Column[];
	rows: T[];
	rowKey: (row: T) => string;
	renderCell?: (row: T, key: string) => React.ReactNode;
};

export function StatsTable<T>({
	columns,
	rows,
	rowKey,
	renderCell,
}: StatsTableProps<T>) {
	return (
		<table>
			<thead>
				<tr>
					{columns.map((col) => (
						<th key={col.key}>{col.label}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={rowKey(row)}>
						{columns.map((col) => (
							<td key={col.key}>
								{renderCell
									? renderCell(row, col.key)
									: (row as any)[col.key]}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}