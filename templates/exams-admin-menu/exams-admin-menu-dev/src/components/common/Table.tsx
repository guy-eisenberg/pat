import { c, p, showDangerModal } from '../../lib';

type RowActionHandler<T> = (item: T, index: number) => void;

interface TableProps<T = any>
  extends React.TableHTMLAttributes<HTMLTableElement> {
  data: T[];
  columns: string[];
  renderRow: (item: T, index: number) => (string | number | React.ReactNode)[];
  actions?:
    | false
    | {
        score?: true;
        questions?: true;
        parameters?: true;
        delete?: true;
      };
  itemName: string;
  onScoreClick?: RowActionHandler<T>;
  onQuestionsClick?: RowActionHandler<T>;
  onParametersClick?: RowActionHandler<T>;
  onDelete?: RowActionHandler<T>;
  selectedRowIndex?: number;
  onRowSelect?: (index: number) => void;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  renderRow,
  itemName,
  actions = {
    score: true,
    questions: true,
    parameters: true,
    delete: true,
  },
  onScoreClick,
  onQuestionsClick,
  onParametersClick,
  onDelete,
  selectedRowIndex,
  onRowSelect,
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
            <th key={column} className="px-10 py-2 text-left">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr
            key={i}
            className={c(
              'border-b border-themeLightGray bg-white transition last:border-none',
              onRowSelect ? 'cursor-pointer hover:brightness-95' : undefined,
              selectedRowIndex === i ? '!bg-themeBlue text-white' : undefined
            )}
            onClick={() => {
              if (onRowSelect) onRowSelect(i);
            }}
          >
            {renderRow(item, i).map((item) => (
              <td key={i} className="px-10 py-2">
                {item}
              </td>
            ))}
            {actions && (
              <td className="flex gap-2 px-10 py-2">
                {actions.score && (
                  <button
                    className={c(
                      'flex hover:brightness-90',
                      selectedRowIndex === i
                        ? 'brightness-200 hover:brightness-100'
                        : undefined
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (onScoreClick) onScoreClick(item, i);
                    }}
                  >
                    <img
                      alt="score"
                      src={p('icons/score_icon.svg')}
                      width={24}
                      height={24}
                    />
                  </button>
                )}
                {actions.questions && (
                  <button
                    className={c(
                      'flex hover:brightness-90',
                      selectedRowIndex === i
                        ? 'brightness-200 hover:brightness-100'
                        : undefined
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (onQuestionsClick) onQuestionsClick(item, i);
                    }}
                  >
                    <img
                      alt="questions"
                      src={p('icons/questions_icon.svg')}
                      width={24}
                      height={24}
                    />
                  </button>
                )}
                {actions.parameters && (
                  <button
                    className={c(
                      'flex hover:brightness-90',
                      selectedRowIndex === i
                        ? 'brightness-200 hover:brightness-100'
                        : undefined
                    )}
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
                    className={c(
                      'flex hover:brightness-90',
                      selectedRowIndex === i
                        ? 'brightness-200 hover:brightness-100'
                        : undefined
                    )}
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
