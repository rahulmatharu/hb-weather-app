import { SvgIconComponent } from "@mui/icons-material";

type IconWithTextProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const IconWithText: React.FC<IconWithTextProps> = ({ icon, label, value }) => {
  return (
    <li className="flex items-center gap-3 text-md">
      {icon}
      <span className="font-semibold">
        {label}: {value}
      </span>
    </li>
  );
};

export default IconWithText;
