import React from "react";
import settings from "./settings";
import { ChevronDown } from "lucide-react";
import {
  FaBrain,
  FaWifi,
  FaLeaf,
  FaQuoteRight,
  FaHeadSideVirus,
  FaAtom,
  FaSeedling,
  FaSearch,
} from "react-icons/fa";
import { FaRepeat, FaShareNodes } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// Map string names from settings.js to actual React Icons components
const IconMap = {
  FaBrain: FaBrain,
  FaWifi: FaWifi,
  FaLeaf: FaLeaf,
  FaHeadSideVirus: FaHeadSideVirus,
  FaAtom: FaAtom,
  FaSeedling: FaSeedling,
  FaSearch: FaSearch,
  FaShareNodes: FaShareNodes,
  FaRepeat: FaRepeat,
};

const Interface = () => {
  const [activeCard, setActiveCard] = React.useState(1);
  const [darkMode, setDarkMode] = React.useState("light");
  const navigate = useNavigate();
  return (
    <div
      className={`
        mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col scroll-smooth ${
          darkMode === "dark" ? `${settings.darkMode}` : "bg-white"
        }
      `}
    >
      <header
        className={`flex flex-col sm:flex-row items-center justify-between py-2 sm:py-4 px-4 sm:px-8 sticky top-0 z-50 scroll-smooth transition-colors duration-500 ${
          // Added transition
          darkMode === "dark"
            ? `${settings.darkMode} border-b ${settings.border_dark_green} text-white`
            : "bg-white font-bold shadow-md" // Added shadow for light mode
        }`}
      >
        <div className="logo flex items-center justify-evenly gap-2 mb-3">
          <img
            src={`${settings.logo}`}
            className="w-[30px] transition-transform duration-500 hover:rotate-6 hover:scale-[1.1] cursor-pointer rounded-full" // Increased animation and added rounded-full
            onClick={() => {
              setDarkMode(darkMode === "light" ? "dark" : "light");
            }}
            alt=""
          />
          <a href="#intro">DiaMate</a>
        </div>
        {/* Dynamic Navigation Links */}
        <ul className="sections flex flex-wrap justify-center sm:justify-between gap-4 sm:gap-8 mb-3 text-sm sm:text-base">
          {settings.navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="hover:text-green-500 transition-colors duration-200 p-2 rounded-lg hover:bg-black/10" // Added rounded background on hover
            >
              {item.name}
            </a>
          ))}
        </ul>
        <div className="sign-in flex items-center justify-center gap-3 mb-3 w-full sm:w-auto">
          <button
            className={`p-2 rounded-xl transition-colors duration-200 ${
              darkMode === "dark"
                ? `${settings.bg_dark_gray} hover:bg-gray-600`
                : "hover:text-green-500"
            }`}
            onClick={() => {
              navigate("/login");
            }}
          >
            Log In
          </button>
          <button
            className={`p-3 rounded-xl ${
              settings.bg_green
            } transition-transform duration-300 hover:scale-[1.05] active:scale-[0.98] ${
              // Increased rounding and padding
              darkMode === "dark"
                ? "font-bold text-black"
                : "shadow-md hover:shadow-lg"
            }`}
            onClick={() => navigate("/registration")}
          >
            Sign Up
          </button>
        </div>
      </header>
      <main
        className={`flex-1 py-6 ${darkMode === "dark" ? "text-white" : ""}`}
      >
        <section
          id="intro"
          className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 text-center sm:text-left animate-fadeIn animation-delay-300" // Added fadeIn animation
        >
          <div className="flex flex-col items-center md:items-start justify-center max-w-md lg:max-w-[500px] w-full">
            <h2 className="font-extrabold mb-5 text-4xl sm:text-5xl">
              Smarter Diabetes Management, Simpler Life
            </h2>
            <p
              className={`mb-5 ${
                darkMode === "dark" ? settings.text_gray : ""
              }`}
            >
              The AI-powered assistant and continuous glucose monitor that
              personalize your care
            </p>
            <button
              className={`font-bold w-full max-w-sm sm:min-w-[350px] p-3 rounded-2xl text-center ${
                // Increased rounding
                settings.bg_green
              } text-lg transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] ${
                // Added transform effect
                darkMode === "dark"
                  ? "text-black"
                  : "shadow-xl hover:shadow-2xl"
              }`}
              onClick={() => {
                navigate("/registration");
              }}
            >
              Get Started For Free
            </button>
          </div>
          <img
            src={`${settings.intro}`}
            className="max-w-[300px] hidden rounded-2xl md:block mt-6 sm:mt-0 shadow-2xl animate-slideInRight" // Increased rounding
            alt=""
          />
        </section>

        {/* Dynamic How It Works Section */}
        <section
          id="how_it_works"
          className="flex flex-col items-center gap-8 pt-10"
        >
          <h2 className="font-bold mb-5 mt-10 sm:mt-20 text-3xl sm:text-4xl animate-slideInUp">
            How Diamate Works
          </h2>
          <div className="mb-0 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-center">
            {settings.how_it_works.map((item, index) => {
              const IconComponent = IconMap[item.icon];
              return (
                <div
                  key={item.title}
                  className={`p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl animate-fadeIn delay-${
                    index * 200
                  } ${
                    // Added hover effect and staggered fadeIn
                    darkMode === "dark"
                      ? "border rounded-2xl border-gray-700 hover:border-green-400"
                      : "shadow-lg rounded-2xl hover:shadow-2xl" // Increased rounding
                  }`}
                >
                  <span className="text-3xl inline-block mb-2">
                    {IconComponent && <IconComponent />}
                  </span>
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <p
                    className={`${
                      darkMode === "dark" ? `${settings.text_gray}` : ""
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <h2 className="font-bold mt-10 sm:mt-20 text-3xl sm:text-4xl text-center px-4 animate-slideInUp">
            Personalized Care at Your Fingertips
          </h2>
          <p
            className={`text-center max-w-xl px-4 animate-fadeIn delay-300 ${
              darkMode === "dark" ? settings.text_gray : ""
            }`}
          >
            Diamate is more than just a monitor. It's a smart companion that
            learns about you to provide the support you need, exactly when you
            need it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full px-4 mt-8">
            <div className="flex flex-col items-center text-center animate-slideInLeft delay-500">
              {" "}
              {/* Added slideInLeft */}
              <div className="h-[250px] sm:h-[300px] relative rounded-3xl overflow-hidden w-full max-w-md shadow-xl transition-shadow duration-300 hover:shadow-2xl">
                {" "}
                {/* Increased rounding */}
                <img
                  src={`${settings.phone}`}
                  className="absolute top-[-60px] scale-120 left-1/2 transform -translate-x-1/2 w-full max-w-none transition-transform duration-500 hover:scale-[1.25]" // Added subtle zoom on hover
                  alt=""
                />
              </div>
              <h3 className="font-bold mt-5 text-xl">
                Your Personal AI Helper
              </h3>
              <p
                className={`max-w-md md:text-start ${
                  darkMode === "dark" ? settings.text_gray : ""
                }`}
              >
                Get intelligent meal suggestions, activity recommendations, and
                predictive alerts to prevent glucose spikes and drops.
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-slideInRight delay-500">
              {" "}
              {/* Added slideInRight */}
              <div className="h-[250px] sm:h-[300px] relative rounded-3xl overflow-hidden w-full max-w-md shadow-xl transition-shadow duration-300 hover:shadow-2xl">
                {" "}
                {/* Increased rounding */}
                <img
                  src={`${settings.sensor}`}
                  className="absolute top-[-100px] scale-100 left-1/2 transform -translate-x-1/2 w-full max-w-none transition-transform duration-500 hover:scale-[1.05]" // Added subtle zoom on hover
                  alt=""
                />
              </div>
              <h3 className="font-bold mt-5 text-xl">
                The Seamless Arm Sensor
              </h3>
              <p
                className={`max-w-md md:text-start ${
                  darkMode === "dark" ? settings.text_gray : ""
                }`}
              >
                Our easy-to-use sensor provides continuous monitoring without
                painful finger pricks. Data syncs effortlessly to your app.
              </p>
            </div>
          </div>
          <p
            className={`font-bold mt-10 max-w-3xl text-xl text-center sm:text-3xl transition-all duration-500 hover:shadow-lg ${
              // Added hover effect
              darkMode === "dark"
                ? `border p-5 rounded-3xl border-green-400`
                : "p-5 rounded-3xl shadow-xl" // Increased rounding
            }`}
          >
            <FaQuoteRight
              className={`mx-auto text-3xl transition-colors duration-300 ${settings.text_green}`}
            />
            "Diamate has been a game-changer. The predictive alerts have helped
            me avoid so many highs and lows, and I feel more in control of my
            health than ever before. It’s like having a personal diabetes coach
            24/7."
          </p>

          <h2 className="font-bold mt-10 sm:mt-20 text-3xl text-center sm:text-4xl animate-slideInUp">
            Ready to Simplify Your Life?
          </h2>
          <p
            className={`max-w-3xl text-center text-lg px-4 animate-fadeIn delay-200 ${
              darkMode === "dark" ? settings.text_gray : ""
            }`}
          >
            Join thousands of others who are taking control of their diabetes
            with smarter, personalized care. Get started with Diamate today.
          </p>
          <button
            className={`font-bold mb-10 p-3 text-xl rounded-2xl w-60 ${
              // Increased rounding
              settings.bg_green
            } transition-all duration-300 hover:scale-[1.05] hover:shadow-xl active:scale-[0.98] ${
              // Added transform effect
              darkMode === "dark" ? "text-black" : "shadow-lg"
            }`}
            onClick={() => navigate("/registration")}
          >
            Sign Up Now
          </button>
        </section>

        {/* Dynamic Core Features Section */}
        <section id="features" className="flex flex-col items-center pt-10">
          <h2 className="font-bold mb-5 mt-10 sm:mt-20 text-3xl sm:text-4xl text-center animate-slideInUp">
            A Smarter Way to Manage Diabetes
          </h2>
          <p
            className={`max-w-3xl mx-auto text-center text-lg px-4 animate-fadeIn delay-200 ${
              darkMode === "dark" ? settings.text_gray : ""
            }`}
          >
            Discover how Diamate's intelligent features work together to provide
            you with personalized insights, seamless monitoring, and peace of
            mind.
          </p>
          <div className="mt-10 sm:mt-15 mb-0 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4 text-center">
            {settings.core_features.map((feature, index) => {
              const IconComponent = IconMap[feature.icon];
              return (
                <div
                  key={feature.title}
                  className={`p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl animate-fadeIn delay-${
                    index * 200
                  } ${
                    // Added hover effect and staggered fadeIn
                    darkMode === "dark"
                      ? "border rounded-2xl border-gray-700 hover:border-green-400"
                      : "shadow-lg rounded-2xl hover:shadow-2xl" // Increased rounding
                  }`}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`text-3xl inline-block mb-2 ${
                        darkMode === "dark" ? `${settings.text_green}` : ""
                      }`}
                    />
                  )}
                  <h3 className="font-bold my-2 text-xl">{feature.title}</h3>
                  <p
                    className={`${
                      darkMode === "dark" ? settings.text_gray : ""
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dynamic Detailed Features List */}
          <div className="my-10 sm:my-20 max-w-full sm:max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 px-4">
            <div className="overflow-hidden w-full sm:w-1/2 max-w-sm sm:max-w-none flex justify-center animate-slideInLeft delay-300">
              <img
                src={`${settings.phone}`}
                className="scale-135 w-full object-cover transition-transform duration-500 hover:scale-[1.4]" // Added subtle zoom on hover
                alt="phone"
              />
            </div>
            <ul className="flex flex-col gap-6 w-full sm:w-1/2 max-w-lg animate-slideInRight delay-500">
              {settings.detailed_features.map((feature) => {
                const IconComponent = IconMap[feature.icon];
                return (
                  <li
                    key={feature.title}
                    className="p-2 transition-all duration-300 hover:translate-x-1 hover:bg-black/10 rounded-lg"
                  >
                    {" "}
                    {/* Added hover background and rounding */}
                    <h3 className="flex items-center justify-start font-bold my-2 text-xl">
                      {IconComponent && (
                        <IconComponent
                          className={`mr-2 transition-colors duration-300 ${
                            darkMode === "dark"
                              ? `${settings.text_green}`
                              : "text-green-500" // Ensure icon is green
                          }`}
                        />
                      )}
                      {feature.title}
                    </h3>
                    <p className={`text-base ${settings.text_gray}`}>
                      {feature.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Pricing Section (already dynamic, but with responsive fixes) */}
        <section id="pricing" className="pt-10">
          <h2 className="font-bold mb-5 pt-10 sm:pt-20 text-3xl sm:text-4xl text-center animate-slideInUp">
            Find the Right Plan for You
          </h2>
          <p
            className={`mx-auto text-center text-lg px-4 animate-fadeIn delay-200 ${
              darkMode === "dark" ? settings.text_white : settings.text_gray
            }`}
          >
            Choose the plan that fits your lifestyle. All plans include our
            advanced sensor and AI-powered app.
          </p>
          <div className="cards mt-10 sm:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
            {Object.values(settings.cards).map((card, index) => {
              const isActive = activeCard === index;
              return (
                <div
                  key={card.title}
                  id={"card-" + index}
                  onClick={() => setActiveCard(index)} // click event
                  className={`card flex flex-col items-center gap-4 p-6 transition-all duration-500 rounded-2xl relative cursor-pointer animate-slideInUp delay-${
                    index * 200
                  }
              ${
                isActive
                  ? `active_card border-4 ${settings.border_green} shadow-2xl scale-[1.03]` // Highlighted active card
                  : `border border-gray-200 hover:border-2 hover:${settings.border_green} hover:shadow-xl hover:scale-[1.01]` // Added hover effect
              }
              ${darkMode === "dark" ? settings.cardBg : "bg-white"}
              `}
                >
                  {/* Recommended Tag only on active card */}
                  {index == 1 && (
                    <span
                      className={`absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 text-sm font-bold text-white ${settings.bg_green} rounded-full transform rotate-3 animate-pulse shadow-md`} // Added pulse animation and shadow
                    >
                      Recommended
                    </span>
                  )}

                  <h3 className="font-bold text-2xl">{card.title}</h3>
                  <p className={`${settings.text_gray} h-5 mb-5 text-center`}>
                    {card.description}
                  </p>

                  <span className={`${settings.text_gray}`}>
                    <span
                      className={`font-bold text-4xl ${
                        darkMode === "dark" ? settings.text_white : "text-black"
                      }`}
                    >
                      {card.price}
                    </span>
                    /{card.per}
                  </span>

                  <button
                    className={`font-bold w-full p-3 rounded-xl text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      // Increased padding and rounding
                      isActive
                        ? `${settings.bg_green} text-black font-extrabold shadow-lg`
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    } ${
                      darkMode === "dark"
                        ? isActive
                          ? "text-black"
                          : `${settings.bg_dark_green} hover:bg-green-800 text-white`
                        : ""
                    }`}
                  >
                    Get Started
                  </button>

                  <ul className="text-left w-full">
                    {card.features.map((feature) => (
                      <li
                        key={feature}
                        className="my-2 flex items-start transition-colors duration-200 hover:text-green-400"
                      >
                        <span
                          className={`mr-2 pt-1 ${
                            isActive ? settings.text_green : ""
                          }`}
                        >
                          ✔
                        </span>
                        <p className="flex-1">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Dynamic FAQ Section */}
          <h2 className="font-bold mb-5 mt-10 sm:mt-20 text-3xl sm:text-4xl text-center animate-slideInUp">
            Frequently Asked Questions
          </h2>
          <p className="mb-5 mx-auto text-center text-lg px-4 animate-fadeIn delay-200">
            Have questions? We've got answers. If you need more help, feel free
            to contact us.
          </p>
          <div className="space-y-4 sm:space-y-6 max-w-3xl mt-5 mx-auto px-4 mb-20">
            {Object.values(settings.questions).map((q, index) => (
              <details
                key={index}
                className={`group ${
                  darkMode === "dark"
                    ? `${settings.bg_dark_green} shadow-md border border-gray-700`
                    : "bg-white shadow-md border border-gray-200"
                } rounded-2xl p-4 sm:p-6 transition-all duration-500 hover:shadow-xl open:border-${
                  // Increased rounding
                  settings.border_green
                } animate-fadeIn delay-${index * 100}`}
              >
                <summary
                  className={`flex items-center justify-between cursor-pointer font-semibold text-base sm:text-lg select-none transition-colors duration-300 ${
                    darkMode === "dark"
                      ? "text-white hover:text-green-400"
                      : "text-gray-800 hover:text-green-600"
                  }`}
                >
                  <span
                    className={`${
                      darkMode === "dark" ? `${settings.text_white}` : ""
                    }`}
                  >
                    {q.summary}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 group-open:rotate-180 ${
                      darkMode === "dark"
                        ? `${settings.text_white}`
                        : `${settings.text_gray}`
                    }`}
                  />
                </summary>
                <p
                  className={`mt-4 pl-1 pr-2 leading-relaxed transition-all duration-500 group-open:opacity-100 ${
                    darkMode === "dark"
                      ? `${settings.text_white}`
                      : `${settings.text_gray}`
                  }`}
                >
                  {q.detail}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="py-4 border-t border-gray-200 text-center text-sm text-gray-500"></footer>
    </div>
  );
};

export default Interface;
