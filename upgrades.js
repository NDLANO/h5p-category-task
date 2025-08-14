var H5PUpgrades = H5PUpgrades || {};

/**
 * Upgrades for the Game Map content type.
 */
H5PUpgrades['H5P.CategoryTask'] = (() => {
  return {
    1: {
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
    }
  };
})();
