describe('Stand alone A/B tests', () => {
  before(() => {
    cy.cleanInstall();
  });

  beforeEach(() => {
    cy.login();
    cy.disableTooltips();
  });

  afterEach(() => {
    cy.logout();
  });

  function createStandAloneTest(name: string): void {
    cy.visitAdmin('post-new.php?post_type=abt4wp-test&skipOnboarding=1');

    // wait for test to get focus
    cy.focusBlock();

    // fill in title
    cy.get('#post-title-0')
      .type(name, { force: true });

    // save test
    cy.savePost();

    // wait for save message
    cy.contains('Post published.');
  }

  it('Should allow the user to create a stand alone test', () => {
    createStandAloneTest('This is a stand alone test');

    // reload and skip onboarding
    cy.location()
      .then(({ pathname, search }) => {
        cy.visit(`${pathname}${search}&skipOnboarding=1`);
      });
  });

  it('Should be able to pick stand alone tests when adding A/B test in content', () => {
    const TEST_TITLE = 'Stand alone in content';

    createStandAloneTest(TEST_TITLE);

    // go to new post create page
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // should see popup
    cy.get('.components-modal__content');

    // choose to insert existing
    cy.get('.Inserter__actions > .is-secondary')
      .click();

    // select correct test
    cy.get('#inspector-select-control-0')
      .select(TEST_TITLE);

    // add to content
    cy.get('.Inserter__picking > .is-primary')
      .click()
      .wait(500);

    // Click on test to activate
    cy.get('.EditWrapper__Overlay')
      .click();

    // check if editing page is loaded
    cy.contains(TEST_TITLE);
  });

  it('Can choose to add inline test when adding to content', () => {
    createStandAloneTest('Dummy test to pop up choice');

    // go to new post create page
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // should see popup
    cy.get('.components-modal__content');

    // choose to insert new
    cy.get('.Inserter__actions > .is-primary')
      .click();

    // should have added standard test
    cy.contains('Button for Test Variant "A"');
  });

  it('Can use shortcode of stand alone test', () => {
    createStandAloneTest('Shortcode test A/B Test');

    // close publish side bar
    cy.get('.edit-post-sidebar-header > .components-button')
      .click();

    // open options
    cy.get('.components-button[aria-label=Settings]')
      .click();

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // grab shortcode
    cy.get('code')
      .then((code) => {
        const codeText = code.text();

        // go to new post create page
        cy.visitAdmin('post-new.php?skipOnboarding=1');

        // add shortcode block
        cy.addBlockInEditor('Shortcode');

        // input shortcode
        cy.get('#blocks-shortcode-input-0')
          .type(codeText);
      });

    // save content
    cy.savePost();

    // go to post
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button')
      .click();

    // should have added standard test
    cy.contains('Button for Test Variant “A”');
  });
});
