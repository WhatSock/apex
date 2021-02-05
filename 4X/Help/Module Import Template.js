/*!
There is no required syntax for creating a standalone module. Any properly coded JavaScript file can become a module import as-needed using the $A.import() statement.

However, when creating modules that reference additional module imports, it is important to use the below Module Import Template to do so.

For a detailed explanation of $A.import() statement features, view the help file at: "4X/Help/$A API/Import and Fetch APIs/Import"
*/

(function () {
  $A.import(["ModuleDependency1", "ModuleDependency2", "Etc."], {
    name: "UniqueNameForImportInstance",
    // defer: true, // If needed
    // once: true, // If needed
    props: props, // Required
    call: function (props) {
      // Module code here.
    },
  });
})();
