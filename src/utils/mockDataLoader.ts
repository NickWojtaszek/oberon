/**
 * Mock Data Loader for Testing Analytics
 * Generates realistic patient records that match the actual schema structure
 */

import { saveDataRecord, ClinicalDataRecord, getAllRecords } from './dataStorage';
import { DatabaseTable, DatabaseField } from '../components/database/utils/schemaGenerator';

// Check if mock data is already loaded
export function isMockDataLoaded(protocolNumber: string): boolean {
  const records = getAllRecords();
  return records.some(r => r.protocolNumber === protocolNumber && r.subjectId.startsWith('MOCK-'));
}

// Clear mock data for a protocol
export function clearMockData(protocolNumber: string): number {
  const records = getAllRecords();
  const mockRecords = records.filter(
    r => r.protocolNumber === protocolNumber && r.subjectId.startsWith('MOCK-')
  );

  // Get all records and filter out mock ones
  const remainingRecords = records.filter(
    r => !(r.protocolNumber === protocolNumber && r.subjectId.startsWith('MOCK-'))
  );

  localStorage.setItem('clinical-intelligence-data', JSON.stringify(remainingRecords));

  return mockRecords.length;
}

/**
 * Generate mock patients with data that matches the actual schema tables
 */
export function loadMockData(
  protocolNumber: string,
  protocolVersion: string,
  tables: DatabaseTable[]
): { success: boolean; count: number; error?: string } {
  try {
    if (!tables || tables.length === 0) {
      return { success: false, count: 0, error: 'No schema tables provided. Please ensure a protocol with schema is selected.' };
    }

    const mockPatients = generateMockPatients(tables, 20);
    let successCount = 0;

    for (const patient of mockPatients) {
      const record: Omit<ClinicalDataRecord, 'recordId' | 'collectedAt' | 'lastModified' | 'auditTrail'> = {
        protocolNumber,
        protocolVersion,
        subjectId: patient.subjectId,
        visitNumber: patient.visitNumber,
        enrollmentDate: patient.enrollmentDate,
        collectedBy: patient.collectedBy,
        status: patient.status,
        data: patient.data
      };

      const result = saveDataRecord(record);
      if (result.success) {
        successCount++;
      } else {
        console.warn(`Failed to save patient ${patient.subjectId}:`, result.error);
      }
    }

    console.log(`📊 Mock data loaded: ${successCount} patients with ${tables.length} tables`);
    return { success: true, count: successCount };
  } catch (error) {
    console.error('Failed to load mock data:', error);
    return { success: false, count: 0, error: String(error) };
  }
}

// Polish names for realistic data
const MALE_NAMES = ['Jan', 'Piotr', 'Tomasz', 'Krzysztof', 'Andrzej', 'Stanisław', 'Marek', 'Jerzy', 'Henryk', 'Ryszard', 'Wojciech', 'Adam', 'Michał'];
const FEMALE_NAMES = ['Anna', 'Maria', 'Katarzyna', 'Ewa', 'Barbara', 'Zofia', 'Danuta', 'Jadwiga', 'Teresa', 'Małgorzata', 'Agnieszka'];
const SURNAMES = ['Kowalski', 'Nowak', 'Wiśniewski', 'Dąbrowska', 'Lewandowski', 'Kamiński', 'Zielińska', 'Szymański', 'Woźniak', 'Mazur', 'Krawczyk', 'Piotrowski', 'Grabowska', 'Pawłowski', 'Michalski', 'Adamska', 'Jankowski', 'Wójcik', 'Kowalczyk', 'Sikora'];
const COLLECTORS = ['MK', 'PK', 'AB', 'JN', 'AS', 'JK'];

/**
 * Generate mock patients that match the actual schema structure
 */
function generateMockPatients(
  tables: DatabaseTable[],
  count: number = 20
): Array<{
  subjectId: string;
  visitNumber: string | null;
  enrollmentDate: string;
  collectedBy: string;
  status: 'draft' | 'complete';
  data: Record<string, Record<string, any>>;
}> {
  const patients = [];

  for (let i = 1; i <= count; i++) {
    const isMale = Math.random() > 0.4; // 60% male
    const firstName = isMale
      ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]
      : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
    const surname = SURNAMES[i - 1] || SURNAMES[Math.floor(Math.random() * SURNAMES.length)];

    // Generate realistic age (45-85 for clinical trial)
    const age = 45 + Math.floor(Math.random() * 40);
    const birthYear = 2024 - age;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

    // Enrollment date in 2024
    const enrollMonth = Math.floor(Math.random() * 10) + 1;
    const enrollDay = Math.floor(Math.random() * 28) + 1;
    const enrollmentDate = `2024-${String(enrollMonth).padStart(2, '0')}-${String(enrollDay).padStart(2, '0')}`;

    // Create patient context for consistent data generation
    const patientContext = {
      index: i,
      isMale,
      firstName,
      surname,
      age,
      birthDate,
      enrollmentDate
    };

    // Generate data for each table using actual table names and field IDs
    const data: Record<string, Record<string, any>> = {};

    for (const table of tables) {
      const tableData: Record<string, any> = {};

      for (const field of table.fields) {
        // Skip structural/base fields that are handled separately
        if (field.category === 'Structural') continue;

        // Generate appropriate value based on field metadata
        const value = generateFieldValue(field, patientContext);
        if (value !== undefined && value !== null) {
          tableData[field.id] = value;
        }
      }

      // Only add table data if it has values
      if (Object.keys(tableData).length > 0) {
        data[table.tableName] = tableData;
      }
    }

    patients.push({
      subjectId: `MOCK-${String(i).padStart(3, '0')}`,
      visitNumber: 'Baseline',
      enrollmentDate,
      collectedBy: COLLECTORS[Math.floor(Math.random() * COLLECTORS.length)],
      status: Math.random() < 0.85 ? 'complete' as const : 'draft' as const,
      data
    });
  }

  return patients;
}

/**
 * Generate appropriate field value based on field metadata and name patterns
 */
function generateFieldValue(
  field: DatabaseField,
  context: {
    index: number;
    isMale: boolean;
    firstName: string;
    surname: string;
    age: number;
    birthDate: string;
    enrollmentDate: string;
  }
): any {
  const fieldNameLower = (field.fieldName || field.id).toLowerCase();
  const displayNameLower = field.displayName.toLowerCase();

  // Pattern matching for common field types

  // Name fields
  if (fieldNameLower.includes('imie') || fieldNameLower.includes('first_name') || displayNameLower.includes('imię')) {
    return context.firstName;
  }
  if (fieldNameLower.includes('nazwisko') || fieldNameLower.includes('last_name') || fieldNameLower.includes('surname')) {
    return context.surname;
  }

  // Age
  if (fieldNameLower.includes('wiek') || fieldNameLower.includes('age')) {
    return String(context.age);
  }

  // Gender/Sex
  if (fieldNameLower.includes('plec') || fieldNameLower.includes('sex') || fieldNameLower.includes('gender')) {
    if (field.options && field.options.length > 0) {
      // Match to available options
      const maleOption = field.options.find(o => o.toLowerCase().includes('męż') || o.toLowerCase().includes('male') || o.toLowerCase() === 'm');
      const femaleOption = field.options.find(o => o.toLowerCase().includes('kob') || o.toLowerCase().includes('female') || o.toLowerCase() === 'f' || o.toLowerCase() === 'k');
      return context.isMale ? (maleOption || field.options[0]) : (femaleOption || field.options[1] || field.options[0]);
    }
    return context.isMale ? 'Mężczyzna' : 'Kobieta';
  }

  // Birth date
  if (fieldNameLower.includes('urodzeni') || fieldNameLower.includes('birth') || fieldNameLower.includes('dob')) {
    return context.birthDate;
  }

  // Date fields
  if (field.dataType === 'Date' || fieldNameLower.includes('data') || fieldNameLower.includes('date')) {
    // Generate a date around enrollment
    const baseDate = new Date(context.enrollmentDate);
    const offset = Math.floor(Math.random() * 30) - 15; // +/- 15 days
    baseDate.setDate(baseDate.getDate() + offset);
    return baseDate.toISOString().split('T')[0];
  }

  // Height
  if (fieldNameLower.includes('wzrost') || fieldNameLower.includes('height')) {
    const height = context.isMale ? 165 + Math.floor(Math.random() * 25) : 155 + Math.floor(Math.random() * 20);
    return String(height);
  }

  // Weight
  if (fieldNameLower.includes('masa') || fieldNameLower.includes('waga') || fieldNameLower.includes('weight')) {
    const weight = context.isMale ? 70 + Math.floor(Math.random() * 35) : 55 + Math.floor(Math.random() * 30);
    return String(weight);
  }

  // BMI
  if (fieldNameLower.includes('bmi')) {
    return (22 + Math.random() * 10).toFixed(1);
  }

  // Study/Case number
  if (fieldNameLower.includes('numer') || fieldNameLower.includes('number') || fieldNameLower.includes('id') || fieldNameLower.includes('kod')) {
    return `STUDY-2024-${String(context.index).padStart(3, '0')}`;
  }

  // Initials
  if (fieldNameLower.includes('inicjaly') || fieldNameLower.includes('initials')) {
    return COLLECTORS[Math.floor(Math.random() * COLLECTORS.length)];
  }

  // Handle by data type
  switch (field.dataType) {
    case 'Boolean':
      return Math.random() < 0.3; // 30% true for most boolean fields

    case 'Categorical':
      if (field.options && field.options.length > 0) {
        return field.options[Math.floor(Math.random() * field.options.length)];
      }
      return null;

    case 'Continuous':
      // Generate within range if specified
      const min = field.minValue ?? 0;
      const max = field.maxValue ?? 100;
      const value = min + Math.random() * (max - min);
      return value.toFixed(1);

    case 'Text':
      // Generate placeholder text for text fields
      if (fieldNameLower.includes('uwagi') || fieldNameLower.includes('comment') || fieldNameLower.includes('note')) {
        return Math.random() < 0.2 ? 'Bez uwag' : '';
      }
      return '';

    case 'Multi-Select':
      if (field.options && field.options.length > 0) {
        // Select 1-3 random options
        const numSelections = 1 + Math.floor(Math.random() * Math.min(3, field.options.length));
        const shuffled = [...field.options].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, numSelections);
      }
      return [];

    default:
      return null;
  }
}
