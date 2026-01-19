/**
 * Mock Data Loader for Testing Analytics
 * Generates 20 realistic patient records for the Clinical Capture Schema
 */

import { saveDataRecord, ClinicalDataRecord, getAllRecords } from './dataStorage';

// Check if mock data is already loaded
export function isMockDataLoaded(protocolNumber: string): boolean {
  const records = getAllRecords();
  return records.some(r => r.protocolNumber === protocolNumber && r.subjectId.startsWith('MOCK-'));
}

// Clear mock data for a protocol
export function clearMockData(protocolNumber: string): number {
  const records = getAllRecords();
  let deletedCount = 0;

  records.forEach(r => {
    if (r.protocolNumber === protocolNumber && r.subjectId.startsWith('MOCK-')) {
      // Use localStorage directly to delete
      const allRecords = getAllRecords();
      const filtered = allRecords.filter(rec => rec.recordId !== r.recordId);
      localStorage.setItem('clinical-intelligence-data', JSON.stringify(filtered));
      deletedCount++;
    }
  });

  return deletedCount;
}

// Generate mock patients
export function loadMockData(protocolNumber: string, protocolVersion: string): { success: boolean; count: number; error?: string } {
  try {
    const mockPatients = generateMockPatients();
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

    return { success: true, count: successCount };
  } catch (error) {
    return { success: false, count: 0, error: String(error) };
  }
}

// Generate 20 realistic mock patients
function generateMockPatients(): Array<{
  subjectId: string;
  visitNumber: string | null;
  enrollmentDate: string;
  collectedBy: string;
  status: 'draft' | 'complete';
  data: Record<string, Record<string, any>>;
}> {
  const patients = [];

  // Polish names for realism
  const maleNames = ['Jan', 'Piotr', 'Tomasz', 'Krzysztof', 'Andrzej', 'Stanisław', 'Marek', 'Jerzy', 'Henryk', 'Ryszard', 'Wojciech'];
  const femaleNames = ['Anna', 'Maria', 'Katarzyna', 'Ewa', 'Barbara', 'Zofia', 'Danuta', 'Jadwiga', 'Teresa'];
  const surnames = ['Kowalski', 'Nowak', 'Wiśniewski', 'Dąbrowska', 'Lewandowski', 'Kamiński', 'Zielińska', 'Szymański', 'Woźniak', 'Mazur', 'Krawczyk', 'Piotrowski', 'Grabowska', 'Pawłowski', 'Michalski', 'Adamska', 'Jankowski', 'Wójcik', 'Kowalczyk', 'Sikora'];
  const collectors = ['MK', 'PK', 'AB', 'JN', 'AS', 'JK'];
  const centers = ['UCK', 'KRK', 'INNE'];

  for (let i = 1; i <= 20; i++) {
    const isMale = Math.random() > 0.4; // 60% male
    const firstName = isMale
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const surname = surnames[i - 1] || surnames[Math.floor(Math.random() * surnames.length)];
    const center = centers[Math.floor(Math.random() * centers.length)];

    // Generate realistic age (45-85)
    const age = 45 + Math.floor(Math.random() * 40);
    const birthYear = 2024 - age;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    // Enrollment date in 2024
    const enrollMonth = Math.floor(Math.random() * 10) + 1;
    const enrollDay = Math.floor(Math.random() * 28) + 1;
    const enrollmentDate = `2024-${String(enrollMonth).padStart(2, '0')}-${String(enrollDay).padStart(2, '0')}`;

    // Procedure date slightly after enrollment
    const procDay = enrollDay + Math.floor(Math.random() * 7);
    const procedureDate = `2024-${String(enrollMonth).padStart(2, '0')}-${String(Math.min(procDay, 28)).padStart(2, '0')}`;

    // Generate vitals
    const height = isMale ? 165 + Math.floor(Math.random() * 25) : 155 + Math.floor(Math.random() * 20);
    const weight = isMale ? 70 + Math.floor(Math.random() * 35) : 55 + Math.floor(Math.random() * 30);
    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

    // Comorbidities (more likely with age)
    const hasHypertension = Math.random() < 0.8;
    const hasCAD = Math.random() < 0.4;
    const hasDiabetes = Math.random() < 0.35;
    const hasAF = Math.random() < 0.25;
    const hasPriorStroke = Math.random() < 0.15;
    const hasCOPD = Math.random() < 0.2;

    // Indication
    const indications = ['Tętniak', 'Rozwarstwienie', 'Krwiak Śródścienny (IMH)', 'Wrzód drążący (PAU)'];
    const indicationWeights = [0.65, 0.25, 0.05, 0.05];
    let indicationIndex = 0;
    const rand = Math.random();
    let cumWeight = 0;
    for (let j = 0; j < indicationWeights.length; j++) {
      cumWeight += indicationWeights[j];
      if (rand < cumWeight) {
        indicationIndex = j;
        break;
      }
    }
    const indication = indications[indicationIndex];

    // Aneurysm size if applicable
    const aneurysmSize = indication === 'Tętniak' ? 50 + Math.floor(Math.random() * 35) : null;

    // Lab values
    const egfr = 30 + Math.floor(Math.random() * 70);
    const creatinine = egfr > 60 ? 70 + Math.floor(Math.random() * 50) : 120 + Math.floor(Math.random() * 100);
    const hemoglobin = isMale ? 12 + Math.random() * 4 : 11 + Math.random() * 3.5;

    // Outcomes
    const hadStroke = Math.random() < 0.15;
    const died = Math.random() < 0.08;
    const procedureType = Math.random() < 0.65 ? 'Planowy' : (Math.random() < 0.5 ? 'Pilny(<24h)' : 'Nagły(<2h)');

    // Device
    const devices = ['Nexus', 'Cook Arch Branch', 'Gore TAG', 'Relay Branch'];
    const device = devices[Math.floor(Math.random() * devices.length)];

    patients.push({
      subjectId: `MOCK-${String(i).padStart(3, '0')}`,
      visitNumber: 'Baseline',
      enrollmentDate,
      collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
      status: Math.random() < 0.85 ? 'complete' as const : 'draft' as const,
      data: {
        // Administrative Data
        'dane-administracyjne': {
          'numer-badania': `${center}-2024-${String(i).padStart(3, '0')}`,
          'kod-osrodka': center,
          'imie-pacjenta': firstName,
          'nazwisko-pacjenta': surname,
          'data-wlaczenia': enrollmentDate,
          'inicjaly-osoby-zbierajacej-dane': collectors[Math.floor(Math.random() * collectors.length)]
        },
        // Demographics
        'dane-demograficzne': {
          'wiek-w-dniu-zabiegu': String(age),
          'data-urodzenia': `${birthYear}-${birthMonth}-${birthDay}`,
          'plec': isMale ? 'Mężczyzna' : 'Kobieta',
          'wzrost': String(height),
          'masa-ciala': String(weight),
          'bmi-obliczone': bmi,
          'status-palenia': ['Nigdy', 'Były Palacz (>1 roku)', 'Aktualny palacz'][Math.floor(Math.random() * 3)]
        },
        // Cardiovascular comorbidities
        'uklad-sercowo-naczyniowy': {
          'choroba-wiencowa': hasCAD,
          'nadcisnienie-tetnicze': hasHypertension,
          'przebyty-zawal-serca': hasCAD && Math.random() < 0.3,
          'niewydolnosc-serca-nyha': hasCAD ? ['NYHA 1', 'NYHA 2', 'NYHA 3', 'Brak'][Math.floor(Math.random() * 4)] : 'Brak',
          'migotanie-przedsionkow': hasAF,
          'przebyta-operacja-kardiochirurgiczna': Math.random() < 0.1
        },
        // Cerebrovascular
        'uklad-mozgowo-naczyniowy': {
          'przebyty-udar-niedokrwienny': hasPriorStroke,
          'przebyty-udar-krwotoczny': hasPriorStroke && Math.random() < 0.2,
          'przebyty-tia': Math.random() < 0.1,
          'zwezenie-tetnicy-szyjnej': Math.random() < 0.15,
          'zaburzenia-poznawcze': age > 75 && Math.random() < 0.2
        },
        // Other comorbidities
        'inne-choroby': {
          'cukrzyca': hasDiabetes,
          'pochp': hasCOPD,
          'dializoterapia': egfr < 15,
          'choroba-tkanki-lacznej': Math.random() < 0.05,
          'nowotwor-zlosliwy': Math.random() < 0.08
        },
        // Baseline results
        'wyniki-wyjsciowe': {
          'wyjsciowy-egfr': egfr,
          'wyjsciowa-kreatynina': creatinine,
          'wyjsciowa-hemoglobina': hemoglobin.toFixed(1),
          'hemoglobina-po-zabiegu': (hemoglobin - 1 - Math.random() * 2).toFixed(1)
        },
        // Indications
        'glowne-wskazania': {
          'wskazanie': indication,
          'po-operacji-bentalla': Math.random() < 0.1 ? 'Tak (zastawka sztuczna)' : 'Nie'
        },
        // Aneurysm details (if applicable)
        'w-przypadku-tetniaka': indication === 'Tętniak' ? {
          'maksymalna-srednica-tetniaka': aneurysmSize,
          'lokalizacja-tetniaka': ['Aorta wstępująca', 'Łuk aorty', 'Aorta zstępująca proksymalna'][Math.floor(Math.random() * 3)],
          'kategoria-wielkosci-tetniaka': aneurysmSize! >= 80 ? '>=80 mm' : aneurysmSize! >= 70 ? '70-79mm' : aneurysmSize! >= 60 ? '60-69mm' : '50-59 mm',
          'tetniak-70mm': aneurysmSize! >= 70,
          'objawowy': Math.random() < 0.3,
          'pekniecie-ograniczone': Math.random() < 0.05
        } : {},
        // Dissection details (if applicable)
        'w-przypadku-rozwarstwienia': indication === 'Rozwarstwienie' ? {
          'klasyfikacja-stanford': Math.random() < 0.15 ? 'Typ A' : 'Typ B',
          'klasyfikacja-debakey': ['I', 'II', 'IIIa', 'IIIb'][Math.floor(Math.random() * 4)],
          'faza': ['Ostre (<14 dni)', 'Podostre(14-90 dni)', 'Przewlekłe (>90 dni)'][Math.floor(Math.random() * 3)],
          'zespol-niedokrwienia-narzadowego': Math.random() < 0.2
        } : {},
        // Aortic dimensions
        'wymiary-aorty': {
          'srednica-aorty-wstepujacej': 30 + Math.floor(Math.random() * 15),
          'srednica-luku-aorty': 35 + Math.floor(Math.random() * 15),
          'aorta-zstepujaca-przy-lsa': 25 + Math.floor(Math.random() * 10)
        },
        // Aortic morphology
        'morfologia-aorty': {
          'typ-luku-ishimaru': ['Typ I', 'Typ II', 'Typ III'][Math.floor(Math.random() * 3)],
          'aorta-shaggy': Math.random() < 0.15,
          'skrzeplina-w-luku-aorty': Math.random() < 0.1,
          'aorta-porcelanowa': Math.random() < 0.08
        },
        // Procedure data
        'czas-i-warunki': {
          'data-zabiegu': procedureDate,
          'tryb-zabiegu': procedureType,
          'miejsce-zabiegu': 'Hybrydowa sala operacyjna',
          'operator-1': collectors[Math.floor(Math.random() * collectors.length)],
          'operator-2': collectors[Math.floor(Math.random() * collectors.length)]
        },
        // Device configuration
        'konfiguracja-urzadzenia': {
          'system-stentgraftu': device,
          'rozmiar-glownego-stentgraftu': `${28 + Math.floor(Math.random() * 12)}x${120 + Math.floor(Math.random() * 80)}mm`
        },
        // Procedure parameters
        'parametry-zabiegu': {
          'czas-fluoroskopii': 30 + Math.floor(Math.random() * 50),
          'objetosc-kontrastu': 120 + Math.floor(Math.random() * 150),
          'szacowana-utrata-krwi': 200 + Math.floor(Math.random() * 500)
        },
        // Technical result
        'wynik-techniczny': {
          'sukces-techniczny': Math.random() < 0.95,
          'przeciek-typu-i': Math.random() < 0.05,
          'przeciek-typu-ii': Math.random() < 0.15,
          'przeciek-typu-iii': Math.random() < 0.02
        },
        // Neurological outcomes
        'ocena-pooperacyjna-24h': {
          'nowy-deficyt-neurologiczny': hadStroke,
          'gcs-przy-wybudzeniu': hadStroke ? 12 + Math.floor(Math.random() * 4) : 15,
          'deficyt-ruchowy': hadStroke && Math.random() < 0.6,
          'deficyt-mowy': hadStroke && Math.random() < 0.3
        },
        // Stroke (if applicable)
        'udar-30-dni': {
          'jakikolwiek-udar': hadStroke,
          'typ-udaru': hadStroke ? (Math.random() < 0.85 ? 'Niedokrwienny' : 'Krwotoczny') : null,
          'nihss-przy-rozpoznaniu': hadStroke ? Math.floor(Math.random() * 20) : null,
          'mrs-30-dni': hadStroke ? Math.floor(Math.random() * 5) : null
        },
        // Other complications
        'sercowo-naczyniowe': {
          'zawal-serca': Math.random() < 0.03,
          'nowo-migotanie-przedsionkow': Math.random() < 0.15,
          'zatrzymanie-krazenia': Math.random() < 0.02
        },
        'nerkowe': {
          'ostre-uszkodzenie-nerek': Math.random() < 0.15,
          'nowa-dializa': Math.random() < 0.03
        },
        'oddechowe': {
          'zapalenie-pluc': Math.random() < 0.1,
          'przedluzona-wentylacja': Math.random() < 0.08
        },
        // Mortality
        'zgon': {
          'zgon-30-dni': died,
          'dni-od-zabiegu': died ? Math.floor(Math.random() * 30) : null,
          'glowna-przyczyna-zgonu': died ? ['Udar', 'Posocznica', 'Niewydolność wielonarządowa', 'Pęknięcie aorty'][Math.floor(Math.random() * 4)] : null
        },
        // Follow-up
        'obserwacja': {
          'czas-obserwacji-dni': 30 + Math.floor(Math.random() * 300),
          'status-w-obserwacji': died ? 'Zgon' : (hadStroke ? 'Żyje z deficytem' : 'Żyje bez powikłań'),
          'mrs-przy-ostatniej-wizycie': died ? null : (hadStroke ? 1 + Math.floor(Math.random() * 3) : 0)
        }
      }
    });
  }

  return patients;
}
