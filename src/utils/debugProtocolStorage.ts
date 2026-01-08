/**
 * 🔍 Protocol Storage Debug Utility
 * 
 * This utility helps diagnose protocol storage issues.
 * Open browser console and paste these functions to inspect storage.
 */

// Add to window for easy access in console
declare global {
  interface Window {
    debugProtocolStorage: () => void;
    inspectProtocol: (protocolId: string) => void;
    listAllProtocols: () => void;
  }
}

export function debugProtocolStorage() {
  console.log('🔍 DEBUG: Protocol Storage Analysis\n');
  
  const projectId = localStorage.getItem('clinical-intelligence-current-project');
  console.log('📂 Current Project ID:', projectId);
  
  if (!projectId) {
    console.log('❌ No current project found!');
    return;
  }
  
  const key = `protocols-${projectId}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    console.log('❌ No protocols stored for this project!');
    return;
  }
  
  try {
    const protocols = JSON.parse(stored);
    console.log(`✅ Found ${protocols.length} protocol(s)\n`);
    
    protocols.forEach((protocol: any, index: number) => {
      console.log(`\n📋 Protocol #${index + 1}:`);
      console.log('  ID:', protocol.id);
      console.log('  protocolTitle:', protocol.protocolTitle);
      console.log('  protocolNumber:', protocol.protocolNumber);
      console.log('  currentVersion:', protocol.currentVersion);
      console.log('  latestDraftVersion:', protocol.latestDraftVersion);
      console.log('  versions.length:', protocol.versions?.length || 0);
      
      // Check for old field names
      if (protocol.name || protocol.studyNumber) {
        console.log('  ⚠️  OLD FIELDS DETECTED:');
        console.log('    name:', protocol.name);
        console.log('    studyNumber:', protocol.studyNumber);
      }
      
      // Check versions
      if (protocol.versions && protocol.versions.length > 0) {
        console.log('  📦 Versions:');
        protocol.versions.forEach((v: any, vIndex: number) => {
          console.log(`    v${vIndex + 1}:`, {
            id: v.id,
            versionNumber: v.versionNumber,
            status: v.status,
            metadata: v.metadata
          });
        });
      }
    });
    
    console.log('\n\n📊 Raw Data:');
    console.log(JSON.stringify(protocols, null, 2));
    
  } catch (error) {
    console.error('❌ Failed to parse protocols:', error);
  }
}

export function inspectProtocol(protocolId: string) {
  const projectId = localStorage.getItem('clinical-intelligence-current-project');
  if (!projectId) return;
  
  const key = `protocols-${projectId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return;
  
  const protocols = JSON.parse(stored);
  const protocol = protocols.find((p: any) => p.id === protocolId);
  
  if (protocol) {
    console.log('🔍 Protocol Details:');
    console.log(JSON.stringify(protocol, null, 2));
  } else {
    console.log('❌ Protocol not found:', protocolId);
  }
}

export function listAllProtocols() {
  const projectId = localStorage.getItem('clinical-intelligence-current-project');
  if (!projectId) {
    console.log('❌ No current project');
    return;
  }
  
  const key = `protocols-${projectId}`;
  const stored = localStorage.getItem(key);
  if (!stored) {
    console.log('❌ No protocols');
    return;
  }
  
  const protocols = JSON.parse(stored);
  console.log('📋 All Protocols:');
  protocols.forEach((p: any) => {
    console.log(`  • ${p.protocolTitle || p.name || '[NO TITLE]'} (${p.id})`);
  });
}

// Expose to window for console access
if (typeof window !== 'undefined') {
  window.debugProtocolStorage = debugProtocolStorage;
  window.inspectProtocol = inspectProtocol;
  window.listAllProtocols = listAllProtocols;
}
