// cypress/integration/complaintsPageTraveller.spec.js
describe('Complaints Page for Travellers', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the complaints form', () => {
    cy.get('[name=coachType]').should('exist');
    cy.get('[name=issueType]').should('exist');
    cy.get('[name=issueLocation]').should('exist');
    cy.get('[name=description]').should('exist');
    cy.get('.submit-btn').should('exist');
  });

  it('should raise a complaint on submitting the form with valid data', () => {
    cy.get('[name=coachType]').select('First Class');
    cy.get('[name=issueType]').select('Comfort Issue');
    cy.get('[name=issueLocation]').select('Coach 3');
    cy.get('[name=description]').type('The seat is uncomfortable.');
    cy.get('.submit-btn').click();
    cy.contains('Complaint submitted successfully').should('be.visible');
  });

  it('should show an error message on submitting the form with invalid data', () => {
    cy.get('[name=description]').type('Short description');
    cy.get('.submit-btn').click();
    cy.contains('Please provide complete information').should('be.visible');
  });
});
