describe("tests", () => {
  beforeEach(async () => {
    jasmine.attachToDOM(atom.views.getView(atom.workspace))

    /*    Activation     */
    // Trigger deferred activation
    atom.packages.triggerDeferredActivationHooks()
    // Activate activation hook
    atom.packages.triggerActivationHook("core:loaded-shell-environment")

    // Activate the package
    await atom.packages.activatePackage("ide-d")
  })

  it("Installation", function () {
    expect(atom.packages.isPackageLoaded("ide-d")).toBeTruthy()
    const allDeps = atom.packages.getAvailablePackageNames()
    expect(allDeps.includes("atom-ide-base")).toBeTruthy()
  })

  it("Activation", async function () {
    expect(atom.packages.isPackageLoaded("ide-d")).toBeTruthy()

    await atom.packages.activatePackage("atom-ide-base")
    expect(atom.packages.isPackageLoaded("atom-ide-base")).toBeTruthy()
  })
})
