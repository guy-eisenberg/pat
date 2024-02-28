import { c } from '../lib';

interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  columns: string[];
  rows: React.ReactNode[][];
  selectedRowIndex?: number;
  emptyLabel?: string;
  onRowSelect: (index: number) => void;
}

const Table: React.FC<TableProps> = ({
  title,
  columns,
  rows,
  selectedRowIndex,
  emptyLabel,
  onRowSelect,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'overflow-x-auto rounded-sm border border-theme-border text-sm text-theme-dark-gray',
        rest.className
      )}
    >
      <b
        className="sticky left-0 top-0 block border-b border-b-theme-border px-6 py-3 text-base font-semibold text-[#6b6b6b]"
        style={{
          boxShadow: 'inset 0px -4px 10px 0px rgba(0,0,0,0.01)',
        }}
      >
        {title}
      </b>
      <table className="w-full text-left">
        <thead>
          <tr
            className={c(
              'border-b-theme-border bg-[#f7f7f7]',
              rows.length > 0 && 'border-b'
            )}
            style={{
              boxShadow: 'inset 0px 4px 10px 0px rgba(0,0,0,0.025)',
            }}
          >
            {columns.map((col, i) => (
              <th
                className={c(
                  'whitespace-nowrap px-12 py-3 font-semibold text-[#999999]',
                  i === 0 && 'pl-6',
                  i === columns.length - 1 && 'pr-6'
                )}
                key={col}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              className={c(
                'cursor-pointer border border-b-theme-border last:border-none',
                selectedRowIndex === i && 'bg-[#33bde4] text-white'
              )}
              onClick={() => onRowSelect(i)}
              key={i}
            >
              {row.map((item, i) => (
                <td
                  className={c(
                    'whitespace-nowrap px-12 py-5',
                    i === 0 && 'pl-6',
                    i === row.length && 'pr-6'
                  )}
                  key={i}
                >
                  {item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="border-t border-t-theme-border bg-[#f3f3f3] p-6 font-normal text-theme-medium-gray">
          <p>{emptyLabel}</p>
        </div>
      )}
    </div>
  );
};

export default Table;
