import { useMemo, useState } from 'react';
import { c, showDangerModal } from '../../lib';
import { ExamCustomContentType } from '../../types';
import { Button, Input, LabeledBox, TextArea } from '../common';
import HorizontalRadio from '../common/HorizontalRadio';

interface CustomContentTabProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'none' | ExamCustomContentType;
  setType: (type: 'none' | 'text' | 'image' | 'tabs') => void;
  customContent: {
    text: string;
    image: string;
    tabs: { tab: string; content: string }[];
  };
  setContent: (content: {
    text: string;
    image: string;
    tabs: { tab: string; content: string }[];
  }) => void;
}

type TabContent = { tab: string; content: string };

const CustomContentTab: React.FC<CustomContentTabProps> = ({
  type,
  setType,
  customContent: content,
  setContent,
  ...rest
}) => {
  console.log(content);

  const [selectedTabIndex, setSelectedTabIndex] = useState<number | undefined>(
    undefined
  );
  const [currentTab, setCurrentTab] = useState<TabContent>({
    tab: '',
    content: '',
  });

  const imageUrl = useMemo(() => {
    if (type === 'image') {
      try {
        new URL(content.image);

        return content.image;
      } catch {
        return undefined;
      }
    }
  }, [type, content.image]);

  return (
    <div {...rest} className={c('p-8', rest.className)}>
      <LabeledBox label="Content type:" className="w-1/4">
        <HorizontalRadio
          className="w-full"
          options={[
            { key: 'none', label: 'None' },
            { key: 'text', label: 'Text' },
            { key: 'image', label: 'Image' },
            { key: 'tabs', label: 'Tabs' },
          ]}
          selectedOptionKey={type}
          onOptionSelect={(type) =>
            setType(type as 'none' | 'text' | 'image' | 'tabs')
          }
        />
      </LabeledBox>
      {type !== 'none' && (
        <>
          <div className="mt-8">
            {type === 'text' && (
              <TextArea
                className="h-64 w-full whitespace-pre-wrap"
                placeholder="Enter text content here:"
                value={content.text}
                onChange={(e) =>
                  setContent({ ...content, text: e.target.value })
                }
              />
            )}
            {type === 'image' && (
              <>
                <Input
                  className="w-full"
                  placeholder="Enter image URL here:"
                  value={content.image}
                  onChange={(e) =>
                    setContent({ ...content, image: e.target.value })
                  }
                />
              </>
            )}
            {type === 'tabs' && (
              <>
                <div className="flex gap-2">
                  <button
                    className={c(
                      'relative rounded-t-md border border-b-0 border-themeLightGray bg-themeLightGray px-4 py-2',
                      selectedTabIndex === undefined
                        ? 'top-[1px] z-10 !bg-white'
                        : 'top-2'
                    )}
                    onClick={() => setSelectedTabIndex(undefined)}
                  >
                    New Tab
                  </button>
                  {content.tabs.map((tab, i) => (
                    <button
                      className={c(
                        'relative rounded-t-md border border-b-0 border-themeLightGray bg-themeLightGray px-4 py-2',
                        selectedTabIndex === i
                          ? 'top-[1px] z-10 !bg-white'
                          : 'top-2'
                      )}
                      onClick={() => setSelectedTabIndex(i)}
                      key={i}
                    >
                      {tab.tab}
                    </button>
                  ))}
                </div>
                <div className="relative flex flex-col gap-4 rounded-md rounded-tl-none border border-themeLightGray bg-white p-2">
                  <Input
                    placeholder="Tab name here:"
                    value={
                      selectedTabIndex === undefined
                        ? currentTab.tab
                        : content.tabs[selectedTabIndex].tab
                    }
                    onChange={(e) => {
                      if (selectedTabIndex === undefined)
                        setCurrentTab({ ...currentTab, tab: e.target.value });
                      else {
                        const newContent = { ...content };

                        newContent.tabs[selectedTabIndex].tab = e.target.value;

                        setContent(newContent);
                      }
                    }}
                  />
                  <TextArea
                    className="h-44 whitespace-pre-wrap"
                    placeholder="Tab content here:"
                    value={
                      selectedTabIndex === undefined
                        ? currentTab.content
                        : content.tabs[selectedTabIndex].content
                    }
                    onChange={(e) => {
                      if (selectedTabIndex === undefined)
                        setCurrentTab({
                          ...currentTab,
                          content: e.target.value,
                        });
                      else {
                        const newContent = { ...content };

                        newContent.tabs[selectedTabIndex].content =
                          e.target.value;

                        setContent(newContent);
                      }
                    }}
                  />
                  {selectedTabIndex === undefined ? (
                    <Button
                      look="green"
                      className="self-start"
                      disabled={!currentTab.tab || !currentTab.content}
                      onClick={() => {
                        setContent({
                          ...content,
                          tabs: [...content.tabs, currentTab],
                        });

                        setCurrentTab({ tab: '', content: '' });
                      }}
                    >
                      Add Tab
                    </Button>
                  ) : (
                    <Button
                      className="self-start"
                      look="red"
                      onClick={() =>
                        showDangerModal({
                          title: 'Warning',
                          message: 'Are you sure you want to delete this tab?',
                          onSubmit() {
                            const newTabs = [...content.tabs];

                            newTabs.splice(selectedTabIndex, 1);

                            setSelectedTabIndex(
                              selectedTabIndex === 0
                                ? undefined
                                : selectedTabIndex - 1
                            );
                            setContent({ ...content, tabs: newTabs });
                          },
                        })
                      }
                    >
                      Delete Tab
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
          {type === 'image' && imageUrl && (
            <div className="mt-8 h-96 w-3/4">
              {type === 'image' && (
                <img alt="preview" className="h-full" src={imageUrl} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomContentTab;
