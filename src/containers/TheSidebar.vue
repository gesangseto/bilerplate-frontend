<template>
  <CSidebar
    color-scheme="dark"
    style="background-color: #553b9c"
    class="bg-theme"
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand
      to="/home"
      style="
        width: 100%;
        height: 120px;
        min-height: 120px;
        flex: 0 0 120px;
        padding: 0;
        overflow: hidden;
        box-sizing: border-box;
      "
    >
      <div id="app_image" ref="app_image">
        <img :src="entityLogo" alt="Entity Logo" />
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
            :style="{ maxHeight: item.expand ? '260px' : '0px' }"
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
import { getConfUserApp, getLogo, getMenu } from '../utils';
import nav from './_nav';

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
      conf_user_app: null,
    };
  },
  name: 'TheSidebar',
  beforeCreate() {
    let navmenu = nav;
    navmenu[0]._children = getMenu();
    this.nav = navmenu;
  },
  mounted() {
    console.log('%cWhat are You looking for?', 'color:red;font-size:24pt');
    this.navMenu = this.renderMenu();
    this.entityLogo = getLogo();
    this.$nextTick(() => {
      this.autoExpandActiveMenu();
    });
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
        this.part_path = this.full_path.split('/');
        this.$nextTick(() => {
          this.autoExpandActiveMenu();
        });
      },
    },
  },
  methods: {
    renderMenu() {
      let menus = [];
      if (this.backupNavMenu.length === 0) {
        let have_children =
          Array.isArray(this.nav[0]._children) &&
          this.nav[0]._children.length > 0;
        if (have_children)
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
      let conf_app = getConfUserApp();
      if (this.navMenu[index].expand == true) {
        this.navMenu[index].expand = false;
        return;
      }
      if (conf_app.accordion) {
        this.navMenu = this.renderMenu();
      }
      setTimeout(() => {
        this.navMenu[index].expand = !this.navMenu[index].expand;
      }, 100);
    },
    handleClickParentMenu(item, index) {
      if (this.navMenu[index].expand === true) {
        this.navMenu[index].expand = false;
        return;
      }
      this.getExpandMenu(index);
      if (item.link && item.link !== this.full_path) {
        this.$router.push({ path: `${item.link}` });
      }
    },
    autoExpandActiveMenu() {
      if (this.part_path.length < 3) return;
      const activePath = `/${this.part_path[1]}/${this.part_path[2]}`;
      this.navMenu.forEach((item) => {
        if (item.items && Array.isArray(item.items)) {
          const hasActiveChild = item.items.some(
            (child) => child.link === activePath,
          );
          if (hasActiveChild) {
            item.expand = true;
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.mainmenu .active-parent {
  border-left: 5px solid #ffffff;
  background-color: #f6f4fb;
  color: #3d2a6e;
}
.mainmenu .expand-parent {
  border-left: 5px solid rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}
.icon-style {
  color: #ffffff;
}
.submenu .active-child {
  border-left: 5px solid #553b9c;
  background-color: #edeffd;
  color: #553b9c;
}

#app_image {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #553b9c;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

#app_image img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
  object-fit: contain;
}

.navigation {
  overflow: hidden;
  flex: 1 1 auto;
  width: 100%;
  overflow-y: auto;
  background-color: transparent;
}

.mainmenu,
.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mainmenu li {
  margin-bottom: 4px;
}

.mainmenu a,
.submenu a {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #e9e4f5;
  padding: 14px 18px;
  border-radius: 14px;
  transition: background 0.2s ease, color 0.2s ease;
}

.submenu a {
  color: #3d2a6e;
  border-radius: 0;
}

.mainmenu a {
  background-color: transparent;
}

.mainmenu a:hover,
.submenu a:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.mainmenu .active-parent:hover {
  color: #3d2a6e;
}

.submenu a:hover {
  background-color: #edeffd;
  color: #3d2a6e;
}

.mainmenu .active-parent {
  color: #3d2a6e;
}

.mainmenu .active-parent .icon-style,
.submenu .active-child .icon-style {
  color: #553b9c;
}
.mainmenu .expand-parent .icon-style {
  color: #ffffff;
}

.mainmenu a .icon-style,
.submenu a .icon-style {
  transition: color 0.2s ease;
}

.mainmenu a .float-right {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.7);
}

.submenu {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.15s ease;
  background-color: #f6f4fb;
  border-radius: 0;
  margin: 0 8px;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>
