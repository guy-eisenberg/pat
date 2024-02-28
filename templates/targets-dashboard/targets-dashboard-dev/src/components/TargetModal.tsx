import React, { useEffect, useMemo, useState } from 'react';
import { c, p } from '../lib';
import { Target, TargetData } from '../types';
import Button from './Button';
import DatetimeInput from './DatetimeInput';
import Dropdown from './Dropdown';
import HorizontalRadio from './HorizontalRadio';
import Modal, { ModalProps } from './Modal';

interface TargetModalProps extends ModalProps {
  availableTargets: {
    key: string;
    label: string;
    type: 'activity' | 'skill';
  }[];
  target: Target | undefined;
  postTarget: (target: TargetData) => void;
}

const TargetModal: React.FC<TargetModalProps> = ({
  target,
  availableTargets,
  postTarget,
  ...rest
}) => {
  const [targetName, setTargetName] = useState(availableTargets[0].key);
  const [type, setType] = useState<'time' | 'score' | 'improvement'>('time');
  const [figure, setFigure] = useState<React.Key>('');
  const [endDatetime, setEndDatetime] = useState<string | number>(
    Date.now() + 6.048e8
  );

  const figures = useMemo(() => {
    var newFigures: { key: React.Key; label: string }[] = [];

    switch (type) {
      case 'time':
        newFigures = new Array(20).fill(null).map((_, i) => ({
          key: `${i + 1}`,
          label: `${i + 1} hours`,
        }));
        break;
      case 'score':
        newFigures = new Array(100).fill(null).map((_, i) => ({
          key: `${i + 1}`,
          label: `${i + 1}% Score`,
        }));
        break;
      case 'improvement':
        newFigures = new Array(50).fill(null).map((_, i) => ({
          key: `${i + 1}`,
          label: `${i + 1}% Improvement`,
        }));
        break;
    }

    if (target === undefined) setFigure(newFigures[0].key);

    return newFigures;
  }, [target, type]);

  useEffect(() => {
    if (target !== undefined) {
      setTargetName(`${target.target_type}-${target.target_id}`);
      setType(target.type);
      setFigure(`${target.figure}`);
      setEndDatetime(target.end_time);
    }
  }, [target]);

  return (
    <Modal {...rest} className={c('text-theme-dark-gray', rest.className)}>
      <div className="relative w-full p-4">
        <button
          className="absolute right-0 top-0 text-2xl text-theme-light-gray"
          onClick={rest.hideModal}
        >
          <img
            src={p('icons/icon_close.svg')}
            className="h-6 w-6"
            alt="close icon"
          />
        </button>
        <span className="mb-10 block text-2xl font-semibold">
          {target ? 'Edit Target' : 'Create New Target'}
        </span>
        <div className="mb-8">
          <span className="mb-4 block font-semibold">
            Activity, Skill or Test:
          </span>

          <Dropdown
            className="w-full"
            options={availableTargets.map((target) => ({
              key: target.key,
              label: `${target.label} (${
                target.type.charAt(0).toUpperCase() + target.type.slice(1)
              })`,
            }))}
            selected={targetName}
            onOptionChange={setTargetName}
          />
        </div>
        <div className="mb-8">
          <p className="mb-4 font-semibold">I want to set a target for:</p>
          <HorizontalRadio
            options={[
              { key: 'time', label: 'Time' },
              { key: 'score', label: 'Score' },
              { key: 'improvement', label: 'Improvement' },
            ]}
            selectedOptionKey={type}
            onOptionSelect={(type) =>
              setType(type as 'time' | 'score' | 'improvement')
            }
          />
        </div>
        <div className="mb-8">
          <p className="mb-4 font-semibold">
            {(() => {
              switch (type) {
                case 'time':
                  return 'I want to practice for:';
                case 'score':
                  return 'I want to achieve a score of:';
                case 'improvement':
                  return 'I want to improve by:';
              }
            })()}
          </p>
          <Dropdown
            className="w-full"
            options={figures}
            selected={figure}
            onOptionChange={setFigure}
          />
        </div>
        <div className="mb-14">
          <p className="mb-4 font-semibold">
            I want to achieve this target by:
          </p>
          <DatetimeInput
            className="w-full"
            type="datetime-local"
            value={endDatetime}
            onChange={(e) => setEndDatetime(e.target.value)}
          />
        </div>
        <Button
          color="green"
          onClick={() => {
            postTarget({
              id: target?.id,
              target: targetName,
              type,
              figure: figure as number,
              start_time: target?.start_time,
              end_time: new Date(endDatetime).getTime(),
            });
          }}
        >
          {target !== undefined ? 'Update Target' : 'Set Target'}
        </Button>
      </div>
    </Modal>
  );
};

export default TargetModal;
