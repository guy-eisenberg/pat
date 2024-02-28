import { fetchUserStrategy } from "./api";
import { DashboardCard, DashboardSidebar } from "./components";
import { useQuery } from "./hooks";
import { c, p } from "./lib";

const NAVIGATION_BUTTONS: {
  icon: string;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    icon: "icons/activities.svg",
    title: "Activities",
    description:
      "Activities sorted in to suitability for tests, organisations and skills.",
    href: import.meta.env.VITE_ACTIVITIES_URL,
  },
  {
    icon: "icons/performance.svg",
    title: "Performance",
    description:
      "Track your performance, by activity or skill, day-by-day and hourly.",
    href: import.meta.env.VITE_PERFORMANCE_URL,
  },
  {
    icon: "icons/planner.svg",
    title: "Planner",
    description:
      "Understand your activity, week-by-week, day-by-day and hourly.",
    href: import.meta.env.VITE_PLANNER_URL,
  },
  {
    icon: "icons/targets.svg",
    title: "Targets",
    description:
      "Create, edit and track Targets you've achieved, missed or completed.",
    href: import.meta.env.VITE_TARGETS_URL,
  },
  {
    icon: "icons/tools.svg",
    title: "Tools",
    description: "Discover tools to help make the most of your preparation.",
    href: import.meta.env.VITE_TOOLS_URL,
  },
  {
    icon: "icons/help.svg",
    title: "Help",
    description: "Access the help you need to use our software effectively.",
    href: import.meta.env.VITE_HELP_URL,
  },
  {
    icon: "icons/account.svg",
    title: "Account",
    description: "View, edit and upgrade your account within our software.",
    href: import.meta.env.VITE_ACCOUNT_URL,
  },
];

const Dashboard: React.FC = () => {
  const strategy = useQuery(fetchUserStrategy, undefined);

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <TopText
        displayName={
          strategy
            ? `${strategy.first_name} ${strategy.last_name}`
            : "Welcome Back!"
        }
        subscription="Professional Subscription"
        className="flex md:hidden"
      />
      <DashboardSidebar className="h-full md:w-1/3 2xl:w-1/5" />
      <div className="border-l border-l-theme-border p-4 pb-0 md:h-full md:flex-1 md:overflow-y-auto md:pb-0 lg:px-12 lg:py-6">
        <div className="flex w-full flex-col border-b-theme-border md:block md:border-b">
          <TopText
            displayName={
              strategy
                ? `${strategy.first_name} ${strategy.last_name}`
                : "Welcome Back!"
            }
            subscription="Professional Subscription"
            className="hidden md:flex"
          />
          <DashboardCard
            className="mb-12 min-w-full max-w-full md:min-w-[unset]"
            strategy={strategy}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-12 lg:gap-8 2xl:grid-cols-4">
          {NAVIGATION_BUTTONS.map((button) => (
            <a
              href={button.href}
              className="flex items-start gap-6 rounded-[3px] border border-[#dfdfdf] bg-white p-6 transition hover:border-theme-blue hover:shadow-menu-box md:flex-col md:items-center md:gap-0 md:text-center lg:p-12"
              key={button.title}
            >
              <img
                alt="icon"
                className="mb-2 h-16 md:h-[105px]"
                src={p(button.icon)}
              />
              <div>
                <span className="mb-3 block font-inter text-base font-semibold text-[#666] md:mb-5 md:text-xl">
                  {button.title}
                </span>
                <span className="text-sm !font-normal text-[#999]">
                  {button.description}
                </span>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-[30px] flex flex-col items-center justify-between gap-y-4 border-t border-[#eee] py-[15px] text-[13px] font-semibold text-[#ccc] md:flex-row">
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
          <img
            alt="logo"
            className="h-[30px]"
            src={p("icons/footer_logo.svg")}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

interface TopTextProps extends React.HTMLAttributes<HTMLDivElement> {
  displayName: string;
  subscription: string;
}

const TopText: React.FC<TopTextProps> = ({
  displayName,
  subscription,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        "flex flex-col items-center gap-4 py-4 font-inter md:mb-4 md:flex-row md:items-baseline",
        rest.className
      )}
    >
      <span className="!text-3xl font-semibold text-[#444]">{displayName}</span>
      <span className="!text-base text-[#a8a8a8]">{subscription}</span>
    </div>
  );
};
