// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Permet de résoudre les fichiers .cjs (nécessaire pour certains modules Firebase)
config.resolver.sourceExts.push('cjs');

// Désactive la résolution par "package exports", pour autoriser l'initialisation de Firebase Auth
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
