import React, { useEffect, useMemo, useState } from 'react';
import { deleteTarget, getUserTargets, postTarget } from './api';
import {
  Button,
  DeleteModal,
  ProgressBar,
  RetryModal,
  Tab,
  Tabbar,
  Table,
  TargetModal,
} from './components';
import { useQuery } from './hooks';
import './index.css';
import { getDatePreview, p } from './lib';
import { Target } from './types';

const App: React.FC = () => {
  const [tabActivated, setTabActivated] = useState<Tab>('active');

  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [retryModalOpen, setRetryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedRowIndex, setSelectedRowIndex] = useState<
    number | undefined
  >();

  const { data: userTargets, invalidate } = useQuery(getUserTargets, undefined);

  useEffect(() => {
    if (!tabActivated) setTabActivated('active');
  }, [tabActivated]);

  useEffect(() => () => setSelectedRowIndex(undefined), [tabActivated]);

  const tableTitle = useMemo(() => {
    switch (tabActivated) {
      case 'active':
        return 'Active Targets';
      case 'achieved':
        return 'Achieved Targets';
      case 'missed':
        return 'Missed Targets';
      default:
        return '';
    }
  }, [tabActivated]);

  const columns = useMemo(() => {
    switch (tabActivated) {
      case 'active':
        return [
          'Activity, Skill or Test',
          'Target',
          'Start Date & Time',
          'End Time & Date',
          'Progress',
        ];
      case 'achieved':
        return [
          'Activity, Skill or Test',
          'Target',
          'Achievement Time & Date',
          'Time Taken',
        ];
      case 'missed':
        return [
          'Activity, Skill or Test',
          'Target',
          'Start Date & Time',
          'End Time & Date',
          'Progress Achieved',
        ];
      default:
        return [];
    }
  }, [tabActivated]);

  const filteredTargets = useMemo(() => {
    if (!userTargets) return [];

    return userTargets.user_targets.filter(
      (target) => target.status === tabActivated
    );
  }, [tabActivated, userTargets]);

  const rows = useMemo(() => {
    if (!filteredTargets) return [];

    switch (tabActivated) {
      case 'active':
        return filteredTargets.map((target, i) => [
          <span className="font-semibold">{target.name}</span>,
          getTargetDescription(target),
          getDatePreview(target.start_time),
          getDatePreview(target.end_time),
          <ProgressBar
            progress={target.progress}
            selected={i === selectedRowIndex}
          />,
        ]);
      case 'achieved':
        return filteredTargets.map((target) => [
          <span className="font-semibold">{target.name}</span>,
          getTargetDescription(target),
          target.achieve_time ? getDatePreview(target.achieve_time) : '',
          getTimeTakenDescription(target),
        ]);
      case 'missed':
        return filteredTargets.map((target, i) => [
          <span className="font-semibold">{target.name}</span>,
          getTargetDescription(target),
          getDatePreview(target.start_time),
          getDatePreview(target.end_time),
          <ProgressBar
            progress={target.progress}
            showLabel={false}
            selected={i === selectedRowIndex}
          />,
        ]);
      default:
        return [];
    }
  }, [tabActivated, filteredTargets, selectedRowIndex]);

  if (!userTargets) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <Tabbar
          className="mb-8 inline-block"
          tabActivated={tabActivated}
          setTabActivated={setTabActivated}
        />
        <Table
          title={tableTitle}
          columns={columns}
          rows={rows}
          selectedRowIndex={selectedRowIndex}
          onRowSelect={setSelectedRowIndex}
          emptyLabel={(() => {
            switch (tabActivated) {
              case 'achieved':
                return 'You have no achieved targets.';
              case 'active':
                return 'You have no active targets.';
              case 'missed':
                return 'You have no missed targets.';
            }
          })()}
        />
        <div className="mt-8 flex flex-wrap justify-between gap-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => {
                if (selectedRowIndex !== undefined) {
                  if (tabActivated === 'active') setTargetModalOpen(true);
                  else if (tabActivated === 'missed') setRetryModalOpen(true);
                }
              }}
              disabled={
                selectedRowIndex === undefined || tabActivated === 'achieved'
              }
            >
              {tabActivated !== 'missed' ? 'Edit Target' : 'Retry Target'}
            </Button>
            <Button
              color="green"
              onClick={() => {
                setTargetModalOpen(true);
                setSelectedRowIndex(undefined);
              }}
            >
              Create New Target
            </Button>
          </div>
          <Button
            color="red"
            disabled={selectedRowIndex === undefined}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Target
          </Button>
        </div>
      </div>
      <div className="hidden flex-col items-center justify-between gap-y-4 border-t border-[#eee] py-[15px] text-[13px] font-semibold text-[#ccc] md:mt-[30px] md:flex md:flex-row">
        <ul className="flex gap-5">
          <li className="transition hover:text-[#646464]">
            <a href={import.meta.env.VITE_ABOUT_URL}>About</a>
          </li>
          <li className="transition hover:text-[#646464]">
            <a href={import.meta.env.VITE_FAQ_URL}>FAQ</a>
          </li>
          <li className="transition hover:text-[#646464]">
            <a href={import.meta.env.VITE_TERMS_URL}>Terms</a>
          </li>
          <li className="transition hover:text-[#646464]">
            <a href={import.meta.env.VITE_PRIVACY_URL}>Privacy</a>
          </li>
          <li className="transition hover:text-[#646464]">
            <a href={import.meta.env.VITE_CONTACT_URL}>Contact</a>
          </li>
        </ul>
        <img alt="logo" className="h-[30px]" src={p('icons/footer_logo.svg')} />
      </div>

      <TargetModal
        className="w-full md:w-[448px]"
        visible={targetModalOpen}
        availableTargets={userTargets.available_targets}
        hideModal={() => setTargetModalOpen(false)}
        target={
          selectedRowIndex !== undefined
            ? filteredTargets[selectedRowIndex]
            : undefined
        }
        postTarget={(target) => {
          postTarget(target).then(invalidate);
          setTargetModalOpen(false);
        }}
      />
      <RetryModal
        visible={retryModalOpen}
        hideModal={() => setRetryModalOpen(false)}
        retryTarget={() => {
          if (selectedRowIndex === undefined || tabActivated !== 'missed')
            return;

          const data = userTargets.user_targets[selectedRowIndex];

          const target = userTargets.available_targets.find(
            (target) => target.key === `${data.target_type}-${data.target_id}`
          );

          console.log(target);

          if (!target) return;

          postTarget({
            ...data,
            id: undefined,
            target: target.key,
            start_time: new Date().getTime(),
            end_time: new Date().getTime() + (data.end_time - data.start_time),
          }).then(invalidate);
          deleteTarget(data.id).then(invalidate);
          setRetryModalOpen(false);
        }}
      />
      <DeleteModal
        visible={deleteModalOpen}
        hideModal={() => setDeleteModalOpen(false)}
        deleteTarget={() => {
          if (selectedRowIndex !== undefined) {
            deleteTarget(filteredTargets[selectedRowIndex].id).then(invalidate);
            setDeleteModalOpen(false);
            setSelectedRowIndex(undefined);
          }
        }}
      />
    </div>
  );
};

export default App;

function getTargetDescription(target: Target) {
  switch (target.type) {
    case 'time':
      return `Practice for ${target.figure} hours`;
    case 'score':
      return `Achieve Score of ${target.figure}%`;
    case 'improvement':
      return `Improve Score by ${target.figure}%`;
  }
}

function getTimeTakenDescription(target: Target) {
  if (!target.achieve_time) return '';

  const secDiff = Math.ceil((target.achieve_time - target.start_time) / 1000);

  if (secDiff < 3600) return `${Math.ceil(secDiff / 60)} minutes`;
  else if (secDiff >= 3600 && secDiff < 3600 * 24)
    return `${Math.ceil(secDiff / 3600)} hours`;
  else return `${Math.ceil(secDiff / (3600 * 24))} days`;
}
