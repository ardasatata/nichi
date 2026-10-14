export type Option = { value: string; label: string };

export type SettingRowProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};
