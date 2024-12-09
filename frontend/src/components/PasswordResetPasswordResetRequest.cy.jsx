import React from 'react'
import PasswordResetRequest from './PasswordReset'

describe('<PasswordResetRequest />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PasswordResetRequest />)
  })
})