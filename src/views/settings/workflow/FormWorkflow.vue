<template>
  <CRow>
    <CCol md="12">
      <CCard>
        <CCardHeader class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">{{ $activeMenu.name }} [{{ route_action }}]</h5>
          <ButtonInfo :formData="workflow" v-if="action !== 'Create'" />
        </CCardHeader>
        <CCardBody>
          <CForm>
            <InputDefault
              :disabled="true"
              title="Transaction"
              v-model="workflow['transaction_label']"
            />
            <SelectOption
              title="Approval 1"
              :disabled="action == 'Read' ? true : false"
              :options="section"
              required
              v-on:onchange="workflow.approval_1 = $event"
              :value="workflow.approval_1"
              :col="[3, 9]"
              :isValid="initialLoad ? null : checkError(1) ? false : true"
              :invalid_feedback="checkError(1)"
            />
            <SelectOption
              title="Approval 2"
              :disabled="action == 'Read' ? true : false"
              :options="section"
              v-on:onchange="workflow.approval_2 = $event"
              :value="workflow.approval_2"
              :col="[3, 9]"
              :isValid="initialLoad ? null : checkError(2) ? false : true"
              :invalid_feedback="checkError(2)"
            />
            <SelectOption
              title="Approval 3"
              :disabled="action == 'Read' ? true : false"
              :options="section"
              v-on:onchange="workflow.approval_3 = $event"
              :value="workflow.approval_3"
              :col="[3, 9]"
              :isValid="initialLoad ? null : checkError(3) ? false : true"
              :invalid_feedback="checkError(3)"
            />
            <SelectOption
              title="Approval 4"
              :disabled="action == 'Read' ? true : false"
              :options="section"
              v-on:onchange="workflow.approval_4 = $event"
              :value="workflow.approval_4"
              :col="[3, 9]"
              :isValid="initialLoad ? null : checkError(4) ? false : true"
              :invalid_feedback="checkError(4)"
            />
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton
            type="submit"
            size="sm"
            color="primary"
            @click="save()"
            v-if="action != 'Read'"
          >
            <CIcon name="cil-check-circle" />
            Submit
          </CButton>
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { getMstSection } from '../../../resource/MstSection';
import { capitalizeFirstLetter, handleBack } from '../../../utils';

export default {
  name: 'FormWorkflow',
  mounted() {
    this.loadWorkflowList();
    this.loadSection();
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
  },
  data() {
    return {
      initialLoad: true,
      action: '',
      route_action: '',
      workflow: {
        approval_1: null,
        approval_2: null,
        approval_3: null,
        approval_4: null,
        id: this.$route.params.id,
      },
      section: [],
    };
  },
  methods: {
    checkError(idx) {
      if (this.initialLoad) return null;
      // Check Duplicate Approval
      let thisApproval = this.workflow[`approval_${idx}`];
      for (let i = 1; i <= 4; i++) {
        if (i != idx && thisApproval) {
          if (thisApproval == this.workflow[`approval_${i}`])
            return 'Duplicate section assignment. Each section can be assigned to only one approval level.';
        }
      }
      // Check approval pertama itu wajib ada isinya
      if (idx == 1 && !this.workflow.approval_1) {
        return 'Approval 1 is required';
      }
      // Check approval jika ada bolong sebelumnya e.g: [2, 12, null, 41]
      for (let i = idx + 1; i <= 4; i++) {
        if (!thisApproval && this.workflow[`approval_${i}`]) {
          return `Approval ${idx} is missing. Please fill all approvals in sequence.`;
        }
      }
      return null;
    },

    getErrorMessage(idx) {},
    loadWorkflowList() {
      let param = `raw=true&id=${this.$route.params.id}`;
      $axiosMertrack.get(`/v3/master/workflow?${param}`).then((response) => {
        let data = response.data.data[0];
        this.workflow = data;
      });
    },
    isValid() {
      for (let i = 1; i <= 4; i++) {
        if (this.checkError(i)) {
          return false;
        }
      }
      return true;
    },
    save() {
      this.initialLoad = false;
      if (!this.isValid()) {
        this.$toast.open({
          message: 'Please input all the required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack
          .post('/v3/master/workflow', this.workflow)
          .then((result) => {
            this.$isLoading(false);
            let res = result.data;
            this.$toast.open({
              message: res.error
                ? res.message
                : `Data has been saved successfully `,
              type: res.error ? 'error' : 'success',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
            if (!res.error) {
              handleBack(this.$router, this.$route);
            }
          });
      }
      return;
    },
    async loadSection() {
      let _res = await getMstSection({ status: 'Active' });
      if (_res && !_res.error) {
        let data = _res.data;
        for (const it of data) {
          this.section.push({
            label: it.name,
            value: it.id,
          });
        }
      }
      return;
    },
    onSetApproval() {
      if (!this.workflow.approval_1) {
        this.$toast.open({
          message: `Please input Approval 1`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      }
    },

    cancel() {
      handleBack(this.$router, this.$route);
    },
  },
};
</script>
