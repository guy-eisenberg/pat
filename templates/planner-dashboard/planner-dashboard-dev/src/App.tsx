import React from 'react';
import { Calendar } from './components';
import './index.css';
import { p } from './lib';

const App: React.FC = () => {
  return (
    <div className="flex h-full flex-col md:p-8">
      <Calendar className="flex min-h-0 flex-1 flex-col" />
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
    </div>
  );
};

export default App;
