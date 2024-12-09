import React from 'react'
import ComplaintPageTravelers from './ComplaintPageTravelers'

describe('<ComplaintPageTravelers />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ComplaintPageTravelers />)
  })
})