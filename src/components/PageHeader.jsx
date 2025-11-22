// src/components/PageHeader.jsx
import React from "react";
import settings from "../settings";
import PropTypes from "prop-types";

// Component accepts props: title, subtitle, buttonText, and onButtonClick
const PageHeader = ({ title, subtitle, buttonText, onButtonClick }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1
          className={`${settings.activeText} text-4xl font-black leading-tight tracking-[-0.033em]`}
        >
          {/* Use the title prop */}
          {title}
        </h1>
        <p
          className={`${settings.emailText} text-base font-normal leading-normal`}
        >
          {/* Use the subtitle prop */}
          {subtitle}
        </p>
      </div>
      <div className="flex flex-1 justify-end gap-3 flex-wrap">
        {/* Render the button only if buttonText and onButtonClick are provided */}
        {buttonText && onButtonClick && (
          <button
            // Use the onButtonClick prop for the click handler
            onClick={onButtonClick}
            className={`flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 ${settings.activeBg} ${settings.activeText} text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#3b5445]`}
          >
            {/* Use the buttonText prop */}
            <span className="truncate">{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default PageHeader;
