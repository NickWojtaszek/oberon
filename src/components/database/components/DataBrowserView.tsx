import { DataBrowser } from '../../DataBrowser';

interface DataBrowserViewProps {
  protocolNumber?: string;
  protocolVersion?: string;
  onEditRecord?: () => void;
}

export function DataBrowserView({ protocolNumber, protocolVersion, onEditRecord }: DataBrowserViewProps) {
  return (
    <DataBrowser
      protocolNumber={protocolNumber}
      protocolVersion={protocolVersion}
      onViewRecord={onEditRecord}
    />
  );
}
