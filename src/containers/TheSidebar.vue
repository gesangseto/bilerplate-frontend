<template>
  <CSidebar
    color-scheme="dark"
    style="background-color: #000060"
    class="bg-theme"
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand to="/">
      <div
        class="col-sm-12"
        style="background-color: #000060"
        id="app_image"
        ref="app_image"
      >
        <img
          v-bind:src="entityLogo"
          style="
            width: 90px;
            heigth: auto;
            display: block;
            margin: auto;
            padding-top: 14px;
          "
        />
      </div>
    </CSidebarBrand>
    <!-- <CRenderFunction flat :content-to-render="nav" /> -->
    <nav class="navigation">
      <ul class="mainmenu" v-for="(item, index) in navMenu" :key="index">
        <li>
          <!-- MENU WITHOUT CHILD -->
          <a
            v-if="item.link"
            @click="handleClickParentMenu(item, index)"
            :href="`#${item.link}`"
            :class="{ 'active-parent': item.link == `/${part_path[1]}` }"
          >
            <CIcon
              :name="item.icon"
              :class="{ 'icon-style': item.link == `/${part_path[1]}` }"
            />
            &nbsp;&nbsp;&nbsp;{{ item.name }}
          </a>
          <!-- MENU WITHOUT CHILD -->

          <!-- MENU WITH CHILD -->
          <a
            v-if="!item.link"
            @click="handleClickParentMenu(item, index)"
            :class="{ 'expand-parent': item.expand }"
          >
            <CIcon :name="item.icon" :class="{ 'icon-style': item.expand }" />
            &nbsp;&nbsp;&nbsp;{{ item.name }}
            <v-icon
              :name="item.expand ? 'chevron-down' : 'chevron-left'"
              class="float-right"
              scale="0.6"
              style="margin-top: 7px"
            />
          </a>
          <ul
            class="submenu"
            v-for="(child_item, child_index) in item.items"
            :key="child_index"
            :style="item.expand ? 'max-height: 200px;' : ''"
          >
            <li>
              <a
                :href="`#${child_item.link}`"
                :class="{
                  'active-child':
                    child_item.link == `/${part_path[1]}/${part_path[2]}`,
                }"
              >
                <span> </span>
                <CIcon :name="child_item.icon" />
                &nbsp;&nbsp;&nbsp;{{ child_item.name }}
              </a>
            </li>
          </ul>
          <!-- MENU WITH CHILD -->
        </li>
      </ul>
    </nav>
  </CSidebar>
</template>

<script>
import nav from "./_nav";

export default {
  data() {
    return {
      userPermission: [],
      nav: nav,
      entityLogo: null,
      navMenu: [],
      backupNavMenu: [],
      full_path: null,
      part_path: [],
    };
  },
  name: "TheSidebar",
  mounted() {
    console.log("%cWhat are You looking for?", "color:red;font-size:24pt");
    this.navMenu = this.renderMenu();
    this.entityLogo = localStorage.getItem("app_image");
  },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        // this.full_path = route.matched[1];
        this.full_path = route.path;
        this.part_path = this.full_path.split("/");
      },
    },
    show: {
      immediate: true,
      handler(n, o) {},
    },
  },
  methods: {
    renderMenu() {
      let menus = [];
      if (this.backupNavMenu.length === 0) {
        for (const it of this.nav[0]._children[0]._children) {
          let menu = it;
          menu.expand = false;
          menus.push(menu);
        }
        this.backupNavMenu = menus;
      } else {
        menus = this.backupNavMenu;
      }
      menus = JSON.stringify(menus);
      return JSON.parse(menus);
    },
    getExpandMenu(index) {
      if (this.navMenu[index].expand == true) {
        this.navMenu[index].expand = false;
        return;
      }
      this.navMenu = this.renderMenu();
      setTimeout(() => {
        this.navMenu[index].expand = !this.navMenu[index].expand;
      }, 100);
    },
    handleClickParentMenu(item, index) {
      this.getExpandMenu(index);
      if (item.link === this.full_path) {
        return;
      }
      if (item.link) {
        this.$router.push({ path: `${item.link}` });
      }
    },
  },
};
</script>
<style scoped></style>
<style scoped>
.mainmenu .active-parent {
  border-left: 5px solid #f4d608;
  background-color: #0018ab;
  color: #ffffff;
}
.mainmenu .expand-parent {
  border-left: 5px solid #0018ab;
  background-color: #0018ab;
  color: #ffffff;
}
.icon-style {
  color: #f4d608;
}
.submenu .active-child {
  border-left: 5px solid #f4d608;
  background-color: #cdd4fa;
  color: #0018ab;
}
.navigation {
  overflow: hidden;
  position: fixed;
  width: 256px;
  overflow-y: scroll;
  top: 80px;
  bottom: 0;
  background-color: #000060;
}
.mainmenu,
.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
}
.mainmenu a {
  border-left: 5px solid #000060;
  display: block;
  background-color: #000060;
  text-decoration: none;
  padding: 15px;
  color: #b5b5b5;
}
.mainmenu p {
  padding: 10px;
}
.mainmenu a:hover {
  border-left: 5px solid #f4d608;
  color: white;
}
.mainmenu li:hover .submenu {
  display: block;
}
.submenu a {
  border-left: 5px solid #e9f1ff;
  background-color: #e9f1ff;
  color: #505050;
}
.submenu a:hover {
  border-left: 5px solid #f4d608;
  color: #0018ab;
}
.submenu {
  overflow: hidden;
  max-height: 0;
  /* transition: all 0.3 ease-in-out; */
  transition: all 0.3s ease-in-out;
}

::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
</style>
