import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
  defaults: {
    colorUnknown: `hsl(40, 88%, 88%)`,
    colorAdded: `hsla(80, 100%, 85%, 0.8)`,
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ],
  logging: true
});
