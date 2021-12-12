import { dirname, resolve } from 'path';

/**
 * Application core.
 */
export default {
  /** CLI application path */
  CLI_PATH: resolve(dirname(require.main.filename), '../')
}
