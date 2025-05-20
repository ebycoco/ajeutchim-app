// global.d.ts
declare module 'firebase/auth/react-native' {
  /**  
   * Pour TypeScript : réexporte tout depuis 'firebase/auth'  
   * (Metro utilisera bien le code spécifique RN)  
   */
  export * from 'firebase/auth';
}
