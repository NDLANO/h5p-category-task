var H5PUpgrades = H5PUpgrades || {};

/**
 * Upgrades for the Game Map content type.
 */
H5PUpgrades['H5P.CategoryTask'] = (() => {
  return {
    0: {
      /**
       * Asynchronous content upgrade hook.
       * Introduces the mode parameter.
       * @param {object} parameters Content parameters.
       * @param {function} finished Callback when finished.
       * @param {object} extras Extra parameters such as metadata, etc.
       */
      4: (parameters, finished, extras) => {

        if (parameters) {
          parameters.mode = (parameters.makeDiscussion) ? 'discussion' : 'category';
          delete parameters.makeDiscussion;
        }

        finished(null, parameters, extras);
      },
      /**
       * Synchronous content upgrade hook.
       * Remove the mode parameter and convert categoriesList from array of strings to array of objects.
       * @param {object} parameters Content parameters.
       * @param {function} finished Callback when finished.
       * @param {object} extras Extra parameters such as metadata, etc.
       */
      7: (parameters, finished, extras) => {
        if (parameters) {
          if (parameters.mode === 'discussion') {
            parameters.categoriesList = [
              {
                name: parameters.l10n?.argumentsFor || 'Arguments for DEF',
                colorBackground: '#256D1D'
              },
              {
                name: parameters.l10n?.argumentsAgainst || 'Arguments against DEF',
                colorBackground: '#a13236'
              },
            ];
          }
          else {
            if (Array.isArray(parameters.categoriesList)) {
              parameters.categoriesList = parameters.categoriesList
                .filter((category) => typeof category === 'string')
                .map((category) => ({
                  name: category,
                  colorBackground: '#517aa4;',
                }));
            }
            else {
              parameters.categoriesList = [];
            }
          }

          delete parameters.mode;
        }

        finished(null, parameters, extras);
      }
    }
  };
})();
