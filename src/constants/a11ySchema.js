// jshint esversion:6

const accessModeList = [
    'textual',
    'visual',
    'auditory',
    'tactile' ];

const accessibilityFeatureList = [
    'alternativeText',
    'annotations',
    'audioDescription',
    'bookmarks',
    'braille',
    'captions',
    'ChemML',
    'describedMath',
    'displayTransformability',
    'highContrastAudio',
    'highContrastDisplay',
    'index',
    'largePrint',
    'latex',
    'longDescription',
    'MathML',
    'printPageNumbers',
    'readingOrder',
    'rubyAnnotations',
    'signLanguage',
    'structuralNavigation',
    'synchronizedAudioText',
    'tableOfContents',
    'taggedPDF',
    'tactileGraphic',
    'tactileObject',
    'timingControl',
    'transcript',
    'ttsMarkup',
    'unlocke' ];

const accessibilityHazardList = [
    'flashing',
    'noFlashingHazard',
    'motionSimulation',
    'noMotionSimulationHazard',
    'sound',
    'noSoundHazard',
    'unknown' ];

const accessibilityAPIList = [
    'AndroidAccessibility',
    'ARIA',
    'ATK',
    'AT-SPI',
    'BlackberryAccessibility',
    'iAccessible2',
    'iOSAccessibility',
    'JavaAccessibility',
    'MacOSXAccessibility',
    'MSAA',
    'UIAutomation' ];

const accessibilityControlList = [
    'fullKeyboardControl',
    'fullMouseControl',
    'fullSwitchControl',
    'fullTouchControl',
    'fullVideoControl',
    'fullVoiceControl' ];

module.exports.accessMode = accessModeList;
module.exports.accessibilityFeature = accessibilityFeatureList;
module.exports.accessibilityHazard = accessibilityHazardList;
module.exports.accessibilityAPI = accessibilityAPIList;
module.exports.accessibilityControl = accessibilityControlList;
