// @ts-check
/**
 * afterSign hook for electron-builder.
 * - For mas/mas-dev builds: skip notarization (App Store handles it).
 * - For dmg/zip builds: notarize via @electron/notarize (requires env vars).
 */
const { notarize } = require('@electron/notarize');

/** @param {import('electron-builder').AfterPackContext} context */
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') return;

  // MAS builds (mas / mas-dev) don't need notarization
  const targetName = process.env.npm_config_target || '';
  if (targetName.includes('mas')) {
    console.log('[notarize] skipping — MAS build');
    return;
  }

  // Also detect from appOutDir path (fallback)
  if (appOutDir.includes('mas')) {
    console.log('[notarize] skipping — detected mas in appOutDir');
    return;
  }

  const appleId = process.env.APPLE_ID;
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD;
  const teamId = process.env.APPLE_TEAM_ID;

  if (!appleId || !appleIdPassword || !teamId) {
    console.log('[notarize] skipping — APPLE_ID / APPLE_APP_SPECIFIC_PASSWORD / APPLE_TEAM_ID not set');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;
  console.log(`[notarize] notarizing ${appPath}...`);

  await notarize({
    appPath,
    appleId,
    appleIdPassword,
    teamId
  });

  console.log('[notarize] done');
};
