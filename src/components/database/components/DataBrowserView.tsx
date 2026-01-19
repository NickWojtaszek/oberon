import { DataBrowser } from '../../DataBrowser';
import type { ClinicalDataRecord } from '../../../utils/dataStorage';

interface DataBrowserViewProps {
  protocolNumber?: string;
  protocolVersion?: string;
  onEditRecord?: (record: ClinicalDataRecord) => void;
}

export function DataBrowserView({ protocolNumber, protocolVersion, onEditRecord }: DataBrowserViewProps) {
  return (
    <DataBrowser
      protocolNumber={protocolNumber}
      protocolVersion={protocolVersion}
      onViewRecord={onEditRecord || (() => {})}
    />
  );
}
