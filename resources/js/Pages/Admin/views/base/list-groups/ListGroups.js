import React from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CListGroup,
  CListGroupItem,
  CRow,
} from '@coreui/react'

const ListGroups = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Basic example</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              The default list group is an unordered list with items and the proper CSS classes.
              Build upon it with the options that follow, or with your CSS as required.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Active items</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Add <code>active</code> boolean property to a <code>&lt;CListGroupItem&gt;</code> to
              show the current active selection.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Disabled items</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Add <code>disabled</code> boolean property to a <code>&lt;CListGroupItem&gt;</code> to
              make it appear disabled.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Links and buttons</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Use <code>&lt;a&gt;</code>s or <code>&lt;button&gt;</code>s to create{' '}
              <em>actionable</em> list group items with hover, disabled, and active states by adding{' '}
              <code>component=&#34;a|button&#34;</code>. We separate these pseudo-classes to ensure
              list groups made of non-interactive elements (like <code>&lt;li&gt;</code>s or{' '}
              <code>&lt;div&gt;</code>
              s) don&#39;tprovide a click or tap affordance.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Flush</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Add <code>flush</code> boolean property to remove some borders and rounded corners to
              render list group items edge-to-edge in a parent container (e.g., cards).
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Horizontal</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Add <code>layout=&#34;horizontal&#34;</code> to change the layout of list group items
              from vertical to horizontal across all breakpoints. Alternatively, choose a responsive
              variant <code>.layout=&#34;horizontal-&#123;sm | md | lg | xl | xxl&#125;&#34;</code>{' '}
              to make a list group horizontal starting at that breakpoint&#39;s{' '}
              <code>min-width</code>. Currently{' '}
              <strong>horizontal list groups cannot be combined with flush list groups.</strong>
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Contextual classes</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Use contextual classes to style list items with a stateful background and color.
            </p>

            <p className="text-body-secondary small">
              Contextual classes also work with <code>&lt;a&gt;</code>s or{' '}
              <code>&lt;button&gt;</code>s. Note the addition of the hover styles here not present
              in the previous example. Also supported is the <code>active</code> state; apply it to
              indicate an active selection on a contextual list group item.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>With badges</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Add badges to any list group item to show unread counts, activity, and more.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Custom content</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Add nearly any HTML within, even for linked list groups like the one below, with the
              help of <a href="https://coreui.io/docs/utilities/flex/">flexbox utilities</a>.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React List Group</strong> <small>Checkboxes and radios</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Place CoreUI&#39;s checkboxes and radios within list group items and customize as
              needed.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ListGroups
