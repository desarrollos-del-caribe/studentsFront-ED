import type { ComponentType } from "react";
import {
  // React Icons - FontAwesome
  FaBrain,
  FaChartLine,
  FaProjectDiagram,
  FaNetworkWired,
  FaSitemap,
  FaRobot,
  FaAtom,
  FaMagic,
  FaLightbulb,
  FaCogs,
  FaSearch,
  FaUsers,
  FaChartPie,
  FaChartBar,
  FaLayerGroup,
} from "react-icons/fa";

import {
  // React Icons - Material Design
  MdScience,
  MdTrendingUp,
  MdAccountTree,
  MdBubbleChart,
  MdAnalytics,
  MdDeveloperMode,
  MdMemory,
  MdAutoAwesome,
} from "react-icons/md";

import {
  // React Icons - Heroicons
  HiOutlineDatabase,
  HiOutlineLightBulb,
  HiOutlineSparkles,
  HiOutlineBeaker,
} from "react-icons/hi";

import {
  // React Icons - Bootstrap
  BsGraphUp,
  BsDiagram3,
  BsGear,
  BsLightning,
  BsTree,
} from "react-icons/bs";

import {
  // React Icons - Tabler
  TbChartDots,
  TbGitBranch,
  TbMathFunction,
  TbAnalyze,
} from "react-icons/tb";

interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

// Mapeo de nombres de iconos a componentes
const iconMap: Record<string, ComponentType<IconProps>> = {
  // Machine Learning específicos
  "linear-regression": FaChartLine,
  "logistic-regression": TbGitBranch,
  "k-means": FaNetworkWired,
  "random-forest": BsTree,
  "decision-tree": FaSitemap,
  svm: FaProjectDiagram,
  "neural-network": FaBrain,
  clustering: MdBubbleChart,

  // Análisis y datos
  brain: FaBrain,
  "chart-line": FaChartLine,
  "chart-bar": FaChartBar,
  "chart-pie": FaChartPie,
  analytics: MdAnalytics,
  data: HiOutlineDatabase,
  "trending-up": MdTrendingUp,
  "graph-up": BsGraphUp,
  "chart-dots": TbChartDots,

  // Científicos y técnicos
  science: MdScience,
  beaker: HiOutlineBeaker,
  atom: FaAtom,
  magic: FaMagic,
  robot: FaRobot,
  cogs: FaCogs,
  gear: BsGear,
  memory: MdMemory,
  function: TbMathFunction,
  analyze: TbAnalyze,

  // UI y UX
  lightbulb: FaLightbulb,
  "light-bulb": HiOutlineLightBulb,
  sparkles: HiOutlineSparkles,
  "auto-awesome": MdAutoAwesome,
  lightning: BsLightning,
  search: FaSearch,
  users: FaUsers,
  "layer-group": FaLayerGroup,

  // Diagramas y estructuras
  diagram: BsDiagram3,
  sitemap: FaSitemap,
  network: FaNetworkWired,
  "account-tree": MdAccountTree,
  "git-branch": TbGitBranch,
  "developer-mode": MdDeveloperMode,
};

interface RenderIconProps {
  icon: string;
  className?: string;
  size?: number | string;
  color?: string;
}

export default function RenderIcon({
  icon,
  className = "h-6 w-6",
  size,
  color,
}: RenderIconProps) {
  // Buscar el icono en el mapeo
  const IconComponent = iconMap[icon.toLowerCase()];

  // Si no se encuentra el icono, usar un icono por defecto
  if (!IconComponent) {
    console.warn(`Icono '${icon}' no encontrado, usando icono por defecto`);
    return <FaLightbulb className={className} size={size} color={color} />;
  }

  return <IconComponent className={className} size={size} color={color} />;
}
