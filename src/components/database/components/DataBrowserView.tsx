import { DataBrowser } from '../../DataBrowser';
import type { ClinicalDataRecord } from '../../../utils/dataStorage';
import type { DatabaseTable } from '../utils/schemaGenerator';

interface DataBrowserViewProps {
  protocolNumber?: string;
  protocolVersion?: string;
  onEditRecord?: (record: ClinicalDataRecord) => void;
  tables?: DatabaseTable[];
}

export function DataBrowserView({ protocolNumber, protocolVersion, onEditRecord, tables }: DataBrowserViewProps) {
  return (
    <DataBrowser
      protocolNumber={protocolNumber}
      protocolVersion={protocolVersion}
      onViewRecord={onEditRecord || (() => {})}
      tables={tables}
    />
  );
}
