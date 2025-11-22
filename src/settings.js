const settings = {
  API_BASE_URL:
    "https://diamate-edh9dcadbffdfack.francecentral-01.azurewebsites.net/api/",
  // Utility Classes
  logo: "./src/assets/logo.png",
  intro: "./src/assets/intro.png",
  sensor: "./src/assets/sensor.png",
  phone: "./src/assets/phone.png",

  // --- Theme Colors and Utility Classes (Updated from code.html for dashboard look) ---
  // Backgrounds
  darkMode: "bg-[#102218]", // Main background color from code.html background-dark
  sidebarBg: "bg-[#111814]", // Sidebar background color from code.html aside
  activeBg: "bg-[#28392f]", // Active link/chat bubble background color
  hoverBg: "hover:bg-[#28392f]/80", // Hover background color

  // Dashboard Card Colors
  cardBg: "bg-[#1A2D22]", // Background for Glucose/Chat cards
  cardBorder: "border-[#3b5445]", // Border/Divider color for cards and chat box
  timeFilterActiveBg: "bg-[#3b5445]", // Background for the active time filter button (e.g., 12h)

  // Text & Borders
  accentGreen: "text-[#13ec6d]", // Primary color from code.html, used for accents
  borderDark: "border-white/10", // Border color for separators (used in sidebar)
  inactiveText: "text-white/70", // Inactive link text color
  activeText: "text-white", // Active link text color
  emailText: "text-[#9db9a8]", // User email text color

  // Existing Utility Classes (Retained)
  bg_green: "bg-green-400",
  bg_dark_blue: "bg-[#161b22]",
  bg_dark_green: "bg-green-700",
  bg_dark_gray: "bg-gray-700",
  border_green: "border-green-400",
  border_dark_green: "border-green-700",
  text_gray: "text-[#8b949e]",
  text_green: "text-green-400",
  text_white: "text-white",

  // New Dynamic Content Structures
  navigation: [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how_it_works" },
    { name: "Pricing", href: "#pricing" },
  ],

  how_it_works: [
    {
      icon: "FaWifi",
      title: "1. Wear The Sensor",
      description:
        "Apply for the discreet arm sensor for continuous, real-time glucose monitoring.",
    },
    {
      icon: "FaBrain",
      title: "2. Get AI insights",
      description:
        "Our AI analyzes your data to provide personalized advice and predictive alerts.",
    },
    {
      icon: "FaLeaf",
      title: "3. Live Healthier",
      description:
        "Take control of your health with actionable insights and a simpler daily routine.",
    },
  ],

  core_features: [
    {
      icon: "FaHeadSideVirus",
      title: "Personalized AI Assistance",
      description:
        "Our smart AI learns your unique patterns to provide predictive glucose alerts, meal suggestions, and activity recommendations, helping you stay ahead.",
    },
    {
      icon: "FaAtom",
      title: "Real-Time Sensor Monitoring",
      description:
        "The discreet arm sensor continuously tracks your glucose levels, sending real-time data directly to your app without painful finger pricks.",
    },
    {
      icon: "FaSeedling",
      title: "Effortless Food Logging",
      description:
        "Simply snap a photo of your meal, and our AI will identify the food, estimate nutritional info, and log it for you. It's that easy.",
    },
  ],

  detailed_features: [
    {
      icon: "FaSearch",
      title: "Advanced Data Analytics",
      description:
        "Visualize your trends with easy-to-read charts and reports. Understand how food, exercise, and medication impact your levels to make informed decisions.",
    },
    {
      icon: "FaShareNodes",
      title: "Share with Your Care Team",
      description:
        "Securely share your data and progress reports with your doctor or family members, ensuring everyone is on the same page with your health journey.",
    },
    {
      icon: "FaRepeat",
      title: "Seamless Integration",
      description:
        "Diamate syncs effortlessly with other health apps and devices, creating a comprehensive overview of your health in one convenient place.",
    },
  ],

  // Existing Data Structures
  cards: {
    card1: {
      title: "Monthly",
      description: "Flexibility for your needs, cancel anytime.",
      price: "$79",
      per: "month",
      features: [
        "1 Diamate Sensor per month",
        "AI Personal Assistant",
        "Predictive Glucose Alerts",
        "Meal & Activity Logging",
        "Basic Reporting",
      ],
    },
    card2: {
      title: "Quarterly",
      description: "A balanced option for committed users.",
      price: "$69",
      per: "month",
      features: [
        "3 Diamate Sensors per quarter",
        "AI Personal Assistant",
        "Predictive Glucose Alerts",
        "Meal & Activity Logging",
        "Advanced Reporting",
      ],
    },
    card3: {
      title: "Annually",
      description: "Save big with our best value plan.",
      price: "$59",
      per: "month",
      features: [
        "12 Diamate Sensors per year",
        "AI Personal Assistant",
        "Predictive Glucose Alerts",
        "Meal & Activity Logging",
        "Advanced Reporting & Trends",
      ],
    },
  },
  questions: {
    q1: {
      summary: "Is there a free trial?",
      detail:
        "Yes, we offer a 14-day free trial that includes one sensor and full access to the Diamate app. You can experience the full benefits before committing to a plan.",
    },
    q2: {
      summary: "How does the sensor subscription work?",
      detail:
        "Based on your chosen plan, we will automatically ship you the required number of sensors to ensure you never run out. Shipments are processed to arrive just before you need your next sensor.",
    },
    q3: {
      summary: "Can I cancel my subscription?",
      detail:
        "Absolutely. You can cancel your subscription at any time through your account settings. If you are on a monthly plan, the cancellation will take effect at the end of the current billing cycle. For quarterly and annual plans, access will continue until the end of the pre-paid period.",
    },
    q4: {
      summary: "Is Diamate covered by insurance?",
      detail:
        "We are actively working with insurance providers to get Diamate covered. Currently, coverage varies by provider and plan. We recommend checking with your insurance company. We can also provide you with an itemized receipt for potential reimbursement.",
    },
  },
};

export default settings;
