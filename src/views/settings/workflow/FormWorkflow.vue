<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
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
                :isValid="err_workflow.approval_1 == false ? false : true"
                :description="
                  err_workflow.approval_1 == false
                    ? 'Approval 1 have an error'
                    : null
                "
              />
              <SelectOption
                title="Approval 2"
                :disabled="action == 'Read' ? true : false"
                :options="section"
                v-on:onchange="workflow.approval_2 = $event"
                :value="workflow.approval_2"
                :col="[3, 9]"
                :isValid="err_workflow.approval_2 == false ? false : true"
                :description="
                  err_workflow.approval_2 == false
                    ? 'Approval 2 have an error'
                    : null
                "
              />
              <SelectOption
                title="Approval 3"
                :disabled="action == 'Read' ? true : false"
                :options="section"
                v-on:onchange="workflow.approval_3 = $event"
                :value="workflow.approval_3"
                :col="[3, 9]"
              />
              <SelectOption
                title="Approval 4"
                :disabled="action == 'Read' ? true : false"
                :options="section"
                v-on:onchange="workflow.approval_4 = $event"
                :value="workflow.approval_4"
                :col="[3, 9]"
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
  </div>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { getMstSection } from '../../../resource/MstSection';
import { capitalizeFirstLetter } from '../../../utils';

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
      usedTransaction: [],
      transactionIsUsed: false,
      err_workflow: {
        approval_1: null,
        approval_2: null,
        approval_3: null,
        approval_4: null,
      },
      workflow: {
        approval_1: null,
        approval_2: null,
        approval_3: null,
        approval_4: null,
        id: null,
      },
      userValidation: false,
      section: [],
      menuOptions: [],
    };
  },
  methods: {
    loadWorkflowList() {
      let param = `raw=true&id=${this.$route.params.id}`;
      $axiosMertrack.get(`/v3/master/workflow?${param}`).then((response) => {
        let data = response.data.data[0];
        this.workflow = data;
      });
    },
    checkTransactionId() {
      for (var i = 0; i < this.usedTransaction.length; i++) {
        if (this.usedTransaction[i] == this.workflow.transactionId) {
          this.transactionIsUsed = true;
          this.$toast.open({
            message: `Transaction Already Used`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          break;
        } else if (this.usedTransaction[i] != this.workflow.transactionId) {
          this.transactionIsUsed = false;
        }
      }
    },
    checkDuplicateApproval() {
      var dupe = false;
      let index_duplicate = [];
      for (var i = 1; i <= 4; i++) {
        let usr_id = this.workflow[`approval_${i}`];
        for (var x = 1; x <= 4; x++) {
          let find = this.workflow[`approval_${x}`];
          if (usr_id && i != x && usr_id === find) {
            index_duplicate.push([`approval_${i}`], [`approval_${x}`]);
            dupe = true;
            break;
          }
        }
        if (dupe) {
          this.err_workflow[index_duplicate[0]] = false;
          this.err_workflow[index_duplicate[1]] = false;
          return false;
        }
      }
      return true;
    },

    save() {
      let can_process = true;
      this.err_workflow = {
        approval_1: true,
        approval_2: true,
        approval_3: true,
        approval_4: true,
      };
      if (!this.workflow.approval_1) {
        this.err_workflow.approval_1 = false;
        can_process = false;
      }
      if (
        !this.workflow.approval_2 &&
        (this.workflow.approval_3 || this.workflow.approval_4)
      ) {
        this.err_workflow.approval_2 = false;
        can_process = false;
      }
      if (!this.workflow.approval_3 && this.workflow.approval_4) {
        this.err_workflow.approval_3 = false;
        can_process = false;
      }
      if (!this.checkDuplicateApproval() || !can_process) {
        return;
      }
      // check duplicate approval
      let body = {
        id: this.$route.params.id,
        approval_1: this.workflow.approval_1,
        approval_2: this.workflow.approval_2,
        approval_3: this.workflow.approval_3,
        approval_4: this.workflow.approval_4,
      };
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack.post('/v3/master/workflow', body).then((result) => {
          this.$isLoading(false);
          let res = result.data;
          this.$toast.open({
            message: res.error
              ? res.message
              : `Data has been saved succesfully `,
            type: res.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          if (!res.error) {
            this.$router.back();
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
      this.$router.back();
    },
  },
};
</script>
