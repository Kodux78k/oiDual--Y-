export function createAppState() {
  return {
    initialized: false,
    isCollapsed: true,
    conversation: [],
    responseBlocks: [],
    availableVoices: [],
    voiceConfig: null,
    currentVoiceKey: 'default',
    currentUtterance: null,
    engine: {
      step: 0,
      reverse: false,
      jump: 0,
      use3697: false
    }
  };
}

export const state = createAppState();
