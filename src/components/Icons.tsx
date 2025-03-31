/**
 * Common icon components using Lucide icons library
 * This file provides centralized access to all icons used in the application
 */
import React from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Map,
  Layers,
  BarChart,
  LineChart,
  Database,
  Clock,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Globe,
  Info,
  ExternalLink,
  ChevronDown as ChevronDownLucide,
  ChevronUp as ChevronUpLucide,
  ChevronRight as ChevronRightLucide,
  ChevronLeft as ChevronLeftLucide,
  Save,
  Bookmark,
  Share,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Minus,
  RefreshCw,
  Upload,
  FileText,
  Home,
  Settings,
  Book,
  Table,
  Users,
  HelpCircle,
  Grid,
  Menu,
  Copy,
  Clipboard,
  List,
  PieChart,
  BarChart2,
  Activity,
  Gauge,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  Star,
  Play,
  PlayCircle as PlayCircleLucide,
  Server as ServerLucide,
  Monitor,
  AlertTriangle
} from 'lucide-react';

/**
 * Re-export icons with consistent sizing and styling options
 */
interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
  color?: string;
  style?: React.CSSProperties;
}

// Helper function to create styled icons
const createIcon = (Icon: React.FC<any>) => {
  return ({
    size = 24,
    strokeWidth = 2,
    className,
    onClick,
    color,
    style,
  }: IconProps) => (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      onClick={onClick}
      color={color}
      style={style}
    />
  );
};

// Export all icons with consistent styling
export const SearchIcon = createIcon(Search);
export const FilterIcon = createIcon(Filter);
export const DownloadIcon = createIcon(Download);
export const CalendarIcon = createIcon(Calendar);
export const MapIcon = createIcon(Map);
export const LayersIcon = createIcon(Layers);
export const BarChartIcon = createIcon(BarChart);
export const LineChartIcon = createIcon(LineChart);
export const DatabaseIcon = createIcon(Database);
export const ClockIcon = createIcon(Clock);
export const ThermometerIcon = createIcon(Thermometer);
export const DropletsIcon = createIcon(Droplets);
export const WindIcon = createIcon(Wind);
export const SunIcon = createIcon(Sun);
export const CloudRainIcon = createIcon(CloudRain);
export const GlobeIcon = createIcon(Globe);
export const InfoIcon = createIcon(Info);
export const ExternalLinkIcon = createIcon(ExternalLink);
export const ChevronDown = createIcon(ChevronDownLucide);
export const ChevronUp = createIcon(ChevronUpLucide);
export const ChevronRight = createIcon(ChevronRightLucide);
export const ChevronLeft = createIcon(ChevronLeftLucide);
export const SaveIcon = createIcon(Save);
export const BookmarkIcon = createIcon(Bookmark);
export const ShareIcon = createIcon(Share);
export const AlertCircleIcon = createIcon(AlertCircle);
export const CheckCircleIcon = createIcon(CheckCircle);
export const ArrowRightIcon = createIcon(ArrowRight);
export const ArrowLeftIcon = createIcon(ArrowLeft);
export const XIcon = createIcon(X);
export const PlusIcon = createIcon(Plus);
export const MinusIcon = createIcon(Minus);
export const RefreshCwIcon = createIcon(RefreshCw);
export const UploadIcon = createIcon(Upload);
export const FileTextIcon = createIcon(FileText);
export const HomeIcon = createIcon(Home);
export const SettingsIcon = createIcon(Settings);
export const BookIcon = createIcon(Book);
export const TableIcon = createIcon(Table);
export const UsersIcon = createIcon(Users);
export const HelpCircleIcon = createIcon(HelpCircle);
export const GridIcon = createIcon(Grid);
export const MenuIcon = createIcon(Menu);
export const CopyIcon = createIcon(Copy);
export const ClipboardIcon = createIcon(Clipboard);
export const ListIcon = createIcon(List);
export const PieChartIcon = createIcon(PieChart);
export const BarChart2Icon = createIcon(BarChart2);
export const ActivityIcon = createIcon(Activity);
// Using BarChart2 as a replacement for Histogram since Histogram isn't available
export const HistogramIcon = createIcon(BarChart2);
export const GaugeIcon = createIcon(Gauge);
// Add back sorting icons using alternatives from lucide
export const SortAscIcon = createIcon(ArrowUpNarrowWide);
export const SortDescIcon = createIcon(ArrowDownNarrowWide);
// Add back star icons
export const StarIcon = createIcon(Star);
export const PlayIcon = createIcon(Play);
export const PlayCircle = createIcon(PlayCircleLucide);
export const Server = createIcon(ServerLucide);
// Add Monitor icon for monitoring section
export const MonitorIcon = createIcon(Monitor);
// Add AlertTriangle icon for warning states
export const AlertTriangleIcon = createIcon(AlertTriangle);
