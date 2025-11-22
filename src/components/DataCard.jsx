import React from "react";
import settings from "../settings.js";
import PropTypes from "prop-types";

const DataCard = ({ title, imageSrc, imageAlt, heightClass = "h-64" }) => {
  return (
    <div
      className={`rounded-xl p-6 ${settings.cardBg} border ${settings.cardBorder}`}
    >
      <h3 className={`${settings.activeText} text-lg font-bold mb-4`}>
        {title}
      </h3>
      <div className={`${heightClass} w-full flex items-center justify-center`}>
        <img
          alt={imageAlt}
          className="h-full w-full object-contain"
          src={imageSrc}
        />
      </div>
    </div>
  );
};

DataCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  heightClass: PropTypes.string,
};

export default DataCard;
