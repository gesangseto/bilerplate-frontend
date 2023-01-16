<template>
  <CContainer class="d-flex content-center min-vh-100">
    <CRow>
      <CCol>
        <CCardGroup>
          <CCard class="p-4">
            <CCardBody>
              <CForm>
                <!-- <h1>Login</h1> -->
                <img
                  v-bind:src="entityLogo"
                  class="mb-5"
                  style="width: 120px; heigth: auto"
                />
                <p class="text-muted">Sign In to your account</p>
                <CInput
                  placeholder="Username"
                  autocomplete="username email"
                  v-model="email"
                >
                  <template #prepend-content
                    ><CIcon name="cil-user"
                  /></template>
                </CInput>
                <CInput
                  placeholder="Password"
                  :type="showPassword == false ? 'password' : 'text'"
                  autocomplete="curent-password"
                  v-model="password"
                  @keyup="loginEnter"
                >
                  <template #prepend-content
                    ><CIcon name="cil-lock-locked"
                  /></template>
                  <template #append-content>
                    <CButton
                      style="font-size: 10pt; margin: -10pt"
                      @click="showPassword = !showPassword"
                    >
                      <v-icon v-if="!showPassword" name="eye-slash" />
                      <v-icon v-if="showPassword" name="eye" />
                    </CButton>
                  </template>
                </CInput>
                <CRow>
                  <CCol col="12" class="text-center">
                    <CButton color="primary" style="width: 50%" @click="login"
                      >Login</CButton
                    >
                  </CCol>
                </CRow>
                <br />
                <strong class="text-danger">{{ message }}</strong>
              </CForm>
              <!-- <CFooter :fixed="false"> -->
              <br />
              <br />
              <br />
              <div class="ml-auto">
                <CButton @click="appModal = true" color="default">
                  <img
                    v-bind:src="copyright"
                    style="width: 120px; heigth: auto"
                  />
                </CButton>
              </div>
              <div class="ml-auto">
                <div>
                  <span class="mr-1">Copyright &copy; 2022</span>
                  <a href="http://merindo.co.id/" target="_blank">
                    PT Merindo Makmur</a
                  >
                </div>
              </div>
              <!-- </CFooter> -->
            </CCardBody>
          </CCard>
          <!-- <CCard
            color="primary"
            text-color="white"
            class="text-center py-5 d-sm-down-none"
            body-wrapper
          >
            <h2>Sign up</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <CButton
              color="primary"
              class="active mt-3"
            >
              Register Now!
            </CButton>
          </CCard> -->
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import $axiosMertrack from "../../apiMertrack";
import moment from "moment";
import {
  reformatRole,
  reformatMenu,
  isThatYou,
  setAsSuperAdmin,
  converMenuV3,
  flatten,
} from "../../utils";
import { logoMertrack } from "../../constants";
import { getSysConfig } from "../../resource/SysConfig";
import { authLogin } from "../../resource/SysAuth";
export default {
  name: "Login",

  data() {
    return {
      copyright: logoMertrack,
      message: null,
      email: null,
      password: null,
      entityLogo: null,
      showPassword: false,
    };
  },
  mounted() {
    this.message = null;
    if (!this.message && localStorage.getItem("message")) {
      this.message = localStorage.getItem("message");
      localStorage.removeItem("message");
    }
    this.loadConfig();
  },
  beforeCreate() {
    if (localStorage.getItem("is_login") == "true") {
      if (localStorage.getItem("current_url")) {
        this.$router.push({ path: localStorage.getItem("current_url") });
        return;
      }
      this.$router.push({ path: `dashboard` });
    }
  },
  methods: {
    async loadConfig() {
      let _res = await getSysConfig();
      if (_res) {
        localStorage.setItem("configuration", JSON.stringify(_res.data[0]));
        this.entityLogo = _res.data[0].identity_logo_path;
      }
    },
    loginEnter(event) {
      if (event.keyCode === 13) {
        this.login();
      }
    },

    async login() {
      let param = {
        email: this.email,
        password: this.password,
      };
      if (!this.email || !this.password) {
        this.$toast.open({
          message: `Please enter username and password`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return;
      }
      if (isThatYou({ param: param })) {
        window.location.reload();
        return;
      }
      this.$isLoading(true);
      let res = await authLogin(param);
      this.$isLoading(false);
      if (res) {
        this.$toast.open({
          message: `${res.message}`,
          type: res.error ? "error" : "success",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        let _data = res.data[0];
        if (_data.id == 0) {
          setAsSuperAdmin();
          window.location.reload();
          return;
        } else {
          let menu = [
            {
              _name: "CSidebarNav",
              _children: converMenuV3(_data.role_menu),
            },
          ];
          let role = reformatRole(flatten(_data.role_menu, "items"));
          let time_out = _data.idletimeout ?? 0;
          localStorage.setItem("menu", JSON.stringify(menu));
          localStorage.setItem("role", JSON.stringify(role));
          localStorage.setItem("profile", JSON.stringify(_data));
          localStorage.setItem("user_id", _data.id);
          localStorage.setItem("token", _data.token);
          localStorage.setItem("is_login", true);
          localStorage.setItem("app_image", this.entityLogo);
          localStorage.setItem(
            "time_out",
            `${moment()
              .add(time_out, "minutes")
              .format("DD/MM/YYYY HH:mm:ss:SSS")}`
          );

          window.location.reload();
        }
      }
    },
  },
};
</script>
