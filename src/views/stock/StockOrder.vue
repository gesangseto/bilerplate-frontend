<template>
  <div>
       <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <strong>Stock Order Form</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                label="No"
                horizontal
                placeholder="Enter No"
              />
              <CInput
                label="Ref No"
                horizontal
                placeholder="Enter Ref No"
              />
              <CSelect
                label="Order Status"
                :options="listOrderStatus"
                horizontal
              />
              <CSelect
                label="Customer"
                :options="listCustomer"
                horizontal
              />
              
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary"><CIcon name="cil-check-circle"/> Submit</CButton>
            <CButton type="reset" size="sm" color="danger"><CIcon name="cil-ban"/> Reset</CButton>
          </CCardFooter>
        </CCard>
      </CCol>

    </CRow>
  </div>
</template>

<script>
export default {
  name: 'Forms',
  data () {
    return {
      selected: [], // Must be an array reference!
      show: true,
      horizontal: { label:'col-3', input:'col-9' },
      options: ['Option 1', 'Option 2', 'Option 3'],
      statusOptions: ['Active', 'Inactive'],
      selectOptions: [
        'Option 1', 'Option 2', 'Option 3',
        { 
          value: ['some value', 'another value'], 
          label: 'Selected option'
        }
      ],
      listOrderStatus: ['1','2','3'],
      listCustomer: ['1','2','3'],
      listGudang: ['1','2','3'],
        selectedOption: ['some value', 'another value'],

      formCollapsed: true,
      checkboxNames: ['Checkboxes', 'Inline Checkboxes',
                      'Checkboxes - custom', 'Inline Checkboxes - custom'],
      radioNames: ['Radios', 'Inline Radios',
                    'Radios - custom', 'Inline Radios - custom'],
        radioStatus: ['Status', 'Inline Radios',
                    'Radios - custom', 'Inline Radios - custom']
    }
  },
  methods: {
    validator (val) {
      return val ? val.length >= 4 : false
    }
  }
}
</script>
