import React from 'react';
import { c, p, showDangerModal } from '../lib';

type RowActionHandler<T> = (item: T, index: number) => void;

interface TableProps<T = any>
  extends React.TableHTMLAttributes<HTMLTableElement> {
  data: T[];
  columns: string[];
  renderRow: (item: T, index: number) => (string | number | React.ReactNode)[];
  actions?:
    | false
    | {
        parameters?: true;
        delete?: true;
      };
  itemName: string;
  onParametersClick?: RowActionHandler<T>;
  onDelete?: RowActionHandler<T>;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  renderRow,
  itemName,
  actions = {
    parameters: true,
    delete: true,
  },
  onParametersClick,
  onDelete,
  ...rest
}) => {
  return (
    <table
      {...rest}
      className={c(
        'overflow-hidden rounded-md text-xs text-themeDarkGray outline outline-1 outline-themeLightGray',
        rest.className
      )}
    >
      <thead>
        <tr className="border-b border-b-themeLightGray bg-white">
          {(actions ? [...columns, ''] : [...columns]).map((column) => (
            <th key={column} className="py-2 px-10 text-left">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr
            key={i}
            className="border-b border-themeLightGray bg-white transition last:border-none"
          >
            {renderRow(item, i).map((item, i) => (
              <td key={i} className="py-2 px-10">
                {item}
              </td>
            ))}
            {actions && (
              <td className="flex gap-2 py-2 px-10">
                {actions.parameters && (
                  <button
                    className="flex hover:brightness-90"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (onParametersClick) onParametersClick(item, i);
                    }}
                  >
                    <img
                      alt="parameters"
                      src={p('icons/parameters_icon.svg')}
                      width={24}
                      height={24}
                    />
                  </button>
                )}
                {actions.delete && (
                  <button
                    className="flex hover:brightness-90"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      showDangerModal({
                        title: `Warning`,
                        message: `Are you sure you want to delete this ${itemName}?`,
                        onSubmit: () => {
                          if (onDelete) onDelete(item, i);
                        },
                      });
                    }}
                  >
                    <img
                      alt="delete"
                      src={p('icons/delete_icon.svg')}
                      width={24}
                      height={24}
                    />
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
