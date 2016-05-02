// ConvertLibraryId2RepositoryId.js
'use strict';

let ConvertLibraryId2RepositoryId = function (libraryId) {
    return libraryId.replace('assessment.Bank', 'repository.Repository');
};

module.exports = ConvertLibraryId2RepositoryId;