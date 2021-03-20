// eslint-disable-next-line import/prefer-default-export
export const scriptMode = () => process.env.SCRIPT
export const setScriptMode = (mode: boolean) => {
  process.env.SCRIPT = mode ? 'true' : 'false'
}
