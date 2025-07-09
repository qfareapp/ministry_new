// src/constants/categories.js

import {
  FaHeart,
  FaBookOpen,
  FaIndustry,
  FaBusAlt,
  FaMicrochip,
  FaBalanceScale,
  FaLandmark,
  FaUsers,
  FaCity,
  FaMapMarkedAlt,
  FaGlobeAsia,
  FaNewspaper,
  FaFlag,
} from "react-icons/fa";

const categories = [
  { name: "Healthcare", icon: <FaHeart /> },
  { name: "Education", icon: <FaBookOpen /> },
  { name: "Industry & Economy", icon: <FaIndustry /> },
  { name: "Transport & Mobility", icon: <FaBusAlt /> },
  { name: "Technology & Innovation", icon: <FaMicrochip /> },
  { name: "Governance & Policy", icon: <FaBalanceScale /> },
  { name: "Culture & Heritage", icon: <FaLandmark /> },
  { name: "Peoples Voices", icon: <FaUsers /> },
  { name: "India", icon: <FaFlag /> },
  { name: "West Bengal", icon: <FaMapMarkedAlt /> },
  { name: "Kolkata", icon: <FaCity /> },
  { name: "Global", icon: <FaGlobeAsia /> },
  { name: "Newspresso", icon: <FaNewspaper /> },
];

export default categories;
