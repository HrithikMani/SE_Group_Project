import React from 'react'
import EmployeeForm from './EmployeeForm'

describe('<EmployeeForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<EmployeeForm />)
  })
})